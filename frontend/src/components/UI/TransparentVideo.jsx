import React, { useRef, useEffect } from 'react';

const TransparentVideo = ({ src, className, style, tolerance = 30 }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let animationFrameId;

    const computeFrame = () => {
      if (video.paused || video.ended) {
        animationFrameId = requestAnimationFrame(computeFrame);
        return;
      }
      
      // Ensure canvas matches video dimensions
      if (canvas.width !== video.videoWidth && video.videoWidth > 0) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      if (canvas.width === 0 || canvas.height === 0) {
        animationFrameId = requestAnimationFrame(computeFrame);
        return;
      }

      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Get image data
      let frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let data = frame.data;
      let len = data.length;

      // Sample background color from the top-left pixel (index 0,1,2)
      const bgR = data[0];
      const bgG = data[1];
      const bgB = data[2];

      for (let i = 0; i < len; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];
        
        // Euclidean distance in RGB space to determine similarity
        let distance = Math.sqrt(
          (r - bgR) * (r - bgR) +
          (g - bgG) * (g - bgG) +
          (b - bgB) * (b - bgB)
        );

        if (distance < tolerance) {
          // Complete transparency for matching colors
          data[i + 3] = 0; 
        } else if (distance < tolerance + 20) {
          // Smooth blending for edges (anti-aliasing)
          const alpha = ((distance - tolerance) / 20) * 255;
          data[i + 3] = alpha;
        }
      }
      
      ctx.putImageData(frame, 0, 0);
      animationFrameId = requestAnimationFrame(computeFrame);
    };

    // Force play in case autoplay was blocked or missed the event
    video.play().catch(e => console.log("Autoplay blocked:", e));
    
    // Start loop immediately
    computeFrame();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [tolerance]);

  return (
    <div className={className} style={{ position: 'relative', overflow: 'hidden', ...style }}>
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        style={{ display: 'none' }}
      />
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </div>
  );
};

export default TransparentVideo;
