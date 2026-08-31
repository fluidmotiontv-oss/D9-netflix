import { useState, useEffect } from 'react';
import { LightingMood, LIGHTING_MOODS } from '../lighting';
import { Sparkles, Sliders, Eye, RefreshCw, Zap } from 'lucide-react';

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
}: StageLightingProps) {
  const [showControls, setShowControls] = useState(false);

  // Apply CSS root variables dynamically to the document root or parent container
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--stage-glow-primary', currentMood.primary);
    root.style.setProperty('--stage-glow-secondary', currentMood.secondary);
    root.style.setProperty('--stage-glow-ambient', currentMood.ambient);
    root.style.setProperty('--stage-glow-accent', currentMood.accent);
    root.style.setProperty(
      '--stage-pulse-speed',
      isPlaying ? currentMood.pulseSpeed : '6.0s'
    );
    root.style.setProperty('--stage-intensity', String(intensity));
  }, [currentMood, isPlaying, intensity]);

  return (
    <>
      {/* Volumetric Stage Lighting Layer (Behind Video and Over Backdrops) */}
      <div 
        className={`absolute inset-0 pointer-events-none overflow-hidden z-0 transition-all duration-1000 ${
          isHueCycling ? 'stage-hue-cycle' : ''
        }`}
      >
        {/* Top-Left Stage Spotlight Cone */}
        <div
          className="absolute -top-[15%] left-[5%] w-[45vw] h-[80vh] origin-top-left stage-beam-left pointer-events-none mix-blend-screen transition-all duration-1000"
          style={{
            background: `conic-gradient(from 120deg at 0% 0%, ${currentMood.ambient} 0deg, ${currentMood.primary}33 25deg, transparent 55deg)`,
            filter: 'blur(35px)',
            opacity: isPlaying ? 0.85 * intensity : 0.45 * intensity,
          }}
        />

        {/* Top-Right Stage Spotlight Cone */}
        <div
          className="absolute -top-[15%] right-[5%] w-[45vw] h-[80vh] origin-top-right stage-beam-right pointer-events-none mix-blend-screen transition-all duration-1000"
          style={{
            background: `conic-gradient(from 200deg at 100% 0%, transparent 0deg, ${currentMood.secondary}33 30deg, ${currentMood.ambient} 55deg)`,
            filter: 'blur(35px)',
            opacity: isPlaying ? 0.85 * intensity : 0.45 * intensity,
          }}
        />

        {/* Center Volumetric Stage Halo */}
        <div
          className="absolute top-1/4 left-1/3 w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full stage-light-glow pointer-events-none mix-blend-screen transition-all duration-1000"
          style={{
            background: `radial-gradient(circle, ${currentMood.primary}55 0%, ${currentMood.secondary}22 50%, transparent 70%)`,
            filter: 'blur(70px)',
          }}
        />

        {/* Floor Stage Uplight Glow */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[35vh] pointer-events-none transition-all duration-1000"
          style={{
            background: `radial-gradient(ellipse at 50% 100%, ${currentMood.ambient} 0%, ${currentMood.primary}15 45%, transparent 75%)`,
            filter: 'blur(40px)',
            opacity: 0.9 * intensity,
          }}
        />

        {/* Dynamic Horizontal Laser Strip during high energy beats */}
        {currentMood.pattern === 'cyber-strobe' && (
          <div
            className="absolute top-[45%] left-0 right-0 h-[2px] stage-laser-sweep pointer-events-none transition-opacity duration-500"
            style={{
              background: `linear-gradient(90deg, transparent, ${currentMood.primary}, ${currentMood.secondary}, transparent)`,
              boxShadow: `0 0 20px ${currentMood.primary}, 0 0 40px ${currentMood.secondary}`,
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
            showControls
              ? 'border-white bg-white/15 text-white shadow-[0_0_15px_rgba(255,255,255,0.3)]'
              : 'border-white/20 text-white/80 hover:bg-white/10'
          }`}
          style={{
            borderColor: showControls ? currentMood.primary : undefined,
            color: showControls ? currentMood.accent : undefined,
          }}
          title="Dynamic Stage Lighting & Tone Sync"
        >
          <span 
            className="w-2.5 h-2.5 rounded-full animate-pulse inline-block shadow-sm"
            style={{ backgroundColor: currentMood.primary }}
          />
          <span className="hidden sm:inline font-bold">LIGHTS: {currentMood.name}</span>
          <Sliders className="w-3.5 h-3.5 opacity-70 ml-0.5" />
        </button>

        {/* Lighting Controls Dropdown / Flyout */}
        {showControls && (
          <div className="absolute right-0 top-full mt-3 w-80 bg-[#0c0c0e]/95 backdrop-blur-2xl border border-white/20 rounded-2xl p-5 shadow-[0_15px_50px_rgba(0,0,0,0.8)] z-50 text-left animate-in fade-in slide-in-from-top-3">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" style={{ color: currentMood.primary }} />
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

            {/* Current Active Mood Card */}
            <div 
              className="p-3 rounded-xl mb-4 border transition-all"
              style={{
                backgroundColor: `${currentMood.primary}12`,
                borderColor: `${currentMood.primary}44`,
              }}
            >
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider mb-1">
                <span className="font-bold" style={{ color: currentMood.accent }}>
                  {currentMood.name}
                </span>
                <span className="text-white/40">{currentMood.pattern}</span>
              </div>
              <div className="text-xs font-medium text-white/90 mb-1">
                {currentMood.tone}
              </div>
              <div className="text-[11px] text-white/60 leading-relaxed font-light">
                {currentMood.description}
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
                <span style={{ color: currentMood.accent }}>{Math.round(intensity * 100)}%</span>
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
                      currentMood.id === m.id
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
