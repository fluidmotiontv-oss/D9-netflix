import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smile, 
  Volume2, 
  VolumeX, 
  Zap, 
  Sparkles, 
  Activity, 
  Flame, 
  Radio, 
  Sliders, 
  Play, 
  Pause, 
  RefreshCw, 
  Check, 
  Keyboard, 
  Music,
  Users,
  ShieldCheck,
  TrendingUp,
  Heart
} from 'lucide-react';
import { 
  CROWD_REACTIONS, 
  CrowdReactionItem, 
  CrowdReactionType, 
  playCrowdReaction 
} from '../audio/crowdAudio';

export interface CrowdReactionProps {
  onTriggerReaction?: (reaction: CrowdReactionItem) => void;
  composure?: number;
  setComposure?: React.Dispatch<React.SetStateAction<number>> | ((comp: number) => void);
  onGainXp?: (amount: number, reason: string) => void;
  isCompact?: boolean;
  activeReaction?: CrowdReactionItem | null;
}

export interface CrowdReactionEvent {
  id: string;
  reaction: CrowdReactionItem;
  timestamp: number;
}

export const CrowdReaction: React.FC<CrowdReactionProps> = ({
  onTriggerReaction,
  composure = 85,
  setComposure,
  onGainXp,
  isCompact = false,
  activeReaction: externalActiveReaction,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'laughter' | 'applause' | 'boo' | 'cheer' | 'gasp' | 'silence'>('all');
  const [volume, setVolume] = useState<number>(0.85);
  const [isAutoAudience, setIsAutoAudience] = useState<boolean>(false);
  const [autoMood, setAutoMood] = useState<'hype' | 'balanced' | 'tough' | 'stoned'>('balanced');
  const [autoIntervalSec, setAutoIntervalSec] = useState<number>(12);
  const [recentEvents, setRecentEvents] = useState<CrowdReactionEvent[]>([]);
  const [lastTriggered, setLastTriggered] = useState<CrowdReactionItem | null>(null);

  // Auto-audience timer
  const autoAudienceTimerRef = useRef<any>(null);

  const activeReaction = externalActiveReaction !== undefined ? externalActiveReaction : lastTriggered;

  // Trigger a reaction
  const triggerReaction = useCallback((reaction: CrowdReactionItem) => {
    // 1. Play procedural Web Audio synthesis
    playCrowdReaction(reaction.id, volume);

    // 2. Set local triggered state
    setLastTriggered(reaction);
    setTimeout(() => {
      setLastTriggered(null);
    }, 2400);

    // 3. Notify parent (e.g. to spawn visual particles on the stage)
    if (onTriggerReaction) {
      onTriggerReaction(reaction);
    }

    // 4. Update composure
    if (setComposure) {
      if (typeof setComposure === 'function') {
        (setComposure as any)((prev: number) => {
          const next = typeof prev === 'number' ? prev + reaction.composureDelta : 85 + reaction.composureDelta;
          return Math.max(5, Math.min(100, next));
        });
      }
    }

    // 5. XP reward on positive reactions
    if (reaction.composureDelta > 0 && onGainXp) {
      onGainXp(reaction.composureDelta * 2, `Crowd: ${reaction.label}`);
    }

    // 6. Add to event log
    setRecentEvents(prev => [
      {
        id: `evt-${Date.now()}-${Math.random()}`,
        reaction,
        timestamp: Date.now(),
      },
      ...prev.slice(0, 19)
    ]);
  }, [volume, onTriggerReaction, setComposure, onGainXp]);

  // Global Keyboard Shortcuts (1-6)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      const key = e.key;
      let matchedReaction: CrowdReactionItem | undefined;

      if (e.shiftKey) {
        if (key === '!') matchedReaction = CROWD_REACTIONS.find(r => r.hotkey === 'Shift+1');
        else if (key === '@') matchedReaction = CROWD_REACTIONS.find(r => r.hotkey === 'Shift+2');
        else if (key === '#') matchedReaction = CROWD_REACTIONS.find(r => r.hotkey === 'Shift+3');
        else if (key === '$') matchedReaction = CROWD_REACTIONS.find(r => r.hotkey === 'Shift+4');
        else if (key === '%') matchedReaction = CROWD_REACTIONS.find(r => r.hotkey === 'Shift+5');
        else if (key === '^') matchedReaction = CROWD_REACTIONS.find(r => r.hotkey === 'Shift+6');
      } else if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        if (key === '1') matchedReaction = CROWD_REACTIONS.find(r => r.id === 'laugh_burst');
        else if (key === '2') matchedReaction = CROWD_REACTIONS.find(r => r.id === 'applause_roar');
        else if (key === '3') matchedReaction = CROWD_REACTIONS.find(r => r.id === 'boo_groan');
        else if (key === '4') matchedReaction = CROWD_REACTIONS.find(r => r.id === 'cheer_whistle');
        else if (key === '5') matchedReaction = CROWD_REACTIONS.find(r => r.id === 'gasp_shock');
        else if (key === '6') matchedReaction = CROWD_REACTIONS.find(r => r.id === 'crickets_awkward');
      }

      if (matchedReaction) {
        e.preventDefault();
        triggerReaction(matchedReaction);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerReaction]);

  // Auto Audience Simulator
  useEffect(() => {
    if (!isAutoAudience) {
      if (autoAudienceTimerRef.current) clearInterval(autoAudienceTimerRef.current);
      return;
    }

    const intervalMs = (autoIntervalSec + (Math.random() * 4 - 2)) * 1000;
    autoAudienceTimerRef.current = setInterval(() => {
      let pool: CrowdReactionItem[] = CROWD_REACTIONS;
      if (autoMood === 'hype') {
        pool = CROWD_REACTIONS.filter(r => r.category === 'applause' || r.category === 'cheer' || r.category === 'laughter');
      } else if (autoMood === 'tough') {
        pool = CROWD_REACTIONS.filter(r => r.category === 'boo' || r.category === 'silence' || r.category === 'gasp');
      } else if (autoMood === 'stoned') {
        pool = CROWD_REACTIONS.filter(r => r.category === 'laughter' || r.category === 'gasp' || r.id === 'cheer_whistle');
      }

      const picked = pool[Math.floor(Math.random() * pool.length)];
      if (picked) {
        triggerReaction(picked);
      }
    }, Math.max(3000, intervalMs));

    return () => {
      if (autoAudienceTimerRef.current) clearInterval(autoAudienceTimerRef.current);
    };
  }, [isAutoAudience, autoMood, autoIntervalSec, triggerReaction]);

  const filteredReactions = selectedCategory === 'all'
    ? CROWD_REACTIONS
    : CROWD_REACTIONS.filter(r => r.category === selectedCategory);

  if (isCompact) {
    // Compact Horizontal Toolbar for direct embedding beneath the video player
    return (
      <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-black/80 border border-white/10 backdrop-blur-md overflow-x-auto select-none">
        <div className="flex items-center gap-1 px-2 border-r border-white/10 text-[9px] font-mono text-white/50 shrink-0">
          <Users className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-bold text-white/80 hidden sm:inline">CROWD:</span>
        </div>

        {CROWD_REACTIONS.slice(0, 8).map((r) => (
          <button
            key={r.id}
            onClick={() => triggerReaction(r)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-mono transition-all hover:scale-105 active:scale-95 shrink-0 bg-white/5 hover:bg-white/10 border border-white/10 text-white"
            style={{
              borderColor: activeReaction?.id === r.id ? r.color : 'rgba(255,255,255,0.1)',
              boxShadow: activeReaction?.id === r.id ? `0 0 12px ${r.color}66` : 'none',
            }}
            title={`${r.label} [Key: ${r.hotkey}]`}
          >
            <span>{r.emoji}</span>
            <span className="hidden md:inline text-[10px]">{r.label}</span>
            <span className="text-[8px] opacity-40 font-bold ml-0.5">({r.hotkey})</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0d0d11]/95 text-white select-none p-4 sm:p-5 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl space-y-4">
      
      {/* 1. Header & Live Atmosphere Gauge */}
      <div className="pb-3 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)]">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black uppercase tracking-wider text-white">
                Live Audience Reaction Engine
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] font-mono font-bold animate-pulse">
                LIVE 432Hz ACOUSTIC
              </span>
            </div>
            <p className="text-[10px] font-mono text-white/50">
              Trigger procedural multi-voice laughter, standing ovations, groaning boos & gasps
            </p>
          </div>
        </div>

        {/* Master Volume & Composure Influence */}
        <div className="flex items-center gap-3 bg-black/60 px-3 py-1.5 rounded-xl border border-white/10">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/70">
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Volume:</span>
            <input
              type="range"
              min="0.1"
              max="1.2"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-16 sm:w-20 accent-amber-500 h-1 bg-white/10 rounded cursor-pointer"
            />
            <span className="w-7 text-right">{Math.round(volume * 100)}%</span>
          </div>

          <div className="h-4 w-px bg-white/10" />

          <div className="flex items-center gap-1.5 text-[10px] font-mono">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-white/60">Vibe:</span>
            <span className={`font-bold ${composure > 75 ? 'text-emerald-400' : composure > 40 ? 'text-amber-400' : 'text-red-400'}`}>
              {composure}%
            </span>
          </div>
        </div>
      </div>

      {/* 2. Auto-Audience Ambient Simulator Bar */}
      <div className="p-3 rounded-xl bg-gradient-to-r from-amber-950/20 via-black/40 to-purple-950/20 border border-white/10 flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAutoAudience(!isAutoAudience)}
            className={`px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              isAutoAudience
                ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            {isAutoAudience ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>{isAutoAudience ? 'AUTO AUDIENCE: ACTIVE' : 'START AUTO AUDIENCE'}</span>
          </button>

          <span className="text-white/40 hidden md:inline">
            Procedurally reacts during pitch timing pauses
          </span>
        </div>

        {/* Mood select */}
        <div className="flex items-center gap-1 bg-black/60 p-0.5 rounded-lg border border-white/10">
          {(['balanced', 'hype', 'tough', 'stoned'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setAutoMood(m)}
              className={`px-2 py-1 rounded capitalize transition-all ${
                autoMood === m
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] font-mono">
        {[
          { id: 'all', label: 'All Reactions', emoji: '✨' },
          { id: 'laughter', label: 'Laughter', emoji: '😂' },
          { id: 'applause', label: 'Applause', emoji: '👏' },
          { id: 'boo', label: 'Groans & Boos', emoji: '👎' },
          { id: 'cheer', label: 'Cheers & Hype', emoji: '🔥' },
          { id: 'gasp', label: 'Gasps & Awe', emoji: '🤯' },
          { id: 'silence', label: 'Awkward Silence', emoji: '🦗' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id as any)}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 shrink-0 ${
              selectedCategory === cat.id
                ? 'bg-white/15 text-white font-bold border border-white/20 shadow-sm'
                : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* 4. Reaction Soundboard Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
        {filteredReactions.map((item) => {
          const isFired = activeReaction?.id === item.id;
          return (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => triggerReaction(item)}
              className="p-3 rounded-xl border text-left flex flex-col justify-between relative overflow-hidden transition-all group"
              style={{
                backgroundColor: isFired ? `${item.color}25` : 'rgba(255,255,255,0.03)',
                borderColor: isFired ? item.color : 'rgba(255,255,255,0.08)',
                boxShadow: isFired ? `0 0 20px ${item.color}55` : 'none',
              }}
            >
              <div className="flex items-start justify-between w-full mb-2">
                <span className="text-2xl group-hover:scale-110 transition-transform">
                  {item.emoji}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-black/60 border border-white/10 font-mono text-[9px] text-white/70 font-bold">
                  {item.hotkey}
                </span>
              </div>

              <div>
                <div className="font-bold text-xs text-white leading-tight mb-0.5 flex items-center gap-1">
                  <span>{item.label}</span>
                </div>
                <p className="text-[10px] font-mono text-white/50 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[9px] font-mono">
                <span 
                  className="font-bold"
                  style={{ color: item.composureDelta >= 0 ? '#10b981' : '#ef4444' }}
                >
                  {item.composureDelta > 0 ? `+${item.composureDelta}% Vibe` : `${item.composureDelta}% Vibe`}
                </span>
                <span className="text-white/40 uppercase tracking-widest text-[8px]">
                  {item.intensity}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* 5. Live Telemetry & Event History */}
      {recentEvents.length > 0 && (
        <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-[9px] font-mono text-white/50">
            <span className="uppercase font-bold tracking-wider">Live Audience Telemetry Log:</span>
            <span>{recentEvents.length} events triggered</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {recentEvents.map((evt) => (
              <div
                key={evt.id}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[9px] font-mono shrink-0 text-white/80"
              >
                <span>{evt.reaction.emoji}</span>
                <span className="font-bold">{evt.reaction.label}</span>
                <span className="text-white/40 ml-1">
                  {new Date(evt.timestamp).toLocaleTimeString([], { second: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Keyboard Tips */}
      <div className="flex items-center justify-between text-[9px] font-mono text-white/40 pt-1 border-t border-white/5">
        <div className="flex items-center gap-1.5">
          <Keyboard className="w-3 h-3 text-amber-400" />
          <span>Hotkeys: Press [1] Punchline, [2] Clap, [3] Boo, [4] Cheer, [5] Gasp, [6] Crickets</span>
        </div>
        <span className="hidden sm:inline">Hold [Shift] for Max Intensity</span>
      </div>

    </div>
  );
};

export default CrowdReaction;
