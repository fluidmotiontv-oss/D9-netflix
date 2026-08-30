import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface StonerDragonEffectsProps {
  isSmoking: boolean;
  onComplete: () => void;
}

export default function StonerDragonEffects({ isSmoking, onComplete }: StonerDragonEffectsProps) {
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play synthetic bong sound using Web Audio API
  useEffect(() => {
    if (isSmoking) {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const duration = 2.5;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Setup bubbling sound
      osc.type = 'sine';
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(1000, ctx.currentTime + duration);
      
      // Frequency modulation for bubbling effect
      osc.frequency.setValueAtTime(100, ctx.currentTime);
      for (let i = 0; i < 15; i++) {
        const time = ctx.currentTime + (i * (duration / 15));
        osc.frequency.setValueAtTime(150 + Math.random() * 200, time);
        osc.frequency.exponentialRampToValueAtTime(50, time + 0.1);
      }

      // Volume envelope
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.2);
      gainNode.gain.setValueAtTime(0.5, ctx.currentTime + duration - 0.5);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);

      const timer = setTimeout(() => {
        onComplete();
      }, 12000); // Effect lasts 12 seconds total (sound + glitch + camera)

      return () => clearTimeout(timer);
    }
  }, [isSmoking, onComplete]);

  // Generate random smoke particles
  const particles = Array.from({ length: 25 }).map((_, i) => ({
    id: i,
    left: 40 + Math.random() * 20 + '%',
    animationDuration: 3 + Math.random() * 3 + 's',
    animationDelay: Math.random() * 1.5 + 's',
    size: 50 + Math.random() * 100 + 'px',
  }));

  return (
    <>
      <style>{`
        @keyframes float-smoke {
          0% {
            transform: translateY(100vh) scale(0.5) rotate(0deg);
            opacity: 0;
            filter: blur(10px);
          }
          20% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-20vh) scale(3) rotate(45deg);
            opacity: 0;
            filter: blur(40px);
          }
        }
        .smoke-particle {
          position: absolute;
          bottom: 0;
          background: radial-gradient(circle, rgba(200, 200, 200, 0.4) 0%, rgba(200, 200, 200, 0) 70%);
          border-radius: 50%;
          pointer-events: none;
          mix-blend-mode: screen;
          animation-name: float-smoke;
          animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          animation-fill-mode: forwards;
        }

        @keyframes glitch-anim-1 {
          0% { clip-path: inset(20% 0 80% 0); transform: translate(-2px, 2px); }
          20% { clip-path: inset(60% 0 10% 0); transform: translate(2px, -2px); }
          40% { clip-path: inset(40% 0 50% 0); transform: translate(-2px, 2px); }
          60% { clip-path: inset(80% 0 5% 0); transform: translate(2px, -2px); }
          80% { clip-path: inset(10% 0 70% 0); transform: translate(-2px, 2px); }
          100% { clip-path: inset(30% 0 50% 0); transform: translate(2px, -2px); }
        }
        @keyframes glitch-anim-2 {
          0% { clip-path: inset(10% 0 60% 0); transform: translate(2px, -2px); }
          20% { clip-path: inset(30% 0 20% 0); transform: translate(-2px, 2px); }
          40% { clip-path: inset(70% 0 10% 0); transform: translate(2px, -2px); }
          60% { clip-path: inset(20% 0 50% 0); transform: translate(-2px, 2px); }
          80% { clip-path: inset(50% 0 30% 0); transform: translate(2px, -2px); }
          100% { clip-path: inset(5% 0 80% 0); transform: translate(-2px, 2px); }
        }
        .dragon-glitch-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: inherit;
          opacity: 0.8;
          mix-blend-mode: screen;
        }
        .glitch-red {
          animation: glitch-anim-1 0.2s infinite linear alternate-reverse;
          filter: drop-shadow(2px 0 0 red);
        }
        .glitch-cyan {
          animation: glitch-anim-2 0.3s infinite linear alternate-reverse;
          filter: drop-shadow(-2px 0 0 cyan);
        }

        @keyframes plasma-pulse {
          0% { transform: scale(1) rotate(0deg); opacity: 0.3; }
          33% { transform: scale(1.5) rotate(120deg); opacity: 0.8; }
          66% { transform: scale(0.8) rotate(240deg); opacity: 0.5; }
          100% { transform: scale(1) rotate(360deg); opacity: 0.3; }
        }
        .plasma-layer {
          position: absolute;
          inset: -50%;
          background: 
            radial-gradient(circle at 30% 30%, rgba(255, 0, 255, 0.4) 0%, transparent 40%),
            radial-gradient(circle at 70% 60%, rgba(0, 255, 255, 0.4) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(34, 197, 94, 0.5) 0%, transparent 40%),
            radial-gradient(circle at 60% 20%, rgba(255, 165, 0, 0.4) 0%, transparent 50%);
          mix-blend-mode: color-dodge;
          animation: plasma-pulse 8s infinite ease-in-out alternate;
          pointer-events: none;
        }

        @keyframes camera-baked {
          0% { transform: scale(1) rotate(0deg) translate(0, 0); filter: blur(0px) hue-rotate(0deg); }
          10% { transform: scale(1.05) rotate(2deg) translate(2%, -1%); filter: blur(1px) hue-rotate(10deg); }
          15% { transform: scale(2.5) rotate(-15deg) translate(-10%, 15%); filter: blur(8px) hue-rotate(45deg); }
          20% { transform: scale(2.5) rotate(-15deg) translate(-10%, 15%); filter: blur(0px) hue-rotate(45deg); }
          35% { transform: scale(1.2) rotate(5deg) translate(5%, -5%); filter: blur(2px) hue-rotate(90deg); }
          45% { transform: scale(0.8) rotate(25deg) translate(0, 0); filter: blur(0px) hue-rotate(180deg); }
          60% { transform: scale(3) rotate(-5deg) translate(10%, 10%); filter: blur(10px) hue-rotate(220deg); }
          65% { transform: scale(3) rotate(-5deg) translate(10%, 10%); filter: blur(0px) hue-rotate(220deg); }
          80% { transform: scale(1.1) rotate(0deg) translate(-2%, 2%); filter: blur(1px) hue-rotate(300deg); }
          100% { transform: scale(1) rotate(0deg) translate(0, 0); filter: blur(0px) hue-rotate(360deg); }
        }
        
        .stoned-camera-active {
          animation: camera-baked 10s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          will-change: transform, filter;
        }
      `}</style>

      <AnimatePresence>
        {isSmoking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-50 pointer-events-none overflow-hidden"
          >
            {/* Ambient Green Stoned Tint */}
            <div className="absolute inset-0 bg-green-900/10 mix-blend-color" />
            
            {/* Plasma Effect */}
            <div className="plasma-layer" />

            {/* High Cameraman UI Overlay */}
            <motion.div 
              className="absolute inset-0 z-40 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
            >
              <div className="absolute top-8 left-8 text-red-500 font-mono text-2xl font-bold flex items-center gap-3 animate-pulse">
                <div className="w-4 h-4 bg-red-500 rounded-full" />
                REC [STONED]
              </div>
              <div className="absolute top-8 right-8 text-white/50 font-mono text-xl">
                BATT: 420% [WARNING: HIGH]
              </div>
              <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 text-white/40 font-mono text-sm tracking-widest text-center border border-white/20 p-2 bg-black/20 backdrop-blur-sm shadow-[0_0_20px_rgba(255,0,255,0.2)]">
                AUTO-FOCUS: LOST <br/>
                STABILIZER: BAKED
              </div>
              <div className="absolute inset-x-0 top-1/2 h-[1px] bg-white/10" />
              <div className="absolute inset-y-0 left-1/2 w-[1px] bg-white/10" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white/20 rounded-full" />
            </motion.div>
            
            {/* Smoke Particles */}
            {particles.map((p) => (
              <div
                key={p.id}
                className="smoke-particle"
                style={{
                  left: p.left,
                  width: p.size,
                  height: p.size,
                  animationDuration: p.animationDuration,
                  animationDelay: p.animationDelay,
                }}
              />
            ))}

            {/* Cartoon Dragon Glitch */}
            <motion.div 
              className="absolute bottom-10 right-10 flex flex-col items-center"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.5 }}
            >
              <div className="relative text-8xl">
                <span className="block relative z-10 filter drop-shadow-[0_0_15px_rgba(34,197,94,0.8)]">🐉</span>
                
                {/* 3D Glitch Layers (Activated 1 second in, after the hit) */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.1 }}
                >
                  <span className="dragon-glitch-layer glitch-red">🐉</span>
                  <span className="dragon-glitch-layer glitch-cyan">🐉</span>
                </motion.div>
              </div>

              {/* Stoned Eyes Overlay */}
              <motion.div 
                className="absolute top-6 right-6 w-8 h-3 bg-green-500/50 blur-[2px] rounded-full z-20 mix-blend-multiply"
                initial={{ opacity: 0, height: "1px" }}
                animate={{ opacity: 1, height: "6px" }}
                transition={{ delay: 0.5, duration: 2 }}
              />

              <motion.div 
                className="mt-4 bg-black/80 backdrop-blur border border-green-500/50 px-4 py-2 rounded-xl text-green-400 font-mono text-sm uppercase tracking-widest shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, type: "spring" }}
              >
                [ Temporal Baseline Shifted ]
              </motion.div>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
