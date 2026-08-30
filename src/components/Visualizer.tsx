import { useEffect, useRef } from 'react';

export default function Visualizer({ isPlaying }: { isPlaying: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let phase = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const numBars = 64;
      const barWidth = width / numBars;

      ctx.fillStyle = '#ea580c'; // Orange-600

      for (let i = 0; i < numBars; i++) {
        // Generate pseudo-random wave if playing, flat line if not
        let barHeight = 2;
        if (isPlaying) {
           const noise = Math.sin(phase + i * 0.2) * Math.cos(phase * 0.5 + i * 0.1);
           // Simulate 808 sub-bass kicks sporadically
           const kick = (i % 8 === 0 && Math.sin(phase * 2) > 0.8) ? Math.random() * 50 : 0;
           barHeight = 5 + Math.abs(noise) * (height / 2) + kick;
        }

        const x = i * barWidth;
        const y = height / 2 - barHeight / 2;

        ctx.fillRect(x + 1, y, barWidth - 2, barHeight);
      }

      phase += 0.1;
      animationId = requestAnimationFrame(render);
    };

    // Handle resize
    const resizeObserver = new ResizeObserver(() => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
    });
    
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    }

    render();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, [isPlaying]);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full absolute inset-0 opacity-80"
    />
  );
}
