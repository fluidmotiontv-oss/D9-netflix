import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HECKLE_PRESETS, 
  HeckleItem, 
  speakHeckle, 
  playHeckleSfx, 
  playCrowdLaughterSfx,
  HeckleType
} from '../audio/hecklerAudio';
import { 
  CANNABIS_CONNOISSEUR_VAULT, 
  COMEDY_RANKS, 
  StrainConnoisseurItem 
} from '../data';
import { 
  Flame, 
  Volume2, 
  Zap, 
  Send, 
  Radio, 
  Activity, 
  Sparkles, 
  ShieldAlert, 
  Clock, 
  RefreshCw, 
  X, 
  Sliders,
  Play,
  RotateCcw,
  SmilePlus,
  BookOpen,
  Award,
  Cannabis,
  GraduationCap
} from 'lucide-react';

interface HecklerRackProps {
  onTriggerHeckle: (heckle: HeckleItem) => void;
  onTriggerCustomHeckle: (phrase: string) => void;
  onClearDisruptions: () => void;
  composure: number;
  totalHecklesHandled: number;
  activeHeckle: HeckleItem | null;
  isFrenzyMode: boolean;
  setIsFrenzyMode: (frenzy: boolean) => void;
  primaryColor?: string;
  accentColor?: string;
  onClose?: () => void;
  isCompact?: boolean;
  comedyXp?: number;
  activeStrain?: StrainConnoisseurItem;
  onSelectStrain?: (strain: StrainConnoisseurItem) => void;
}

