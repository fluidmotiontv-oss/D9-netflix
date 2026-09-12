import React from 'react';
import { Skull, AlertTriangle, Zap, Activity } from 'lucide-react';

interface BrutalModeOverlayProps {
  isBrutalMode: boolean;
  isJoltActive?: boolean;
  isMeltdown?: boolean;
  composure?: number;
}

export const BrutalModeOverlay: React.FC<BrutalModeOverlayProps> = ({
  isBrutalMode,
  isJoltActive = false,
  isMeltdown = false,
  composure = 100,
}) => {
  if (!isBrutalMode && !isMeltdown) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-25 overflow-hidden transition-all duration-500 select-none ${
        isBrutalMode ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* 1. Dramatic Red-Tinted Vignette Layer */}
      <div 
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(0, 0, 0, 0) 30%, rgba(185, 28, 28, 0.35) 70%, rgba(127, 29, 29, 0.75) 100%)',
        }}
      />

      {/* 2. Rapid Red Neon Flickering Overlay */}
      <div className="absolute inset-0 brutal-red-flicker mix-blend-color-dodge pointer-events-none">
        <div 
          className="w-full h-full"
          style={{
            background: 'radial-gradient(circle at 50% 45%, rgba(239, 68, 68, 0.25) 0%, rgba(220, 38, 38, 0.45) 55%, rgba(153, 27, 27, 0.8) 100%)',
          }}
        />
      </div>

      {/* 3. Hostile Cellar Scanline Drift Texture */}
      <div className="absolute inset-0 brutal-scanlines opacity-40 mix-blend-overlay" />

      {/* 4. Shockwave Impact Flash on Activation & Heckle Landings */}
      {isJoltActive && (
        <div className="absolute inset-0 bg-red-600/35 backdrop-contrast-150 animate-pulse transition-opacity duration-200 z-30" />
      )}

      {/* 5. Subtle Corner Atmospheric Tickers */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-red-950/80 border border-red-500/40 text-[9px] font-mono text-red-300 backdrop-blur-sm shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
        <span className="font-bold tracking-wider">HOSTILITY CRUCIBLE</span>
        <Activity className="w-2.5 h-2.5 text-red-400" />
      </div>

      <div className="absolute bottom-3 left-3 hidden sm:flex items-center gap-2 px-2 py-0.5 rounded-md bg-black/60 border border-red-900/50 text-[8px] font-mono text-red-400/80 backdrop-blur-sm">
        <Skull className="w-2.5 h-2.5 text-red-500" />
        <span>3AM CELLAR PRESSURE</span>
        <span className="text-white/30">•</span>
        <span>ZERO TOLERANCE</span>
      </div>

      {/* 6. Edge Hazard Glow for Critical Composure */}
      {composure <= 30 && !isMeltdown && (
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-red-600/50 to-transparent animate-pulse" />
      )}
    </div>
  );
};

export default BrutalModeOverlay;
