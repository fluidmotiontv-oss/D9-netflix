import React, { useEffect, useRef, useState } from 'react';

interface TideSynthAudioViewProps {
  currentAct?: number; // 0: Act I, 1: Act II, 2: Act III
  onToggleSubAudioState?: (active: boolean) => void;
}

export default function TideSynthAudioView({ currentAct = 0, onToggleSubAudioState }: TideSynthAudioViewProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Colors per act: 0: Aqua, 1: Chromatic/Gold, 2: Violet
  const actThemes = [
    { primary: '#00f3ff', secondary: '#0066ff', label: 'ACT I: 432Hz SUB-LOCK', waveName: '432Hz Sine Wave' },
    { primary: '#ff00ea', secondary: '#ffd700', label: 'ACT II: CHROMATIC RIPPLE', waveName: 'Chromatic Multi-Freq' },
    { primary: '#a855f7', secondary: '#4c1d95', label: 'ACT III: VIOLET COLLAPSE', waveName: 'Violet Pulse & Particles' }
  ];

  const theme = actThemes[currentAct] || actThemes[0];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      alpha: number;
      vx: number;
      vy: number;
    }> = [];

    // Initialize particles for Act 3 smoke effect
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 20 + 10,
        alpha: Math.random() * 0.5 + 0.1,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -Math.random() * 0.8 - 0.2
      });
    }

    const render = () => {
      ctx.fillStyle = 'rgba(10, 10, 15, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const time = Date.now() * 0.002;

      // Draw Waveform Canvas Layer
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = theme.primary;
      ctx.shadowBlur = 15;
      ctx.shadowColor = theme.primary;

      for (let x = 0; x < canvas.width; x += 5) {
        let y = canvas.height / 2;
        if (currentAct === 0) {
          // Deep Sine Sub-Bass Wave (432Hz feel)
          y += Math.sin(x * 0.01 + time * 2) * 35;
        } else if (currentAct === 1) {
          // Chromatic Ripple Multi-Frequency
          y += Math.sin(x * 0.03 + time * 4) * 25 + Math.cos(x * 0.05 - time * 2) * 20;
        } else {
          // Violet Collapse Pulse
          y += Math.sin(x * 0.005 + time) * 50 * Math.sin(time * 0.5);
        }
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Render Act 3 Violet Smoke Particle System
      if (currentAct === 2) {
        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.y < -30) p.y = canvas.height + 20;
          if (p.x < 0 || p.x > canvas.width) p.x = Math.random() * canvas.width;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(168, 85, 247, ${p.alpha})`;
          ctx.shadowBlur = 25;
          ctx.shadowColor = '#8b5cf6';
          ctx.fill();
        });
      }

      // CRT Overlay Scanlines
      ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
      for (let y = 0; y < canvas.height; y += 4) {
        ctx.fillRect(0, y, canvas.width, 2);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [currentAct, theme]);

  const toggleSubAudio = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        // Base frequency: 432Hz in Act I, 432 / 2 = 216 or 108 sub-bass in Act II, 54Hz in Act III
        const freq = currentAct === 0 ? 432 : currentAct === 1 ? 216 : 108;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        audioCtxRef.current = ctx;
        oscRef.current = osc;
        gainRef.current = gain;
        setIsPlaying(true);
        if (onToggleSubAudioState) onToggleSubAudioState(true);
      } else {
        if (isPlaying) {
          audioCtxRef.current.suspend();
          setIsPlaying(false);
          if (onToggleSubAudioState) onToggleSubAudioState(false);
        } else {
          audioCtxRef.current.resume();
          setIsPlaying(true);
          if (onToggleSubAudioState) onToggleSubAudioState(true);
        }
      }
    } catch (e) {
      console.warn('Audio context init blocked or unsupported', e);
    }
  };

  // Adjust frequency when currentAct changes if audio is running
  useEffect(() => {
    if (audioCtxRef.current && oscRef.current && isPlaying) {
      const freq = currentAct === 0 ? 432 : currentAct === 1 ? 216 : 108;
      oscRef.current.frequency.setTargetAtTime(freq, audioCtxRef.current.currentTime, 0.1);
    }
  }, [currentAct, isPlaying]);

  // Clean up audio context on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="relative w-full h-48 lg:h-56 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl p-4 flex flex-col justify-between">
      {/* Top Telemetry Header */}
      <div className="flex justify-between items-center z-10 border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: theme.primary }} />
          <span className="font-mono text-xs uppercase tracking-widest text-slate-200 font-bold">{theme.label}</span>
          <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">[{theme.waveName}]</span>
        </div>
        <button
          onClick={toggleSubAudio}
          className={`px-3 py-1 rounded-lg text-xs font-mono border transition-all flex items-center gap-1.5 ${
            isPlaying 
              ? 'border-emerald-500/60 bg-emerald-950/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
              : 'border-slate-700 bg-slate-900 hover:border-slate-500 text-slate-200'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
          <span>{isPlaying ? 'MUTE 432Hz SUB' : 'ENGAGE 432Hz SUB'}</span>
        </button>
      </div>

      {/* Main Reactive Canvas */}
      <canvas ref={canvasRef} width={800} height={240} className="absolute inset-0 w-full h-full object-cover opacity-80 pointer-events-none" />

      {/* Bottom Controls Indicator */}
      <div className="z-10 flex justify-between items-end">
        <div className="font-mono text-xs text-slate-400">
          MODE: <span style={{ color: theme.primary }} className="font-bold">DRAGON_9_TEMPORAL_RESONANCE</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            {currentAct === 0 ? 'CRT SCANLINES ON' : currentAct === 1 ? 'CHROMATIC RIPPLE ON' : 'VIOLET PARTICLES (60)'}
          </span>
          <div className="font-mono text-xs text-slate-400 font-semibold">D9-CLK: 54M/HR</div>
        </div>
      </div>
    </div>
  );
}