export default function HecklerRack({
  onTriggerHeckle,
  onTriggerCustomHeckle,
  onClearDisruptions,
  composure,
  totalHecklesHandled,
  activeHeckle,
  isFrenzyMode,
  setIsFrenzyMode,
  primaryColor = '#f97316',
  accentColor = '#fdba74',
  onClose,
  isCompact = false,
  comedyXp = 450,
  activeStrain = CANNABIS_CONNOISSEUR_VAULT[0],
  onSelectStrain,
}: HecklerRackProps) {
  const [customText, setCustomText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'audio' | 'projectile' | 'disruption' | 'crowd'>('all');
  const [activeSubTab, setActiveSubTab] = useState<'triggers' | 'study_log' | 'terpenes'>('triggers');
  const [recentLog, setRecentLog] = useState<{ id: string; heckle: string; roast: string; theory?: string; timestamp: string }[]>([]);

  // Compute current comedy student rank
  const currentRank = COMEDY_RANKS.slice().reverse().find(r => comedyXp >= r.minXp) || COMEDY_RANKS[0];
  const nextRank = COMEDY_RANKS.find(r => r.minXp > comedyXp) || null;
  const xpProgressInCurrentTier = nextRank 
    ? ((comedyXp - currentRank.minXp) / (nextRank.minXp - currentRank.minXp)) * 100 
    : 100;

  // Filter presets by category
  const filteredPresets = selectedCategory === 'all' 
    ? HECKLE_PRESETS 
    : HECKLE_PRESETS.filter(p => p.category === selectedCategory);

  // Trigger heckle and log
  const handlePresetClick = (preset: HeckleItem) => {
    onTriggerHeckle(preset);
    setRecentLog(prev => [
      {
        id: Math.random().toString(),
        heckle: preset.label,
        roast: preset.performerRoast,
        theory: preset.comedyTheoryTakeaway,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      },
      ...prev.slice(0, 4)
    ]);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;
    onTriggerCustomHeckle(customText.trim());
    setRecentLog(prev => [
      {
        id: Math.random().toString(),
        heckle: `"${customText.trim()}"`,
        roast: 'Performer analyzing impromptu banter...',
        theory: 'Improv Reflex: Testing audience temperature through real-time crowd work.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      },
      ...prev.slice(0, 4)
    ]);
    setCustomText('');
  };

  return (
    <div className={`flex flex-col h-full ${isCompact ? 'p-2' : 'p-4 sm:p-5'} text-white select-none`}>
      
      {/* Header & Status Bar */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <div 
            className="w-2.5 h-2.5 rounded-full animate-ping"
            style={{ backgroundColor: primaryColor }}
          />
          <span className="font-mono text-xs uppercase tracking-widest font-black flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <span>COMEDY CRAFT & TIMING LAB</span>
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {onClose && (
            <button 
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Student of Comedy XP & Level Banner */}
      <div className="mb-3 p-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 backdrop-blur-md relative overflow-hidden">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono font-black uppercase text-amber-300">
              🎓 LVL {currentRank.level}: {currentRank.title}
            </span>
          </div>
          <span className="text-[9px] font-mono text-amber-400 font-bold">
            {comedyXp} {nextRank ? `/ ${nextRank.minXp} XP` : 'XP (MAXED)'}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden border border-amber-500/20">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500"
            style={{ width: `${xpProgressInCurrentTier}%` }}
          />
        </div>

        <div className="flex items-center justify-between mt-1 text-[8px] font-mono text-amber-300/70">
          <span>{currentRank.description}</span>
          <span className="text-amber-400 font-bold">👑 GOAL: Multiverse GOAT</span>
        </div>
      </div>

      {/* Sub-Navigation Switcher */}
      <div className="flex border-b border-white/10 mb-3 text-[10px] font-mono uppercase">
        <button
          onClick={() => setActiveSubTab('triggers')}
          className={`flex-1 pb-1.5 border-b-2 transition-all flex items-center justify-center gap-1 ${
            activeSubTab === 'triggers'
              ? 'text-white font-bold border-amber-500'
              : 'text-white/40 border-transparent hover:text-white'
          }`}
        >
          <ShieldAlert className="w-3 h-3 text-red-400" />
          <span>Disruptions ({HECKLE_PRESETS.length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab('study_log')}
          className={`flex-1 pb-1.5 border-b-2 transition-all flex items-center justify-center gap-1 ${
            activeSubTab === 'study_log'
              ? 'text-white font-bold border-amber-500'
              : 'text-white/40 border-transparent hover:text-white'
          }`}
        >
          <BookOpen className="w-3 h-3 text-amber-400" />
          <span>Theory Logs</span>
        </button>
        <button
          onClick={() => setActiveSubTab('terpenes')}
          className={`flex-1 pb-1.5 border-b-2 transition-all flex items-center justify-center gap-1 ${
            activeSubTab === 'terpenes'
              ? 'text-emerald-400 font-bold border-emerald-500'
              : 'text-white/40 border-transparent hover:text-emerald-400'
          }`}
        >
          <Cannabis className="w-3 h-3 text-emerald-400" />
          <span>Terpenes</span>
        </button>
      </div>

      {/* Comedic Metrics HUD */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {/* Composure Metric */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-2 text-center relative overflow-hidden">
          <div className="text-[8px] font-mono text-white/40 uppercase tracking-wider mb-0.5">
            Composure
          </div>
          <div 
            className="text-sm sm:text-base font-black font-mono transition-colors"
            style={{ color: composure > 80 ? '#22c55e' : composure > 50 ? '#f59e0b' : '#ef4444' }}
          >
            {composure.toFixed(0)}%
          </div>
          <div className="w-full bg-white/10 h-1 rounded-full mt-1 overflow-hidden">
            <div 
              className="h-full transition-all duration-300 rounded-full"
              style={{
                width: `${composure}%`,
                backgroundColor: composure > 80 ? '#22c55e' : composure > 50 ? '#f59e0b' : '#ef4444',
              }}
            />
          </div>
        </div>

        {/* Roasts Handled */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-2 text-center">
          <div className="text-[8px] font-mono text-white/40 uppercase tracking-wider mb-0.5">
            Roasts Handled
          </div>
          <div className="text-sm sm:text-base font-black font-mono text-amber-400">
            {totalHecklesHandled}
          </div>
          <div className="text-[7px] font-mono text-white/30 uppercase">
            +Craft XP
          </div>
        </div>

        {/* Frenzy Mode Toggle */}
        <div 
          onClick={() => setIsFrenzyMode(!isFrenzyMode)}
          className={`border rounded-xl p-2 text-center cursor-pointer transition-all ${
            isFrenzyMode 
              ? 'bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse' 
              : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
          }`}
        >
          <div className="text-[8px] font-mono uppercase tracking-wider mb-0.5 flex items-center justify-center gap-1">
            <Zap className="w-2.5 h-2.5" />
            <span>Frenzy Loop</span>
          </div>
          <div className="text-xs font-black font-mono uppercase">
            {isFrenzyMode ? 'ACTIVE' : 'STANDBY'}
          </div>
        </div>
      </div>

      {activeSubTab === 'triggers' && (
        <>
          {/* Category Filter Chips */}
          <div className="flex space-x-1 overflow-x-auto pb-1.5 mb-2.5 scrollbar-none text-[9px] font-mono uppercase">
            {[
              { id: 'all', label: 'All' },
              { id: 'audio', label: '🗣️ Shouts' },
              { id: 'projectile', label: '🍅 Throw' },
              { id: 'disruption', label: '📱 Gimmicks' },
              { id: 'crowd', label: '🦗 Silence' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-2 py-0.5 rounded-lg whitespace-nowrap transition-all border ${
                  selectedCategory === cat.id
                    ? 'bg-white/20 border-white/40 text-white font-bold'
                    : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Grid of Heckle Triggers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 overflow-y-auto max-h-56 sm:max-h-64 pr-1 mb-2">
            {filteredPresets.map(preset => {
              const isCurrent = activeHeckle?.id === preset.id;

              return (
                <button
                  key={preset.id}
                  onClick={() => handlePresetClick(preset)}
                  className={`flex items-start gap-2 p-2 rounded-xl border text-left transition-all relative overflow-hidden group ${
                    isCurrent
                      ? 'bg-white/20 border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                      : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
                  }`}
                >
                  <span className="text-lg shrink-0 group-hover:scale-110 transition-transform">
                    {preset.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-white/90 truncate uppercase tracking-wide">
                        {preset.label}
                      </span>
                      <span className="text-[8px] font-mono text-amber-400 font-bold">
                        +{preset.xpAward}XP
                      </span>
                    </div>
                    <p className="text-[9px] text-white/50 line-clamp-1 mt-0.5 font-light">
                      {preset.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom Heckle Input Form */}
          <form onSubmit={handleCustomSubmit} className="relative mt-auto pt-2 border-t border-white/10">
            <div className="text-[8px] font-mono text-white/40 uppercase tracking-widest mb-1 flex items-center justify-between">
              <span>Synthesize Custom Heckle</span>
              <span className="text-amber-400 font-bold">+50 XP</span>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Type custom shoutout..."
                className="flex-1 bg-black/60 border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 font-mono"
              />
              <button
                type="submit"
                disabled={!customText.trim()}
                className="px-3 py-1.5 rounded-xl border text-xs font-mono font-bold uppercase transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                style={{
                  borderColor: `${primaryColor}88`,
                  backgroundColor: `${primaryColor}22`,
                  color: accentColor,
                }}
              >
                <Send className="w-3 h-3" />
                <span>Shout</span>
              </button>
            </div>
          </form>
        </>
      )}

      {activeSubTab === 'study_log' && (
        <div className="space-y-2 overflow-y-auto max-h-64 pr-1">
          <div className="text-[9px] font-mono text-amber-300 uppercase tracking-widest mb-1 flex items-center justify-between">
            <span>Dragon 9 Comedy Field Log</span>
            <span className="text-white/40">Real-Time Notes</span>
          </div>

          {recentLog.length === 0 ? (
            <div className="p-4 text-center text-xs font-mono text-white/40 bg-white/5 rounded-xl border border-white/5">
              No recent disruptions logged yet. Trigger heckles above to study comedy mechanics in real-time!
            </div>
          ) : (
            recentLog.map(item => (
              <div key={item.id} className="p-2.5 bg-black/60 border border-amber-500/20 rounded-xl space-y-1 text-left">
                <div className="flex justify-between items-center text-[8px] font-mono text-white/40">
                  <span className="text-red-400 font-bold">Interruption: {item.heckle}</span>
                  <span>{item.timestamp}</span>
                </div>
                <p className="text-xs text-amber-300 font-medium italic">
                  "{item.roast}"
                </p>
                {item.theory && (
                  <div className="text-[9px] font-mono text-emerald-400 pt-1 border-t border-white/10 flex items-center gap-1">
                    <BookOpen className="w-2.5 h-2.5 shrink-0" />
                    <span>Theory: {item.theory}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {activeSubTab === 'terpenes' && (
        <div className="space-y-2 overflow-y-auto max-h-64 pr-1">
          <div className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest mb-1 flex items-center justify-between">
            <span>Terpene Sommelier Vault</span>
            <span className="text-white/40">Goal #2 Mastery</span>
          </div>

          <div className="space-y-2">
            {CANNABIS_CONNOISSEUR_VAULT.map(strain => {
              const isSelected = activeStrain?.id === strain.id;

              return (
                <button
                  key={strain.id}
                  onClick={() => onSelectStrain && onSelectStrain(strain)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all ${
                    isSelected 
                      ? 'bg-emerald-950/40 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                      : 'bg-white/5 border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-emerald-300 truncate">
                      {strain.name}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      THC: {strain.thc}
                    </span>
                  </div>
                  <p className="text-[10px] text-white/70 mb-1">
                    {strain.comedyEnhancement}
                  </p>
                  <div className="flex flex-wrap gap-1 text-[8px] font-mono text-white/50">
                    {strain.terpenes.map(t => (
                      <span key={t.name} className="bg-white/5 px-1.5 py-0.5 rounded border border-white/5 text-amber-300">
                        {t.name} ({t.percentage})
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
