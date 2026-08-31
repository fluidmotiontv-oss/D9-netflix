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

      {/* Floating Interactive Stage Lighting Controls Panel Trigger (Header / Overlay) */}
      <div className="relative">
        <button
          onClick={() => setShowControls(prev => !prev)}
          className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 border rounded-lg transition-all font-mono uppercase text-[11px] shadow-sm ${
            isTimingPeaked
              ? 'border-purple-400 bg-purple-500/20 text-purple-200 shadow-[0_0_20px_rgba(168,85,247,0.5)] animate-pulse font-bold'
              : showControls
                ? 'border-white bg-white/15 text-white shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                : 'border-white/20 text-white/80 hover:bg-white/10'
          }`}
          style={{
            borderColor: isTimingPeaked ? '#a855f7' : (showControls ? effectiveMood.primary : undefined),
            color: isTimingPeaked ? '#fdba74' : (showControls ? effectiveMood.accent : undefined),
          }}
          title="Dynamic Stage Lighting & Tone Sync"
        >
          <span 
            className={`w-2.5 h-2.5 rounded-full inline-block shadow-sm ${isTimingPeaked ? 'animate-ping' : 'animate-pulse'}`}
            style={{ backgroundColor: isTimingPeaked ? '#a855f7' : effectiveMood.primary }}
          />
          <span className="hidden sm:inline font-bold">
            {isTimingPeaked ? '✨ SUPER PUFF PEAK' : `LIGHTS: ${effectiveMood.name}`}
          </span>
          <Sliders className="w-3.5 h-3.5 opacity-70 ml-0.5" />
        </button>

        {/* Lighting Controls Dropdown / Flyout */}
        {showControls && (
          <div className="absolute right-0 top-full mt-3 w-84 bg-[#0c0c0e]/95 backdrop-blur-2xl border border-white/20 rounded-2xl p-5 shadow-[0_15px_50px_rgba(0,0,0,0.8)] z-50 text-left animate-in fade-in slide-in-from-top-3">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h4 className="text-xs font-black uppercase tracking-widest text-white">
                  Stage Lighting & Mood Sync
                </h4>
              </div>
              <button
                onClick={() => setShowControls(false)}
                className="text-white/40 hover:text-white text-xs px-1.5 py-0.5 rounded"
              >
                ✕
              </button>
            </div>

            {/* Super Puff Peaked Timing Visual Filter Feature Card */}
            <div className="p-3 rounded-xl mb-4 border border-purple-500/40 bg-gradient-to-r from-purple-950/40 via-purple-900/30 to-amber-950/40 shadow-inner">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300 font-mono uppercase">
                  <span className="text-base">✨</span>
                  <span>'Super Puff' Visual Filter</span>
                </div>
                <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full font-bold border ${
                  isTimingPeaked 
                    ? 'bg-purple-500/30 text-purple-200 border-purple-400 animate-pulse' 
                    : 'bg-white/10 text-white/50 border-white/10'
                }`}>
                  {isTimingPeaked ? 'PEAKED (ACTIVE)' : 'READY'}
                </span>
              </div>
              <p className="text-[11px] text-white/70 leading-relaxed font-light mb-2.5">
                Triggers when the Dragon's comedic timing reaches peak resonance, subtly distorting stage lights into a dreamier purple-orange palette.
              </p>
              {onToggleSuperPuffPeak && (
                <button
                  onClick={onToggleSuperPuffPeak}
                  className={`w-full py-1.5 px-3 rounded-lg text-[10px] font-mono uppercase font-bold flex items-center justify-center gap-1.5 border transition-all ${
                    isTimingPeaked
                      ? 'bg-purple-500 text-white border-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.6)]'
                      : 'bg-white/10 hover:bg-white/15 text-purple-300 border-purple-500/30'
                  }`}
                >
                  <span>{isTimingPeaked ? '🟣 Super Puff Filter Engaged' : '⚡ Test Super Puff Peak Filter (P)'}</span>
                </button>
              )}
            </div>

            {/* Current Active Mood Card */}
            <div 
              className="p-3 rounded-xl mb-4 border transition-all"
              style={{
                backgroundColor: `${effectiveMood.primary}12`,
                borderColor: `${effectiveMood.primary}44`,
              }}
            >
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider mb-1">
                <span className="font-bold" style={{ color: effectiveMood.accent }}>
                  {effectiveMood.name}
                </span>
                <span className="text-white/40">{effectiveMood.pattern}</span>
              </div>
              <div className="text-xs font-medium text-white/90 mb-1">
                {effectiveMood.tone}
              </div>
              <div className="text-[11px] text-white/60 leading-relaxed font-light">
                {effectiveMood.description}
              </div>
            </div>

            {/* Auto-Sync Toggle */}
            <div className="flex items-center justify-between py-2 border-b border-white/10 mb-3">
              <div className="flex flex-col">
                <span className="text-xs font-mono text-white/90 uppercase font-semibold">
                  Auto-Sync Tone with Acts
                </span>
                <span className="text-[10px] text-white/50">
                  Switches stage lighting to match each joke's comedic energy
                </span>
              </div>
              <button
                onClick={() => setIsAutoSync(!isAutoSync)}
                className={`w-10 h-5 rounded-full transition-colors relative flex items-center px-0.5 ${
                  isAutoSync ? 'bg-green-500' : 'bg-white/20'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    isAutoSync ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Continuous 360° Hue Cycle Mode */}
            <div className="flex items-center justify-between py-2 border-b border-white/10 mb-3">
              <div className="flex flex-col">
                <span className="text-xs font-mono text-white/90 uppercase font-semibold flex items-center gap-1.5">
                  <RefreshCw className={`w-3 h-3 ${isHueCycling ? 'animate-spin' : ''}`} />
                  Prismatic Hue Cycle
                </span>
                <span className="text-[10px] text-white/50">
                  Slow 360° spectrum wave across the entire theater
                </span>
              </div>
              <button
                onClick={() => setIsHueCycling(!isHueCycling)}
                className={`w-10 h-5 rounded-full transition-colors relative flex items-center px-0.5 ${
                  isHueCycling ? 'bg-purple-500' : 'bg-white/20'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    isHueCycling ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Brightness / Intensity Slider */}
            <div className="mb-4">
              <div className="flex justify-between items-center text-[10px] font-mono text-white/70 uppercase mb-1.5">
                <span>Stage Intensity</span>
                <span style={{ color: effectiveMood.accent }}>{Math.round(intensity * 100)}%</span>
              </div>
              <div className="flex items-center gap-2">
                {[0.4, 0.75, 1.0, 1.35].map(val => (
                  <button
                    key={val}
                    onClick={() => setIntensity(val)}
                    className={`flex-1 py-1 text-[10px] font-mono uppercase rounded border transition-all ${
                      intensity === val
                        ? 'border-white bg-white/20 text-white font-bold'
                        : 'border-white/10 bg-white/5 text-white/50 hover:bg-white/10'
                    }`}
                  >
                    {val === 0.4 ? 'Dim' : val === 0.75 ? 'Mid' : val === 1.0 ? 'Norm' : 'Vivid'}
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Atmosphere Palette Presets */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono text-white/50 uppercase tracking-wider mb-1">
                Tone Presets (Manual Override)
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {Object.values(LIGHTING_MOODS).map(m => (
                  <button
                    key={m.id}
                    onClick={() => {
                    setIsAutoSync(false);
                    onSelectManualMood(m);
                  }}
                  className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-all ${
                    effectiveMood.id === m.id
                      ? 'border-white/80 bg-white/15 text-white font-bold'
                      : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: m.primary }}
                  />
                  <span className="text-[11px] truncate">{m.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  </>
  );
}
