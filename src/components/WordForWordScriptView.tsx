import React, { useState, useEffect, useRef } from 'react';
import { 
  Copy, 
  Check, 
  Download, 
  Play, 
  Pause, 
  Sparkles, 
  Clock, 
  Radio, 
  Volume2, 
  Cannabis, 
  FileText, 
  Maximize2,
  ChevronRight,
  Video,
  Globe
} from 'lucide-react';
import { SUPER_PUFF_INITIATION_SPECIAL } from '../data';

interface WordForWordScriptViewProps {
  currentActId?: string;
  onSelectAct?: (act: any) => void;
  onExportVideo?: (act?: any) => void;
  onOpenLocalization?: () => void;
  primaryColor?: string;
  accentColor?: string;
}

export default function WordForWordScriptView({
  currentActId,
  onSelectAct,
  onExportVideo,
  onOpenLocalization,
  primaryColor = '#00f3ff',
  accentColor = '#22d3ee'
}: WordForWordScriptViewProps) {
  const [copiedActId, setCopiedActId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'teleprompter'>('normal');
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState<number>(1);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Auto-scrolling teleprompter loop
  useEffect(() => {
    if (!isAutoScrolling) return;
    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop += scrollSpeed;
      }
    }, 40);
    return () => clearInterval(interval);
  }, [isAutoScrolling, scrollSpeed]);

  const handleCopyAct = (act: any) => {
    const text = `=== ${act.title.toUpperCase()} (${act.time}) ===\nStrain Pairing: ${act.strainPairing}\n\n[STAGE DIRECTIONS]\n${act.stageDirections || ''}\n\n[SUPER PUFF PERFORMANCE SCRIPT]\n${act.performanceScript || act.bit}`;
    navigator.clipboard.writeText(text);
    setCopiedActId(act.id);
    setTimeout(() => setCopiedActId(null), 2500);
  };

  const handleCopyFullScript = () => {
    let full = `========================================================\n`;
    full += `SUPER PUFF: THE INITIATION (18-MINUTE APEX SPECIAL v1.0.0-APEX)\n`;
    full += `TEMPORAL FRAMEWORK: Dragon 9 Protocol (54-Min Hours / 26.66-Hr Cycles)\n`;
    full += `========================================================\n\n`;

    SUPER_PUFF_INITIATION_SPECIAL.acts.forEach((act, idx) => {
      full += `\n--- ACT ${idx + 1}: ${act.title} (${act.time}) ---\n`;
      full += `Strain Pairing: ${act.strainPairing}\n`;
      full += `Theory: ${act.comedyTheory}\n\n`;
      full += `STAGE DIRECTIONS:\n${act.stageDirections || ''}\n\n`;
      full += `SUPER PUFF:\n${act.performanceScript || act.bit}\n\n`;
      full += `--------------------------------------------------------\n`;
    });

    navigator.clipboard.writeText(full);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  const handleDownloadTxt = () => {
    let full = `========================================================\n`;
    full += `SUPER PUFF: THE INITIATION (18-MINUTE APEX SPECIAL v1.0.0-APEX)\n`;
    full += `WORD-FOR-WORD PERFORMANCE SCRIPT & STAGE DIRECTIONS\n`;
    full += `========================================================\n\n`;

    SUPER_PUFF_INITIATION_SPECIAL.acts.forEach((act, idx) => {
      full += `ACT ${idx + 1}: ${act.title.toUpperCase()} (${act.time})\n`;
      full += `Strain Pairing: ${act.strainPairing}\n\n`;
      full += `${act.stageDirections || ''}\n\n`;
      full += `SUPER PUFF:\n\n${act.performanceScript || act.bit}\n\n`;
      full += `\n========================================================\n\n`;
    });

    const blob = new Blob([full], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Super-Puff-The-Initiation-18Min-Word-For-Word-Script.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Header Banner & Teleprompter Controls */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-purple-950/50 via-black to-cyan-950/40 border border-purple-500/30 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                <span>18-Min Word-for-Word Script</span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  APEX 1.0
                </span>
              </h2>
              <p className="text-[10px] font-mono text-white/50">
                Super Puff: The Initiation • Dragon 9 54-Min Protocol
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {onOpenLocalization && (
              <button
                onClick={onOpenLocalization}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-500/20 to-cyan-500/20 hover:from-purple-500/30 hover:to-cyan-500/30 border border-purple-500/40 text-[10px] font-mono font-bold text-purple-200 transition-all shadow-sm"
                title="Open Stand-Up Comedy Localization Engine (DE, ES, FR, JA)"
              >
                <Globe className="w-3 h-3 text-cyan-400" />
                <span>Localize (DE/ES/FR/JA)</span>
              </button>
            )}
            {onExportVideo && (
              <button
                onClick={() => onExportVideo()}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-500/20 hover:bg-green-500/30 border border-green-500/40 text-[10px] font-mono font-bold text-green-300 transition-all shadow-sm"
                title="Export 1-Minute or 3-Minute Video with Audio & Script"
              >
                <Video className="w-3 h-3 text-green-400" />
                <span>Export Video (1m/3m)</span>
              </button>
            )}
            <button
              onClick={handleCopyFullScript}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-[10px] font-mono text-white transition-all"
              title="Copy the entire 18-minute master script"
            >
              {copiedAll ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedAll ? 'Copied Full Script!' : 'Copy All'}</span>
            </button>
            <button
              onClick={handleDownloadTxt}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-[10px] font-mono text-purple-200 transition-all"
              title="Download script as clean text file"
            >
              <Download className="w-3 h-3" />
              <span>.TXT</span>
            </button>
          </div>
        </div>

        {/* Teleprompter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10 text-[10px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="text-white/50">Teleprompter:</span>
            <button
              onClick={() => setIsAutoScrolling(!isAutoScrolling)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded border transition-all ${
                isAutoScrolling 
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]' 
                  : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
              }`}
            >
              {isAutoScrolling ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{isAutoScrolling ? 'SCROLLING' : 'AUTOSCROLL'}</span>
            </button>

            {isAutoScrolling && (
              <div className="flex items-center gap-1 bg-black/40 px-1.5 py-0.5 rounded border border-white/10">
                <button
                  onClick={() => setScrollSpeed(s => Math.max(1, s - 1))}
                  className="px-1 text-white/60 hover:text-white font-bold"
                >
                  -
                </button>
                <span className="text-emerald-400 font-mono text-[9px]">{scrollSpeed}x</span>
                <button
                  onClick={() => setScrollSpeed(s => Math.min(5, s + 1))}
                  className="px-1 text-white/60 hover:text-white font-bold"
                >
                  +
                </button>
              </div>
            )}
          </div>

          {/* Font Size Selector */}
          <div className="flex items-center gap-1">
            <span className="text-white/40 mr-1">View Size:</span>
            <button
              onClick={() => setFontSize('normal')}
              className={`px-1.5 py-0.5 rounded border ${
                fontSize === 'normal' ? 'bg-white/20 border-white/40 text-white font-bold' : 'border-transparent text-white/40'
              }`}
            >
              A
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-1.5 py-0.5 rounded border text-xs ${
                fontSize === 'large' ? 'bg-white/20 border-white/40 text-white font-bold' : 'border-transparent text-white/40'
              }`}
            >
              A+
            </button>
            <button
              onClick={() => setFontSize('teleprompter')}
              className={`px-1.5 py-0.5 rounded border text-sm font-black ${
                fontSize === 'teleprompter' ? 'bg-purple-500/30 border-purple-400 text-purple-300' : 'border-transparent text-white/40'
              }`}
              title="Stage Teleprompter Size"
            >
              STAGE
            </button>
          </div>
        </div>
      </div>

      {/* Act Scripts List */}
      <div 
        ref={scrollContainerRef}
        className="space-y-4 max-h-[620px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
      >
        {SUPER_PUFF_INITIATION_SPECIAL.acts.map((act, index) => {
          const isSelected = currentActId === act.id;
          const isCopied = copiedActId === act.id;

          // Theme colors
          const themeAccent = index === 0 ? '#00f3ff' : index === 1 ? '#ff00ea' : '#a855f7';

          return (
            <div
              key={act.id}
              className={`rounded-2xl border transition-all relative overflow-hidden ${
                isSelected 
                  ? 'bg-black/80 border-white/30 shadow-[0_0_25px_rgba(0,0,0,0.8)]' 
                  : 'bg-black/50 border-white/10 hover:border-white/20'
              }`}
            >
              {/* Left Color Bar */}
              <div 
                className="absolute top-0 bottom-0 left-0 w-1.5 transition-all"
                style={{ backgroundColor: themeAccent }}
              />

              {/* Act Header */}
              <div className="p-4 pl-5 border-b border-white/10 flex flex-wrap items-center justify-between gap-2 bg-white/[0.02]">
                <div>
                  <div className="flex items-center gap-2">
                    <span 
                      className="text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded"
                      style={{ color: themeAccent, backgroundColor: `${themeAccent}18` }}
                    >
                      {act.title}
                    </span>
                    <span className="text-[10px] font-mono text-white/50 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{act.time}</span>
                    </span>
                    {isSelected && (
                      <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        ACTIVE ON STAGE
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] font-mono text-emerald-400 mt-1 flex items-center gap-1">
                    <Cannabis className="w-3 h-3" />
                    <span>Strain: {act.strainPairing}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {onExportVideo && (
                    <button
                      onClick={() => {
                        if (onSelectAct) onSelectAct(act);
                        onExportVideo(act);
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-500/15 hover:bg-green-500/25 border border-green-500/30 text-[10px] font-mono font-bold text-green-300 transition-all"
                      title="Export this act as a 1-Min or 3-Min video with audio"
                    >
                      <Video className="w-3 h-3 text-green-400" />
                      <span>Export Video</span>
                    </button>
                  )}
                  {onSelectAct && (
                    <button
                      onClick={() => onSelectAct(act)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-[10px] font-mono text-white transition-all"
                      title="Load this act into the live stage performance"
                    >
                      <span>Load to Stage</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    onClick={() => handleCopyAct(act)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-mono text-white/80 hover:text-white transition-all"
                    title="Copy this act's script"
                  >
                    {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{isCopied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Script Body */}
              <div className="p-4 pl-5 space-y-4">
                {/* Stage Directions */}
                {act.stageDirections && (
                  <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 text-purple-200/90 italic font-mono text-xs leading-relaxed">
                    <div className="text-[9px] uppercase tracking-wider text-purple-400 font-bold not-italic mb-1 flex items-center gap-1">
                      <Radio className="w-3 h-3" />
                      <span>Stage Directions & SFX Cue</span>
                    </div>
                    {act.stageDirections}
                  </div>
                )}

                {/* Word-for-Word Performance Script */}
                <div className="space-y-2">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-white/40 font-bold flex items-center gap-1">
                    <Volume2 className="w-3 h-3" />
                    <span>SUPER PUFF (STAND-UP MONOLOGUE)</span>
                  </div>

                  <div 
                    className={`font-mono text-white/90 whitespace-pre-wrap leading-relaxed select-text ${
                      fontSize === 'teleprompter'
                        ? 'text-base sm:text-lg font-medium leading-loose bg-black/70 p-4 rounded-xl border border-white/15 text-amber-100'
                        : fontSize === 'large'
                        ? 'text-sm sm:text-base leading-relaxed bg-black/40 p-3 rounded-xl border border-white/10'
                        : 'text-xs sm:text-sm bg-black/30 p-3 rounded-xl border border-white/10 text-white/85'
                    }`}
                  >
                    {act.performanceScript || act.bit}
                  </div>
                </div>

                {/* Act Study & Theory Footnote */}
                <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[9px] font-mono text-white/40">
                  <span>Theory: <strong className="text-amber-300/80">{act.comedyTheory}</strong></span>
                  <span>Audio: <strong className="text-cyan-300/80">{act.audio}</strong></span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
