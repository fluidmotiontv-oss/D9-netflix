import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Layers, 
  Eye, 
  EyeOff, 
  Sliders, 
  Video, 
  Grid, 
  Crosshair, 
  Check, 
  Download, 
  Sparkles, 
  Maximize2, 
  Minimize2, 
  Smartphone, 
  Monitor, 
  ShieldCheck, 
  Volume2, 
  Crown,
  X,
  RefreshCw,
  Zap,
  Radio,
  FileText
} from 'lucide-react';
import { ScriptCue } from '../../utils/scriptTimedCues';

export interface PreviewExportLayers {
  background: boolean;
  actor: boolean;
  overlay: boolean;
}

export interface PreviewExportLayerOpacities {
  background: number;
  actor: number;
  overlay: number;
}

export interface PreviewExportOverlayProps {
  act: any;
  currentCue?: ScriptCue | null;
  currentTimeSec?: number;
  isPlaying?: boolean;
  primaryColor?: string;
  accentColor?: string;
  onCommitExport?: () => void;
  onClose?: () => void;
  isCompact?: boolean;
  aspectRatio?: '9:16' | '16:9';
  onToggleAspectRatio?: (aspect: '9:16' | '16:9') => void;
}

export const PreviewExportOverlay: React.FC<PreviewExportOverlayProps> = ({
  act,
  currentCue,
  currentTimeSec = 0,
  isPlaying = false,
  primaryColor = '#ea580c',
  accentColor = '#f59e0b',
  onCommitExport,
  onClose,
  isCompact = false,
  aspectRatio: externalAspectRatio,
  onToggleAspectRatio,
}) => {
  const [internalAspectRatio, setInternalAspectRatio] = useState<'9:16' | '16:9'>('9:16');
  const aspectRatio = externalAspectRatio || internalAspectRatio;

  const handleSetAspectRatio = (val: '9:16' | '16:9') => {
    if (onToggleAspectRatio) {
      onToggleAspectRatio(val);
    } else {
      setInternalAspectRatio(val);
    }
  };

  // Layer visibility
  const [layers, setLayers] = useState<PreviewExportLayers>({
    background: true,
    actor: true,
    overlay: true,
  });

  // Layer Opacities
  const [opacities, setOpacities] = useState<PreviewExportLayerOpacities>({
    background: 1,
    actor: 1,
    overlay: 1,
  });

  // Safe zones & guides
  const [showSafeZones, setShowSafeZones] = useState(true);
  const [showRuleOfThirds, setShowRuleOfThirds] = useState(true);
  const [showLayerLabels, setShowLayerLabels] = useState(true);
  const [selectedLayerFocus, setSelectedLayerFocus] = useState<'all' | 'background' | 'actor' | 'overlay'>('all');
  const [isInspectorExpanded, setIsInspectorExpanded] = useState(true);

  // Toggle single layer
  const toggleLayer = (layer: keyof PreviewExportLayers) => {
    setLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  // Solo layer
  const soloLayer = (layer: keyof PreviewExportLayers) => {
    setLayers({
      background: layer === 'background',
      actor: layer === 'actor',
      overlay: layer === 'overlay',
    });
    setSelectedLayerFocus(layer);
  };

  // Reset all layers
  const resetLayers = () => {
    setLayers({ background: true, actor: true, overlay: true });
    setSelectedLayerFocus('all');
  };

  const formattedTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 100);
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between overflow-hidden">
      
      {/* 1. TOP STATUS & LAYER VERIFICATION HUD */}
      <div className="p-3 sm:p-4 flex items-center justify-between pointer-events-auto bg-gradient-to-b from-black/85 via-black/40 to-transparent">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 font-mono text-[10px] font-black uppercase tracking-wider shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            <Layers className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>PREVIEW EXPORT MODE</span>
          </div>

          {/* Aspect Ratio Switcher */}
          <div className="flex items-center bg-black/60 border border-white/10 rounded-lg p-0.5 text-[9px] font-mono">
            <button
              onClick={() => handleSetAspectRatio('9:16')}
              className={`px-2 py-0.5 rounded transition-all flex items-center gap-1 ${
                aspectRatio === '9:16'
                  ? 'bg-amber-500/30 text-amber-300 font-bold border border-amber-500/40 shadow-sm'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <Smartphone className="w-3 h-3" />
              <span>9:16 Shorts/Reels</span>
            </button>
            <button
              onClick={() => handleSetAspectRatio('16:9')}
              className={`px-2 py-0.5 rounded transition-all flex items-center gap-1 ${
                aspectRatio === '16:9'
                  ? 'bg-amber-500/30 text-amber-300 font-bold border border-amber-500/40 shadow-sm'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <Monitor className="w-3 h-3" />
              <span>16:9 Master</span>
            </button>
          </div>
        </div>

        {/* Right Tools & Commit Button */}
        <div className="flex items-center gap-2">
          {onCommitExport && (
            <button
              onClick={onCommitExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-black uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all active:scale-95"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Commit Export</span>
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-black/60 border border-white/10 text-white/70 hover:text-white hover:bg-white/10"
              title="Exit Preview Export Mode"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. REAL-TIME MULTI-LAYER COMPOSITION GUIDES OVERLAY */}
      <div className="relative flex-1 w-full h-full flex items-center justify-center pointer-events-none">
        
        {/* Aspect Frame Bounds Simulation for 9:16 vs 16:9 */}
        {aspectRatio === '9:16' ? (
          <div className="absolute inset-y-2 aspect-[9/16] border-2 border-amber-400/50 rounded-2xl pointer-events-none shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col justify-between overflow-hidden">
            
            {/* Safe Title Area (80% Center Safe Zone) */}
            {showSafeZones && (
              <div className="absolute inset-x-4 inset-y-12 border border-dashed border-cyan-400/40 rounded-xl pointer-events-none flex flex-col justify-between p-2">
                <div className="flex justify-between items-start text-[8px] font-mono text-cyan-400/80 bg-black/60 px-1.5 py-0.5 rounded self-start">
                  <span>9:16 TIKTOK / REELS TITLE SAFE ZONE</span>
                </div>
                <div className="flex justify-between items-end text-[8px] font-mono text-cyan-400/80 bg-black/60 px-1.5 py-0.5 rounded self-end">
                  <span>CAPTION BOUNDS</span>
                </div>
              </div>
            )}

            {/* Rule of Thirds Grid */}
            {showRuleOfThirds && (
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                <div className="border-r border-b border-white/10" />
                <div className="border-r border-b border-white/10" />
                <div className="border-b border-white/10" />
                <div className="border-r border-b border-white/10" />
                <div className="border-r border-b border-white/10" />
                <div className="border-b border-white/10" />
                <div className="border-r border-white/10" />
                <div className="border-r border-white/10" />
                <div />
              </div>
            )}

            {/* Top Frame Watermark */}
            <div className="p-3 flex items-center justify-between z-10">
              <div className="flex items-center gap-1 text-[9px] font-mono font-bold text-amber-300 bg-black/70 px-2 py-0.5 rounded-full border border-amber-400/30">
                <Crown className="w-2.5 h-2.5 text-amber-400" />
                <span>SUPER PUFF • THE BIGGER CLOCK</span>
              </div>
              <div className="text-[9px] font-mono text-white/70 bg-black/70 px-2 py-0.5 rounded-full border border-white/10">
                {formattedTime(currentTimeSec)}
              </div>
            </div>

            {/* Bottom Subtitle / Caption Layer Live Preview */}
            {layers.overlay && (
              <div 
                className="p-3 pb-6 flex flex-col items-center justify-end z-10 transition-opacity"
                style={{ opacity: opacities.overlay }}
              >
                <div className="bg-black/90 border border-amber-400/80 rounded-xl px-3 py-2 max-w-[90%] text-center shadow-[0_0_20px_rgba(0,0,0,0.9)]">
                  <p className="text-xs font-bold text-white leading-tight">
                    {currentCue?.text || act.previewDescription || "Times Up, Mother Fathers!"}
                  </p>
                  {currentCue?.japaneseGloss && (
                    <p className="text-[9px] font-mono text-amber-300 mt-0.5">
                      {currentCue.japaneseGloss}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* 16:9 Widescreen Safe Boundaries */
          <div className="absolute inset-4 border-2 border-amber-400/50 rounded-2xl pointer-events-none shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col justify-between overflow-hidden">
            {showSafeZones && (
              <div className="absolute inset-x-8 inset-y-6 border border-dashed border-cyan-400/40 rounded-xl pointer-events-none flex flex-col justify-between p-2">
                <div className="text-[8px] font-mono text-cyan-400/80 bg-black/60 px-1.5 py-0.5 rounded self-start">
                  <span>16:9 THEATRICAL SAFE ZONE (90% ACTION)</span>
                </div>
              </div>
            )}

            {showRuleOfThirds && (
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                <div className="border-r border-b border-white/10" />
                <div className="border-r border-b border-white/10" />
                <div className="border-b border-white/10" />
                <div className="border-r border-b border-white/10" />
                <div className="border-r border-b border-white/10" />
                <div className="border-b border-white/10" />
                <div className="border-r border-white/10" />
                <div className="border-r border-white/10" />
                <div />
              </div>
            )}

            {/* Bottom Subtitle / Caption Layer Live Preview for 16:9 */}
            {layers.overlay && (
              <div 
                className="p-4 pb-8 flex flex-col items-center justify-end z-10 transition-opacity"
                style={{ opacity: opacities.overlay }}
              >
                <div className="bg-black/90 border border-amber-400/80 rounded-xl px-4 py-2 max-w-xl text-center shadow-[0_0_20px_rgba(0,0,0,0.9)]">
                  <p className="text-sm font-bold text-white leading-tight">
                    {currentCue?.text || act.previewDescription || "Times Up, Mother Fathers!"}
                  </p>
                  {currentCue?.japaneseGloss && (
                    <p className="text-[10px] font-mono text-amber-300 mt-0.5">
                      {currentCue.japaneseGloss}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Live Floating Layer Badges */}
        {showLayerLabels && (
          <>
            {/* Background Layer Tag */}
            <div 
              className={`absolute top-16 left-6 px-2.5 py-1 rounded-lg border font-mono text-[9px] uppercase tracking-wider backdrop-blur-md flex items-center gap-1.5 transition-all ${
                layers.background 
                  ? 'bg-blue-950/80 border-blue-400/60 text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.3)]' 
                  : 'bg-black/80 border-white/10 text-white/30 line-through'
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${layers.background ? 'bg-blue-400 animate-pulse' : 'bg-white/20'}`} />
              <span>LAYER 1: VOLUMETRIC BACKGROUND</span>
            </div>

            {/* Actor Layer Tag */}
            <div 
              className={`absolute top-28 left-6 px-2.5 py-1 rounded-lg border font-mono text-[9px] uppercase tracking-wider backdrop-blur-md flex items-center gap-1.5 transition-all ${
                layers.actor 
                  ? 'bg-emerald-950/80 border-emerald-400/60 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]' 
                  : 'bg-black/80 border-white/10 text-white/30 line-through'
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${layers.actor ? 'bg-emerald-400 animate-pulse' : 'bg-white/20'}`} />
              <span>LAYER 2: DRAGON 9 ACTOR & RIG</span>
            </div>

            {/* Overlay Layer Tag */}
            <div 
              className={`absolute top-40 left-6 px-2.5 py-1 rounded-lg border font-mono text-[9px] uppercase tracking-wider backdrop-blur-md flex items-center gap-1.5 transition-all ${
                layers.overlay 
                  ? 'bg-purple-950/80 border-purple-400/60 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)]' 
                  : 'bg-black/80 border-white/10 text-white/30 line-through'
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${layers.overlay ? 'bg-purple-400 animate-pulse' : 'bg-white/20'}`} />
              <span>LAYER 3: SUBTITLES & WATERMARK</span>
            </div>
          </>
        )}
      </div>

      {/* 3. BOTTOM FLOATING MULTI-LAYER CONTROLS PANEL */}
      <div className="p-3 sm:p-4 pointer-events-auto bg-gradient-to-t from-black/95 via-black/80 to-transparent">
        <div className="max-w-4xl mx-auto rounded-2xl bg-[#0e0e13]/95 border border-white/15 p-3.5 shadow-2xl backdrop-blur-xl space-y-3">
          
          {/* Header & Quick Toggles */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/10 text-[10px] font-mono">
            <div className="flex items-center gap-2">
              <span className="text-white/60 uppercase font-bold">Layer Composition Inspector:</span>
              <button
                onClick={resetLayers}
                className="text-amber-400 hover:text-amber-300 underline uppercase"
              >
                Reset All (3)
              </button>
            </div>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 text-white/70 hover:text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={showSafeZones}
                  onChange={(e) => setShowSafeZones(e.target.checked)}
                  className="accent-cyan-500 rounded"
                />
                <span>Safe Zones</span>
              </label>

              <label className="flex items-center gap-1.5 text-white/70 hover:text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={showRuleOfThirds}
                  onChange={(e) => setShowRuleOfThirds(e.target.checked)}
                  className="accent-amber-500 rounded"
                />
                <span>3x3 Grid</span>
              </label>

              <label className="flex items-center gap-1.5 text-white/70 hover:text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={showLayerLabels}
                  onChange={(e) => setShowLayerLabels(e.target.checked)}
                  className="accent-purple-500 rounded"
                />
                <span>Tags</span>
              </label>
            </div>
          </div>

          {/* 3 Interactive Layer Strips (Background, Actor, Overlay) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            
            {/* Layer 1: Background */}
            <div className={`p-2.5 rounded-xl border transition-all space-y-2 ${
              layers.background 
                ? 'bg-blue-950/30 border-blue-500/40 shadow-sm' 
                : 'bg-black/40 border-white/5 opacity-50'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                  <span className="text-xs font-bold text-white">Background</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => soloLayer('background')}
                    className="px-1.5 py-0.5 rounded text-[8px] font-mono bg-white/5 hover:bg-white/10 text-white/60 hover:text-white uppercase"
                    title="Solo this layer"
                  >
                    Solo
                  </button>
                  <button
                    onClick={() => toggleLayer('background')}
                    className={`p-1 rounded text-white/80 ${layers.background ? 'hover:text-red-400' : 'hover:text-green-400'}`}
                  >
                    {layers.background ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[9px] font-mono text-white/50">
                <span>Opacity:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={opacities.background}
                  onChange={(e) => setOpacities(prev => ({ ...prev, background: Number(e.target.value) }))}
                  className="flex-1 accent-blue-500 h-1 bg-white/10 rounded cursor-pointer"
                />
                <span className="w-7 text-right">{Math.round(opacities.background * 100)}%</span>
              </div>
            </div>

            {/* Layer 2: Actor */}
            <div className={`p-2.5 rounded-xl border transition-all space-y-2 ${
              layers.actor 
                ? 'bg-emerald-950/30 border-emerald-500/40 shadow-sm' 
                : 'bg-black/40 border-white/5 opacity-50'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-xs font-bold text-white">Actor (Dragon 9)</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => soloLayer('actor')}
                    className="px-1.5 py-0.5 rounded text-[8px] font-mono bg-white/5 hover:bg-white/10 text-white/60 hover:text-white uppercase"
                    title="Solo this layer"
                  >
                    Solo
                  </button>
                  <button
                    onClick={() => toggleLayer('actor')}
                    className={`p-1 rounded text-white/80 ${layers.actor ? 'hover:text-red-400' : 'hover:text-green-400'}`}
                  >
                    {layers.actor ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[9px] font-mono text-white/50">
                <span>Opacity:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={opacities.actor}
                  onChange={(e) => setOpacities(prev => ({ ...prev, actor: Number(e.target.value) }))}
                  className="flex-1 accent-emerald-500 h-1 bg-white/10 rounded cursor-pointer"
                />
                <span className="w-7 text-right">{Math.round(opacities.actor * 100)}%</span>
              </div>
            </div>

            {/* Layer 3: Overlay */}
            <div className={`p-2.5 rounded-xl border transition-all space-y-2 ${
              layers.overlay 
                ? 'bg-purple-950/30 border-purple-500/40 shadow-sm' 
                : 'bg-black/40 border-white/5 opacity-50'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                  <span className="text-xs font-bold text-white">Overlay & Captions</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => soloLayer('overlay')}
                    className="px-1.5 py-0.5 rounded text-[8px] font-mono bg-white/5 hover:bg-white/10 text-white/60 hover:text-white uppercase"
                    title="Solo this layer"
                  >
                    Solo
                  </button>
                  <button
                    onClick={() => toggleLayer('overlay')}
                    className={`p-1 rounded text-white/80 ${layers.overlay ? 'hover:text-red-400' : 'hover:text-green-400'}`}
                  >
                    {layers.overlay ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[9px] font-mono text-white/50">
                <span>Opacity:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={opacities.overlay}
                  onChange={(e) => setOpacities(prev => ({ ...prev, overlay: Number(e.target.value) }))}
                  className="flex-1 accent-purple-500 h-1 bg-white/10 rounded cursor-pointer"
                />
                <span className="w-7 text-right">{Math.round(opacities.overlay * 100)}%</span>
              </div>
            </div>

          </div>

          {/* Action Footer Callout */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] font-mono">
            <span className="text-white/50">
              Verify framing, actor lip-sync, and subtitle safety before final encoding.
            </span>
            {onCommitExport && (
              <button
                onClick={onCommitExport}
                className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase transition-all flex items-center gap-1.5 shadow-md active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Open Video Exporter</span>
              </button>
            )}
          </div>

        </div>
      </div>

    </div>
  );
};

export default PreviewExportOverlay;
