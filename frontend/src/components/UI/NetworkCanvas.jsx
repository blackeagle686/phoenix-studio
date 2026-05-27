import React, { useRef, useEffect } from 'react';

const NetworkCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Mouse tracking
    let mouse = { x: null, y: null, radius: 180 };

    const handleMouseMove = (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    };

    const handleMouseOut = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);

    const particles = [];
    const numParticles = Math.min(150, Math.floor((width * height) / 8000));
    
    // Theme colors: mint (#72EFDD) and purple (#9B51E0)
    const color1 = { r: 114, g: 239, b: 221 };
    const color2 = { r: 155, g: 81, b: 224 };

    for (let i = 0; i < numParticles; i++) {
      // 70% mint, 30% purple
      const isMint = Math.random() > 0.3;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: Math.random() * 2 + 0.5,
        color: isMint ? color1 : color2
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw particles
      for (let i = 0; i < numParticles; i++) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse interaction (push particles away gently)
        if (mouse.x != null && mouse.y != null) {
          let dx = mouse.x - p.x;
          let dy = mouse.y - p.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouse.radius - distance) / mouse.radius;
            const pushX = forceDirectionX * force * 5;
            const pushY = forceDirectionY * force * 5;
            
            p.x -= pushX;
            p.y -= pushY;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0.8)`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0.8)`;
        ctx.fill();
      }

      // Turn off shadow for lines to keep performance high
      ctx.shadowBlur = 0;

      // Draw lines
      for (let i = 0; i < numParticles; i++) {
        for (let j = i + 1; j < numParticles; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 180) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            
            // Linear gradient line between the two particle colors
            const grad = ctx.createLinearGradient(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
            grad.addColorStop(0, `rgba(${particles[i].color.r}, ${particles[i].color.g}, ${particles[i].color.b}, ${0.8 - dist / 180})`);
            grad.addColorStop(1, `rgba(${particles[j].color.r}, ${particles[j].color.g}, ${particles[j].color.b}, ${0.8 - dist / 180})`);
            
            ctx.strokeStyle = grad;
            ctx.lineWidth = (1 - dist / 180) * 2;
            ctx.stroke();
          }
        }
      }

      // Draw lines to mouse
      if (mouse.x != null && mouse.y != null) {
        for (let i = 0; i < numParticles; i++) {
          const dx = particles[i].x - mouse.x;
          const dy = particles[i].y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(${particles[i].color.r}, ${particles[i].color.g}, ${particles[i].color.b}, ${0.5 - dist / mouse.radius})`;
            ctx.lineWidth = (1 - dist / mouse.radius);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
};

export default NetworkCanvas;
