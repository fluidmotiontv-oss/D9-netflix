import React, { useRef, useEffect } from 'react';

interface SmokeEffectProps {
  active: boolean;
  className?: string;
}

export default function SmokeEffect({ active, className = '' }: SmokeEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<any[]>([]);
  const frameRef = useRef<number>(0);
  const windRef = useRef<number>(0.3);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      decay: number;
      size: number;
      growth: number;
      opacity: number;
      hue: number;

      constructor(x: number, y: number, big = false) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 0.5 + windRef.current;
        this.vy = -Math.random() * 1.5 - 0.5;
        this.life = 1.0;
        this.decay = Math.random() * 0.003 + 0.002;
        this.size = big ? Math.random() * 40 + 30 : Math.random() * 25 + 15;
        this.growth = Math.random() * 0.3 + 0.1;
        this.opacity = big ? 0.15 : 0.08;
        this.hue = Math.random() * 40 + 200;
      }

      update() {
        this.x += this.vx + Math.sin(frameRef.current * 0.01 + this.y * 0.01) * 0.3;
        this.y += this.vy;
        this.size += this.growth;
        this.life -= this.decay;
      }

      draw(canvasCtx: CanvasRenderingContext2D) {
        if (this.life <= 0) return;
        const g = canvasCtx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        const a = this.life * this.opacity;
        g.addColorStop(0, `hsla(${this.hue},60%,70%,${a})`);
        g.addColorStop(0.4, `hsla(${this.hue + 20},50%,60%,${a * 0.5})`);
        g.addColorStop(1, `hsla(${this.hue + 40},40%,50%,0)`);
        canvasCtx.fillStyle = g;
        canvasCtx.beginPath();
        canvasCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        canvasCtx.fill();
      }
    }

    const loop = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frameRef.current++;

      if (frameRef.current % 20 === 0 && particlesRef.current.length < 50) {
        particlesRef.current.push(new Particle(Math.random() * canvas.width, canvas.height + 20));
      }

      particlesRef.current = particlesRef.current.filter(p => p.life > 0);
      particlesRef.current.forEach(p => {
        p.update();
        p.draw(ctx);
      });
      animId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Trigger burst when active prop changes to true
  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const cx = canvas.width / 2;
    const cy = canvas.height - 50;

    for (let i = 0; i < 35; i++) {
      const isBig = i < 6;
      particlesRef.current.push(
        new (class {
          x = cx + (Math.random() - 0.5) * 80;
          y = cy + (Math.random() - 0.5) * 30;
          vx = (Math.random() - 0.5) * 0.8 + 0.3;
          vy = -Math.random() * 2.0 - 0.8;
          life = 1.0;
          decay = Math.random() * 0.003 + 0.002;
          size = isBig ? Math.random() * 45 + 35 : Math.random() * 25 + 15;
          growth = Math.random() * 0.4 + 0.1;
          opacity = isBig ? 0.2 : 0.1;
          hue = Math.random() * 40 + 190;

          update() {
            this.x += this.vx + Math.sin(frameRef.current * 0.01 + this.y * 0.01) * 0.4;
            this.y += this.vy;
            this.size += this.growth;
            this.life -= this.decay;
          }

          draw(ctx: CanvasRenderingContext2D) {
            if (this.life <= 0) return;
            const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
            const a = this.life * this.opacity;
            g.addColorStop(0, `hsla(${this.hue},70%,75%,${a})`);
            g.addColorStop(0.5, `hsla(${this.hue + 20},60%,65%,${a * 0.6})`);
            g.addColorStop(1, `hsla(${this.hue + 40},50%,50%,0)`);
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
          }
        })()
      );
    }
  }, [active]);

  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full min-h-[220px] rounded-2xl bg-gradient-to-b from-[#0a0a0f] via-[#111827] to-[#04070f] border border-emerald-500/30 shadow-2xl"
      />
      {active && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-mono text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.5)] animate-bounce pointer-events-none">
          💨 Sovereign Purchase Confirmed • Smoke Ignition Active!
        </div>
      )}
    </div>
  );
}
