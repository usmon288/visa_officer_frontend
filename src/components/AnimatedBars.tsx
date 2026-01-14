import { useEffect, useRef } from 'react';

export function AnimatedBars() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let animationId: number;
    let time = 0;
    const waves = [
      { phase: 0, frequency: 0.03, amplitude: 80, color: '#10b98130' },
      { phase: Math.PI / 3, frequency: 0.025, amplitude: 100, color: '#3b82f625' },
      { phase: (2 * Math.PI) / 3, frequency: 0.02, amplitude: 60, color: '#f59e0b20' },
    ];

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.01;

      waves.forEach((wave) => {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);

        for (let x = 0; x < canvas.width; x += 5) {
          const y =
            canvas.height / 2 +
            Math.sin(x * wave.frequency + time + wave.phase) * wave.amplitude +
            Math.sin(x * wave.frequency * 0.5 + time * 0.5) * (wave.amplitude * 0.3);
          ctx.lineTo(x, y);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fillStyle = wave.color;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
    />
  );
}

export function AnimatedBarsGrid() {
  return (
    <div className="relative w-full h-[600px] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90 z-10" />
      <AnimatedBars />
    </div>
  );
}

export function FloatingBarsSphere() {
  return (
    <div className="relative w-[400px] h-[400px]" />
  );
}
