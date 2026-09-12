import { useState, useEffect } from 'react';
import { LightingMood, LIGHTING_MOODS, SUPER_PUFF_PEAK_MOOD } from '../lighting';
import { Sparkles, Sliders, Eye, RefreshCw, Zap, Flame } from 'lucide-react';

interface StageLightingProps {
  currentMood: LightingMood;
  isPlaying: boolean;
  intensity: number;
  setIntensity: (val: number) => void;
  isHueCycling: boolean;
  setIsHueCycling: (val: boolean) => void;
  isAutoSync: boolean;
  setIsAutoSync: (val: boolean) => void;
  onSelectManualMood: (mood: LightingMood) => void;
  isTimingPeaked?: boolean;
  onToggleSuperPuffPeak?: () => void;
}

export default function StageLighting({
  currentMood,
  isPlaying,
  intensity,
  setIntensity,
  isHueCycling,
  setIsHueCycling,
  isAutoSync,
  setIsAutoSync,
  onSelectManualMood,
  isTimingPeaked = false,
  onToggleSuperPuffPeak,
}: StageLightingProps) {
  const [showControls, setShowControls] = useState(false);
  const [bassReactivity, setBassReactivity] = useState(1);

  // Active lighting mood blends into the dreamy Super Puff Purple-Orange palette when comedic timing peaks
  const effectiveMood = isTimingPeaked ? SUPER_PUFF_PEAK_MOOD : currentMood;

  // Audio-reactivity layer modulating Super Puff bokeh orb floating speed & scale with low-frequency bass triggers
  useEffect(() => {
    if (!isTimingPeaked) return;
    let animId: number;
    let startTime = performance.now();

    const updateBass = () => {
      const now = performance.now();
      const elapsed = (now - startTime) / 1000;
      // Simulate low-frequency 808 sub-bass kick triggers in synchronization with comedic timing & audio state
      const bassKick = Math.pow(Math.max(0, Math.sin(elapsed * Math.PI * 2.5)), 4);
      const factor = 1 + bassKick * 0.5 * (isPlaying ? 1.4 : 0.5);
      setBassReactivity(factor);
      animId = requestAnimationFrame(updateBass);
    };

    animId = requestAnimationFrame(updateBass);
    return () => cancelAnimationFrame(animId);
  }, [isTimingPeaked, isPlaying]);

  // Apply CSS root variables dynamically to the document root or parent container
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--stage-glow-primary', effectiveMood.primary);
    root.style.setProperty('--stage-glow-secondary', effectiveMood.secondary);
    root.style.setProperty('--stage-glow-ambient', effectiveMood.ambient);
    root.style.setProperty('--stage-glow-accent', effectiveMood.accent);
    root.style.setProperty(
      '--stage-pulse-speed',
      isTimingPeaked ? '6.4s' : (isPlaying ? effectiveMood.pulseSpeed : '6.0s')
    );
    root.style.setProperty('--stage-intensity', String(intensity));
  }, [effectiveMood, isPlaying, intensity, isTimingPeaked]);

  return (
    <>
      {/* Volumetric Stage Lighting Layer (Behind Video and Over Backdrops) */}
      <div 
        className={`absolute inset-0 pointer-events-none overflow-hidden z-0 transition-all duration-1000 ${
          isHueCycling ? 'stage-hue-cycle' : ''
        } ${isTimingPeaked ? 'super-puff-bloom' : ''}`}
      >
        {/* Top-Left Stage Spotlight Cone - Shifts to Cosmic Lavender/Purple with Amber Halo */}
        <div
          className="absolute -top-[15%] left-[5%] w-[45vw] h-[80vh] origin-top-left stage-beam-left pointer-events-none mix-blend-screen transition-all duration-1000"
          style={{
            background: isTimingPeaked
              ? `conic-gradient(from 120deg at 0% 0%, rgba(168, 85, 247, 0.4) 0deg, rgba(249, 115, 22, 0.3) 28deg, transparent 60deg)`
              : `conic-gradient(from 120deg at 0% 0%, ${effectiveMood.ambient} 0deg, ${effectiveMood.primary}33 25deg, transparent 55deg)`,
            filter: isTimingPeaked ? 'blur(45px)' : 'blur(35px)',
            opacity: isPlaying ? 0.9 * intensity : 0.5 * intensity,
          }}
        />

        {/* Top-Right Stage Spotlight Cone - Shifts to Sunset Amber with Violet Rim */}
        <div
          className="absolute -top-[15%] right-[5%] w-[45vw] h-[80vh] origin-top-right stage-beam-right pointer-events-none mix-blend-screen transition-all duration-1000"
          style={{
            background: isTimingPeaked
              ? `conic-gradient(from 200deg at 100% 0%, transparent 0deg, rgba(249, 115, 22, 0.35) 30deg, rgba(168, 85, 247, 0.4) 58deg)`
              : `conic-gradient(from 200deg at 100% 0%, transparent 0deg, ${effectiveMood.secondary}33 30deg, ${effectiveMood.ambient} 55deg)`,
            filter: isTimingPeaked ? 'blur(45px)' : 'blur(35px)',
            opacity: isPlaying ? 0.9 * intensity : 0.5 * intensity,
          }}
        />

        {/* Center Volumetric Stage Halo - Dreamy Purple-Orange Super Puff Bloom */}
        <div
          className={`absolute top-1/4 left-1/3 w-[520px] h-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full stage-light-glow pointer-events-none mix-blend-screen transition-all duration-1000 ${
            isTimingPeaked ? 'super-puff-chromatic' : ''
          }`}
          style={{
            background: isTimingPeaked
              ? `radial-gradient(circle, rgba(168, 85, 247, 0.5) 0%, rgba(249, 115, 22, 0.3) 45%, transparent 70%)`
              : `radial-gradient(circle, ${effectiveMood.primary}55 0%, ${effectiveMood.secondary}22 50%, transparent 70%)`,
            filter: isTimingPeaked ? 'blur(80px)' : 'blur(70px)',
          }}
        />

        {/* Floor Stage Uplight Glow - Relaxed Velvet Violet & Sunset Amber Wash */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[38vh] pointer-events-none transition-all duration-1000"
          style={{
            background: isTimingPeaked
              ? `radial-gradient(ellipse at 50% 100%, rgba(168, 85, 247, 0.4) 0%, rgba(249, 115, 22, 0.25) 45%, transparent 75%)`
              : `radial-gradient(ellipse at 50% 100%, ${effectiveMood.ambient} 0%, ${effectiveMood.primary}15 45%, transparent 75%)`,
            filter: isTimingPeaked ? 'blur(50px)' : 'blur(40px)',
            opacity: 0.95 * intensity,
          }}
        />

        {/* Floating Super Puff Purple-Orange Bokeh Orbs during Peak Timing */}
        {isTimingPeaked && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[
              { left: '20%', bottom: '15%', size: '140px', bg: 'rgba(168, 85, 247, 0.25)', delay: '0s' },
              { left: '45%', bottom: '25%', size: '180px', bg: 'rgba(249, 115, 22, 0.22)', delay: '1.8s' },
              { left: '72%', bottom: '18%', size: '130px', bg: 'rgba(217, 70, 239, 0.2)', delay: '3.2s' },
              { left: '35%', bottom: '50%', size: '90px', bg: 'rgba(253, 186, 116, 0.25)', delay: '4.5s' },
            ].map((orb, i) => (
              <div
                key={i}
                className="absolute rounded-full blur-2xl super-puff-bokeh-orb"
                style={{
                  left: orb.left,
                  bottom: orb.bottom,
                  width: orb.size,
                  height: orb.size,
                  backgroundColor: orb.bg,
                  animationDelay: orb.delay,
                  transform: `scale(${bassReactivity})`,
                  animationDuration: `${7.5 / (0.7 + bassReactivity * 0.3)}s`,
                  transition: 'transform 0.08s ease-out',
                }}
              />
            ))}
          </div>
        )}

    {/* Dynamic Horizontal Laser Strip during high energy beats */}
    {effectiveMood.pattern === 'cyber-strobe' && !isTimingPeaked && (
      <div
        className="absolute top-[45%] left-0 right-0 h-[2px] stage-laser-sweep pointer-events-none transition-opacity duration-500"
        style={{
          background: `linear-gradient(90deg, transparent, ${effectiveMood.primary}, ${effectiveMood.secondary}, transparent)`,
          boxShadow: `0 0 20px ${effectiveMood.primary}, 0 0 40px ${effectiveMood.secondary}`,
          opacity: isPlaying ? 0.7 * intensity : 0.2,
        }}
      />
    )}
  </div>
  </>
);
}
