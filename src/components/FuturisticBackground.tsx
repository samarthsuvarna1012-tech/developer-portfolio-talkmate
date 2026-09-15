import React, { useEffect, useRef } from 'react';

export const FuturisticBackground: React.FC = React.memo(() => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Mouse position lerp refs
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const targetX = useRef(0);
  const targetY = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Generate 60 Stars with depth layer & subtle drift
    const starCount = prefersReducedMotion ? 25 : 60;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.4,
      alpha: Math.random() * 0.6 + 0.2,
      depth: Math.random() * 0.8 + 0.2, // 0.2 (far) to 1.0 (near)
      speed: (Math.random() * 0.12 + 0.04) * (prefersReducedMotion ? 0 : 1),
    }));

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coords from -1 to 1
      targetX.current = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY.current = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize, { passive: true });

    let time = 0;

    const render = () => {
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      time += 0.008;

      // Smooth mouse lerp
      mouseX.current += (targetX.current - mouseX.current) * 0.05;
      mouseY.current += (targetY.current - mouseY.current) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Render starfield with depth-based parallax
      stars.forEach((star) => {
        star.y -= star.speed;
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }

        const alphaPulse = prefersReducedMotion 
          ? star.alpha 
          : star.alpha + Math.sin(time * 2 + star.x * 0.01) * 0.15;

        // Parallax shift based on depth
        const offsetX = mouseX.current * 18 * star.depth;
        const offsetY = mouseY.current * 18 * star.depth;

        ctx.fillStyle = `rgba(186, 230, 253, ${Math.max(0.1, Math.min(0.9, alphaPulse))})`;
        ctx.beginPath();
        ctx.arc(star.x + offsetX, star.y + offsetY, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Shift DOM nebula elements subtly with mouse lerp
      if (containerRef.current) {
        const shiftX = mouseX.current * 12;
        const shiftY = mouseY.current * 12;
        containerRef.current.style.transform = `translate3d(${shiftX.toFixed(2)}px, ${shiftY.toFixed(2)}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Dynamic Starfield Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-90" />

      {/* Parallax Nebula Container */}
      <div ref={containerRef} className="absolute inset-0 pointer-events-none transition-transform duration-75 ease-out">
        {/* Deep Space Ambient Radial Nebula Blobs */}
        <div 
          className="absolute top-[15%] left-[5%] w-[55vw] h-[55vw] max-w-[650px] max-h-[650px] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.18)_0%,rgba(99,102,241,0.08)_50%,transparent_75%)] blur-[120px] pointer-events-none animate-pulse"
          style={{ animationDuration: '10s' }}
        />
        <div 
          className="absolute top-[35%] right-[-5%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-[radial-gradient(circle,rgba(167,139,250,0.14)_0%,rgba(14,165,233,0.07)_55%,transparent_75%)] blur-[130px] pointer-events-none animate-pulse"
          style={{ animationDuration: '14s', animationDelay: '2s' }}
        />
        <div 
          className="absolute -bottom-[10%] left-[25%] w-[45vw] h-[45vw] max-w-[550px] max-h-[550px] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.12)_0%,rgba(6,182,212,0.08)_50%,transparent_75%)] blur-[140px] pointer-events-none animate-pulse"
          style={{ animationDuration: '16s', animationDelay: '4s' }}
        />
      </div>

      {/* Cybernetic Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#67e8f9_1px,transparent_1px),linear-gradient(to_bottom,#67e8f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"
      />

      {/* Vignette Rim Light */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(3,7,18,0.45)_100%)] pointer-events-none" />
    </div>
  );
});

FuturisticBackground.displayName = 'FuturisticBackground';

