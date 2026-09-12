import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HECKLE_PRESETS, 
  HeckleItem, 
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
  Play, 
  RotateCcw, 
  BookOpen, 
  Award, 
  Cannabis, 
  GraduationCap, 
  Check, 
  Trash2, 
  Timer, 
  FastForward, 
  AlertTriangle 
} from 'lucide-react';

export interface TimingDisruption {
  id: string;
  preset: HeckleItem;
  status: 'queued' | 'active' | 'resolved';
  enqueuedAt: number;
  scheduledTime: number; // Timestamp when disruption fires
  delaySeconds: number;
  durationMs: number;
  customText?: string;
}

export interface HecklerRackProps {
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
  onActivateChromatic?: (active: boolean) => void;
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
  onActivateChromatic,
}: HecklerRackProps) {
  const [customText, setCustomText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'audio' | 'projectile' | 'disruption' | 'crowd'>('all');
  const [activeSubTab, setActiveSubTab] = useState<'triggers' | 'queue' | 'study_log' | 'terpenes'>('triggers');
  const [selectedDelay, setSelectedDelay] = useState<number>(3); // Default 3s offset
  const [isChromaticActive, setIsChromaticActive] = useState(false);
  const [recentLog, setRecentLog] = useState<{ id: string; heckle: string; roast: string; theory?: string; timestamp: string }[]>([]);

  // 1. Map in React State to Manage the 'Timing Disruption' Queue
  const [disruptionQueue, setDisruptionQueue] = useState<Map<string, TimingDisruption>>(new Map());

  // Chromatic cleanup timer ref
  const chromaticTimeoutRef = useRef<any>(null);

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

  // 2. Trigger Super-Puff-Chromatic Class on the Main Stage
  const triggerChromaticOnMainStage = useCallback(() => {
    setIsChromaticActive(true);
    if (onActivateChromatic) {
      onActivateChromatic(true);
    }

    if (chromaticTimeoutRef.current) {
      clearTimeout(chromaticTimeoutRef.current);
    }

    // Direct DOM class application to ensure animation trigger across stage nodes
    const stageNodes = document.querySelectorAll('#main-stage, #stage-video-container, .main-stage');
    stageNodes.forEach(node => {
      node.classList.remove('super-puff-chromatic');
      // Trigger DOM reflow to re-arm CSS animation
      void (node as HTMLElement).offsetWidth;
      node.classList.add('super-puff-chromatic');
    });

    chromaticTimeoutRef.current = setTimeout(() => {
      setIsChromaticActive(false);
      stageNodes.forEach(node => node.classList.remove('super-puff-chromatic'));
      if (onActivateChromatic) {
        onActivateChromatic(false);
      }
    }, 4800);
  }, [onActivateChromatic]);

  // Clean up chromatic on unmount
  useEffect(() => {
    return () => {
      if (chromaticTimeoutRef.current) clearTimeout(chromaticTimeoutRef.current);
    };
  }, []);

  // 3. Execution function when a disruption is activated
  const activateDisruption = useCallback((disruption: TimingDisruption) => {
    // Fire the actual comedy action
    if (disruption.customText) {
      onTriggerCustomHeckle(disruption.customText);
    } else {
      onTriggerHeckle(disruption.preset);
    }

    // Trigger super-puff-chromatic effect on main stage
    triggerChromaticOnMainStage();

    // Log to study log
    setRecentLog(prev => [
      {
        id: disruption.id,
        heckle: disruption.customText ? `"${disruption.customText}"` : disruption.preset.label,
        roast: disruption.preset.performerRoast || 'Performer analyzing impromptu banter...',
        theory: disruption.preset.comedyTheoryTakeaway || 'Improv Reflex: Testing timing disruption & cadence.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      },
      ...prev.slice(0, 5)
    ]);

    // Update status in Map to 'active'
    setDisruptionQueue(prev => {
      const existing = prev.get(disruption.id);
      if (!existing) return prev;
      const next = new Map(prev);
      next.set(disruption.id, {
        ...existing,
        status: 'active',
      });
      return next;
    });

    // Automatically transition to 'resolved' after duration
    setTimeout(() => {
      setDisruptionQueue(prev => {
        const existing = prev.get(disruption.id);
        if (!existing) return prev;
        const next = new Map(prev);
        next.set(disruption.id, {
          ...existing,
          status: 'resolved',
        });
        return next;
      });
    }, disruption.durationMs);
  }, [onTriggerHeckle, onTriggerCustomHeckle, triggerChromaticOnMainStage]);

  // 4. Enqueue into Map state
  const handleEnqueueDisruption = (preset: HeckleItem, delaySeconds: number, customTextPhrase?: string) => {
    const id = `disrupt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = Date.now();
    const isInstant = delaySeconds <= 0;

    const disruptionItem: TimingDisruption = {
      id,
      preset,
      status: isInstant ? 'active' : 'queued',
      enqueuedAt: now,
      scheduledTime: now + delaySeconds * 1000,
      delaySeconds,
      durationMs: 5200,
      customText: customTextPhrase,
    };

    // Store in Map state
    setDisruptionQueue(prev => {
      const next = new Map(prev);
      next.set(id, disruptionItem);
      return next;
    });

    if (isInstant) {
      activateDisruption(disruptionItem);
    }
  };

  // Instant trigger shortcut
  const handleInstantTrigger = (preset: HeckleItem) => {
    handleEnqueueDisruption(preset, 0);
  };

  // Remove single disruption from Map
  const handleRemoveDisruption = (id: string) => {
    setDisruptionQueue(prev => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  };

  // Clear all disruptions from Map
  const handleClearAllQueue = () => {
    setDisruptionQueue(new Map());
    onClearDisruptions();
    const stageNodes = document.querySelectorAll('#main-stage, #stage-video-container, .main-stage');
    stageNodes.forEach(node => node.classList.remove('super-puff-chromatic'));
    setIsChromaticActive(false);
  };

  // Trigger queued item immediately
  const handleTriggerNow = (id: string) => {
    const item = disruptionQueue.get(id);
    if (!item) return;
    activateDisruption(item);
  };

  // 5. Timer loop to process the Map queue
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      disruptionQueue.forEach((disruption) => {
        if (disruption.status === 'queued' && now >= disruption.scheduledTime) {
          activateDisruption(disruption);
        }
      });
    }, 150);

    return () => clearInterval(interval);
  }, [disruptionQueue, activateDisruption]);

  // Submit custom heckle
  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;
    const phrase = customText.trim();
    const mockPreset: HeckleItem = {
      id: 'impatient',
      label: `"${phrase}"`,
      category: 'audio',
      phrase,
      description: 'Audience member shoutout',
      icon: '🎙️',
      performerRoast: `You tuned in from the 3rd dimension to yell "${phrase}"? お前、時間を舐めてるだろ？ Super Puff is in control. Times Up, Mother Fathers!`,
      reactionAnimation: 'eyebrow_raise',
      xpAward: 50,
      comedyTheoryTakeaway: 'Improv Reflex: Status inversion & immediate room grounding.',
      terpenePairingNote: 'Instant pattern synthesis.',
    };

    handleEnqueueDisruption(mockPreset, selectedDelay, phrase);
    setCustomText('');
  };

  const queueItems: TimingDisruption[] = Array.from(disruptionQueue.values());
  queueItems.sort((a, b) => a.scheduledTime - b.scheduledTime);
  const queuedCount = queueItems.filter(i => i.status === 'queued').length;
  const activeCount = queueItems.filter(i => i.status === 'active').length;

  return (
    <div className={`flex flex-col h-full ${isCompact ? 'p-2' : 'p-4 sm:p-5'} text-white select-none`}>
      
      {/* Header & Status Bar */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <div 
            className="w-2.5 h-2.5 rounded-full animate-ping"
            style={{ backgroundColor: isChromaticActive ? '#a855f7' : primaryColor }}
          />
          <span className="font-mono text-xs uppercase tracking-widest font-black flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <span>HECKLER LAB & TIMING RACK</span>
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Active Chromatic Indicator Pill */}
          {isChromaticActive && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/50 text-[9px] font-mono text-purple-300 animate-pulse">
              <Sparkles className="w-3 h-3 text-amber-300 animate-spin" />
              <span>SUPER-PUFF-CHROMATIC</span>
            </div>
          )}

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

      {/* Sub-Navigation Switcher with Disruption Queue Badge */}
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
          <span>Presets ({HECKLE_PRESETS.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('queue')}
          className={`flex-1 pb-1.5 border-b-2 transition-all flex items-center justify-center gap-1.5 relative ${
            activeSubTab === 'queue'
              ? 'text-cyan-300 font-bold border-cyan-400'
              : 'text-white/40 border-transparent hover:text-white'
          }`}
        >
          <Clock className="w-3 h-3 text-cyan-400" />
          <span>Timing Queue</span>
          {(queuedCount > 0 || activeCount > 0) && (
            <span className={`text-[8px] px-1.5 py-0.2 rounded-full font-bold ${activeCount > 0 ? 'bg-red-500 text-white animate-pulse' : 'bg-cyan-500/30 text-cyan-300 border border-cyan-400/40'}`}>
              {activeCount > 0 ? `⚡ ${activeCount}` : queuedCount}
            </span>
          )}
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

      {/* TAB 1: PRESET DISRUPTIONS */}
      {activeSubTab === 'triggers' && (
        <>
          {/* Timing Disruption Offset Controller */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-white/10 mb-2.5 text-[9px] font-mono">
            <span className="text-white/60 flex items-center gap-1">
              <Timer className="w-3 h-3 text-cyan-400" />
              <span>Disruption Offset:</span>
            </span>
            <div className="flex items-center gap-1">
              {[
                { sec: 0, label: 'Instant' },
                { sec: 2, label: '+2s' },
                { sec: 4, label: '+4s' },
                { sec: 8, label: '+8s' },
              ].map(opt => (
                <button
                  key={opt.sec}
                  onClick={() => setSelectedDelay(opt.sec)}
                  className={`px-2 py-0.5 rounded transition-all ${
                    selectedDelay === opt.sec
                      ? 'bg-cyan-500/30 text-cyan-300 font-bold border border-cyan-500/50 shadow-sm'
                      : 'bg-white/5 text-white/50 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

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
                <div
                  key={preset.id}
                  className={`flex flex-col p-2.5 rounded-xl border text-left transition-all relative overflow-hidden group ${
                    isCurrent
                      ? 'bg-white/15 border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                      : 'bg-white/5 border-white/10 hover:border-white/25 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-start gap-2 mb-1.5">
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
                  </div>

                  {/* Dual Trigger Action Row: Instant vs Queue */}
                  <div className="flex items-center gap-1 pt-1.5 border-t border-white/10 text-[9px] font-mono">
                    <button
                      onClick={() => handleInstantTrigger(preset)}
                      className="flex-1 flex items-center justify-center gap-1 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 transition-all font-bold"
                      title="Trigger heckle immediately on comedian & activate chromatic effect"
                    >
                      <Zap className="w-2.5 h-2.5 fill-red-400 text-red-400" />
                      <span>Fire Instant</span>
                    </button>
                    <button
                      onClick={() => handleEnqueueDisruption(preset, selectedDelay || 3)}
                      className="flex-1 flex items-center justify-center gap-1 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 transition-all"
                      title={`Queue heckle with +${selectedDelay || 3}s timing disruption`}
                    >
                      <Clock className="w-2.5 h-2.5" />
                      <span>Queue +{selectedDelay || 3}s</span>
                    </button>
                  </div>
                </div>
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
                <span>{selectedDelay > 0 ? `Queue (+${selectedDelay}s)` : 'Shout'}</span>
              </button>
            </div>
          </form>
        </>
      )}

      {/* TAB 2: TIMING DISRUPTION QUEUE (Powered by React Map State) */}
      {activeSubTab === 'queue' && (
        <div className="flex flex-col flex-1 space-y-2.5 overflow-hidden">
          {/* Queue Telemetry Header */}
          <div className="flex items-center justify-between px-1 text-[9px] font-mono">
            <div className="flex items-center gap-2 text-white/60">
              <Activity className="w-3 h-3 text-cyan-400" />
              <span>MAP QUEUE CAPACITY:</span>
              <strong className="text-white">{disruptionQueue.size} SLOTS</strong>
            </div>
            {disruptionQueue.size > 0 && (
              <button
                onClick={handleClearAllQueue}
                className="flex items-center gap-1 text-red-400 hover:text-red-300 text-[8px] uppercase tracking-wider"
              >
                <Trash2 className="w-2.5 h-2.5" />
                <span>Clear All</span>
              </button>
            )}
          </div>

          {/* Super-Puff-Chromatic Status Bar */}
          <div className={`p-2.5 rounded-xl border transition-all duration-500 flex items-center justify-between text-xs font-mono ${
            isChromaticActive
              ? 'bg-purple-950/40 border-purple-500/60 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
              : 'bg-white/5 border-white/10 text-white/50'
          }`}>
            <div className="flex items-center gap-2">
              <Sparkles className={`w-4 h-4 ${isChromaticActive ? 'text-amber-400 animate-spin' : 'text-white/30'}`} />
              <div>
                <div className={`font-bold ${isChromaticActive ? 'text-purple-300' : 'text-white/60'}`}>
                  Stage Chromatic Drift Status: {isChromaticActive ? 'ACTIVE ⚡' : 'STANDBY'}
                </div>
                <div className="text-[9px] opacity-70">
                  {isChromaticActive ? 'Main stage currently pulsating with super-puff-chromatic CSS' : 'Fires on heckle activation'}
                </div>
              </div>
            </div>
            {!isChromaticActive && (
              <button
                onClick={triggerChromaticOnMainStage}
                className="px-2 py-1 rounded bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-500/40 text-[9px] uppercase font-bold"
              >
                Test Pulse
              </button>
            )}
          </div>

          {/* Queue List Rendered from Map */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-72">
            {queueItems.length === 0 ? (
              <div className="p-6 text-center text-xs font-mono text-white/40 bg-white/5 rounded-xl border border-white/5 space-y-2">
                <Clock className="w-6 h-6 mx-auto text-white/20 mb-1" />
                <p className="font-bold text-white/60">Timing Disruption Rack Idle</p>
                <p className="text-[10px] text-white/40 max-w-xs mx-auto">
                  Queue pre-scripted heckles with timing offsets to deliberately throw off Dragon 9's stand-up cadence and rhythm!
                </p>
                <button
                  onClick={() => setActiveSubTab('triggers')}
                  className="mt-2 px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[9px] uppercase font-bold hover:bg-cyan-500/30"
                >
                  Browse Heckle Presets
                </button>
              </div>
            ) : (
              queueItems.map(item => {
                const now = Date.now();
                const remainingSec = Math.max(0, (item.scheduledTime - now) / 1000).toFixed(1);
                const isQueued = item.status === 'queued';
                const isActive = item.status === 'active';

                return (
                  <div
                    key={item.id}
                    className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden space-y-2 ${
                      isActive
                        ? 'bg-purple-950/40 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                        : isQueued
                        ? 'bg-cyan-950/30 border-cyan-500/40'
                        : 'bg-white/5 border-white/10 opacity-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{item.preset.icon}</span>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>{item.customText ? `"${item.customText}"` : item.preset.label}</span>
                            <span className={`text-[8px] font-mono px-1.5 py-0.2 rounded uppercase font-bold ${
                              isActive
                                ? 'bg-red-500 text-white animate-pulse'
                                : isQueued
                                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                                : 'bg-white/10 text-white/40'
                            }`}>
                              {isActive ? '⚡ DISRUPTING NOW' : isQueued ? `QUEUED (-${remainingSec}s)` : 'RESOLVED'}
                            </span>
                          </div>
                          <div className="text-[9px] font-mono text-white/50">
                            Offset: +{item.delaySeconds}s • Award: +{item.preset.xpAward} XP
                          </div>
                        </div>
                      </div>

                      {/* Action Controls for this Map Entry */}
                      <div className="flex items-center gap-1">
                        {isQueued && (
                          <button
                            onClick={() => handleTriggerNow(item.id)}
                            className="flex items-center gap-1 px-2 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-[9px] font-mono font-bold uppercase transition-all"
                            title="Trigger right now"
                          >
                            <Zap className="w-2.5 h-2.5" />
                            <span>Fire</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleRemoveDisruption(item.id)}
                          className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                          title="Cancel disruption"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Countdown Bar */}
                    {isQueued && (
                      <div className="w-full bg-black/40 h-1 rounded-full overflow-hidden border border-white/5">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-150"
                          style={{
                            width: `${Math.min(100, Math.max(0, 100 - ((item.scheduledTime - now) / (item.delaySeconds * 1000)) * 100))}%`
                          }}
                        />
                      </div>
                    )}

                    {/* Performer Retort Preview */}
                    <div className="text-[10px] font-mono text-white/70 italic bg-black/40 p-2 rounded-lg border border-white/5">
                      "{item.preset.performerRoast}"
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 3: STUDY LOG */}
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

      {/* TAB 4: TERPENES */}
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
