import React, { useRef, useEffect } from 'react';

const BirdCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let mouse = { x: -1000, y: -1000, radius: 250 };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseOut = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);

    const boids = [];
    // Adjust number of boids based on screen size for performance
    const numBoids = Math.min(80, Math.floor((width * height) / 18000));
    
    // Synthora colors
    const colorMint = { r: 114, g: 239, b: 221 };
    const colorPurple = { r: 155, g: 81, b: 224 };

    for (let i = 0; i < numBoids; i++) {
      const isMint = Math.random() > 0.4;
      boids.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        color: isMint ? colorMint : colorPurple,
        size: Math.random() * 2 + 2,
        history: []
      });
    }

    // Boids parameters
    const visualRange = 100;
    const speedLimit = 3.5;
    const margin = 100;

    const drawBoid = (boid) => {
      const angle = Math.atan2(boid.vy, boid.vx);
      
      // Draw tail
      if (boid.history.length > 0) {
        ctx.beginPath();
        ctx.moveTo(boid.history[0].x, boid.history[0].y);
        for (let i = 1; i < boid.history.length; i++) {
          ctx.lineTo(boid.history[i].x, boid.history[i].y);
        }
        ctx.strokeStyle = `rgba(${boid.color.r}, ${boid.color.g}, ${boid.color.b}, 0.2)`;
        ctx.lineWidth = boid.size * 0.8;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      ctx.translate(boid.x, boid.y);
      ctx.rotate(angle);

      // Draw glowing bird shape
      ctx.beginPath();
      ctx.moveTo(boid.size * 3, 0); // Beak
      ctx.lineTo(-boid.size * 2, boid.size * 1.5); // Right wing
      ctx.lineTo(-boid.size, 0); // Tail
      ctx.lineTo(-boid.size * 2, -boid.size * 1.5); // Left wing
      ctx.closePath();

      ctx.fillStyle = `rgba(${boid.color.r}, ${boid.color.g}, ${boid.color.b}, 0.9)`;
      ctx.shadowBlur = 15;
      ctx.shadowColor = `rgba(${boid.color.r}, ${boid.color.g}, ${boid.color.b}, 1)`;
      ctx.fill();

      ctx.rotate(-angle);
      ctx.translate(-boid.x, -boid.y);
      ctx.shadowBlur = 0; // Reset
    };

    const updateBoids = () => {
      for (let boid of boids) {
        let dxCohesion = 0;
        let dyCohesion = 0;
        let dxSeparation = 0;
        let dySeparation = 0;
        let dxAlignment = 0;
        let dyAlignment = 0;
        let numNeighbors = 0;

        for (let otherBoid of boids) {
          if (boid !== otherBoid) {
            const dx = boid.x - otherBoid.x;
            const dy = boid.y - otherBoid.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < visualRange * visualRange) {
              const dist = Math.sqrt(distSq);
              // Cohesion
              dxCohesion += otherBoid.x;
              dyCohesion += otherBoid.y;
              
              // Alignment
              dxAlignment += otherBoid.vx;
              dyAlignment += otherBoid.vy;
              
              // Separation
              if (dist < 30) {
                dxSeparation += boid.x - otherBoid.x;
                dySeparation += boid.y - otherBoid.y;
              }
              numNeighbors += 1;
            }
          }
        }

        if (numNeighbors > 0) {
          // Cohesion
          dxCohesion = (dxCohesion / numNeighbors - boid.x) * 0.005;
          dyCohesion = (dyCohesion / numNeighbors - boid.y) * 0.005;
          
          // Alignment
          dxAlignment = (dxAlignment / numNeighbors - boid.vx) * 0.05;
          dyAlignment = (dyAlignment / numNeighbors - boid.vy) * 0.05;
          
          boid.vx += dxCohesion + dxAlignment + dxSeparation * 0.05;
          boid.vy += dyCohesion + dyAlignment + dySeparation * 0.05;
        }

        // Mouse interaction (Scatter)
        const dxMouse = boid.x - mouse.x;
        const dyMouse = boid.y - mouse.y;
        const distSqMouse = dxMouse * dxMouse + dyMouse * dyMouse;
        if (distSqMouse < mouse.radius * mouse.radius) {
          const distMouse = Math.sqrt(distSqMouse);
          const force = (mouse.radius - distMouse) / mouse.radius;
          boid.vx += (dxMouse / distMouse) * force * 1.5;
          boid.vy += (dyMouse / distMouse) * force * 1.5;
        }

        // Edges
        if (boid.x < margin) boid.vx += 0.2;
        if (boid.x > width - margin) boid.vx -= 0.2;
        if (boid.y < margin) boid.vy += 0.2;
        if (boid.y > height - margin) boid.vy -= 0.2;

        // Speed limit
        const speedSq = boid.vx * boid.vx + boid.vy * boid.vy;
        if (speedSq > speedLimit * speedLimit) {
          const speed = Math.sqrt(speedSq);
          boid.vx = (boid.vx / speed) * speedLimit;
          boid.vy = (boid.vy / speed) * speedLimit;
        }

        // Add some random flutter
        boid.vx += (Math.random() - 0.5) * 0.2;
        boid.vy += (Math.random() - 0.5) * 0.2;

        boid.x += boid.vx;
        boid.y += boid.vy;

        // History for tail
        boid.history.push({ x: boid.x, y: boid.y });
        if (boid.history.length > 10) {
          boid.history.shift();
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      updateBoids();
      
      for (let boid of boids) {
        drawBoid(boid);
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

export default BirdCanvas;
