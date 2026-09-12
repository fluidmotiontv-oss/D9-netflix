import React, { useState, useEffect, useRef, useCallback, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  Play, 
  Pause, 
  Flame, 
  Volume2, 
  VolumeX, 
  Zap, 
  Radio, 
  Timer, 
  Sliders, 
  Send, 
  Trash2, 
  Check, 
  RotateCcw, 
  Sparkles, 
  Clock, 
  AlertTriangle, 
  HelpCircle, 
  ChevronRight, 
  ChevronDown, 
  Eye, 
  EyeOff, 
  Layers, 
  X, 
  RefreshCw, 
  Award, 
  Activity,
  Mic,
  Maximize2,
  Minimize2,
  Bot,
  Cpu,
  Skull,
  UserCheck,
  Headphones
} from 'lucide-react';
import { 
  HECKLE_PRESETS, 
  HeckleItem, 
  HeckleType, 
  playHeckleSfx, 
  speakHeckle, 
  playSuperPuffDropSfx, 
  playCrowdLaughterSfx, 
  speakWithCustomPitch,
  playBrutalModeIntroSfx
} from '../audio/hecklerAudio';
import { useHecklerSpeech } from '../hooks/useHecklerSpeech';
import { 
  HecklerPersonaId, 
  HecklerPersonaConfig, 
  HECKLER_PERSONAS, 
  HECKLER_PERSONA_LIST, 
  getHecklerPersona 
} from '../audio/hecklerPersonas';

export interface HecklerDisruption {
  id: string;
  preset: HeckleItem;
  status: 'queued' | 'active' | 'resolved';
  enqueuedAt: number;
  scheduledTime: number;
  delaySeconds: number;
  durationMs: number;
  customText?: string;
  voiceAccent?: string;
}

export interface HecklerProps {
  // Optional controlled props or self-contained engine
  onTriggerHeckle?: (heckle: HeckleItem) => void;
  onTriggerCustomHeckle?: (text: string) => void;
  onClearDisruptions?: () => void;
  activeHeckle?: HeckleItem | null;
  composure?: number;
  totalHecklesHandled?: number;
  isFrenzyMode?: boolean;
  setIsFrenzyMode?: (val: boolean | ((prev: boolean) => boolean)) => void;
  isBrutalMode?: boolean;
  setIsBrutalMode?: (val: boolean | ((prev: boolean) => boolean)) => void;
  selectedPersona?: HecklerPersonaId;
  onSelectPersona?: (persona: HecklerPersonaId) => void;
  primaryColor?: string;
  accentColor?: string;
  comedyXp?: number;
  activeStrain?: any;
  onSelectStrain?: (strain: any) => void;
  onActivateChromatic?: (active: boolean) => void;
  isCompact?: boolean;
  mode?: 'panel' | 'floating_hud' | 'stage_overlay';
  onCloseFloating?: () => void;
  currentAct?: any;
  isPlaying?: boolean;
}

export const Heckler: React.FC<HecklerProps> = ({
  onTriggerHeckle,
  onTriggerCustomHeckle,
  onClearDisruptions,
  activeHeckle: externalActiveHeckle,
  composure: externalComposure,
  totalHecklesHandled: externalTotalHandled,
  isFrenzyMode: externalFrenzyMode,
  setIsFrenzyMode: externalSetFrenzyMode,
  isBrutalMode: externalBrutalMode,
  setIsBrutalMode: externalSetBrutalMode,
  selectedPersona: externalSelectedPersona,
  onSelectPersona: externalOnSelectPersona,
  primaryColor = '#ea580c',
  accentColor = '#f59e0b',
  comedyXp = 450,
  activeStrain,
  onSelectStrain,
  onActivateChromatic,
  isCompact = false,
  mode = 'panel',
  onCloseFloating,
  currentAct,
  isPlaying = false,
}) => {
  // --- HECKLER SPEECH SYNTHESIS & PERSONA HOOK ---
  const speech = useHecklerSpeech({
    initialPersona: externalSelectedPersona || 'the_heckler'
  });

  useEffect(() => {
    if (externalSelectedPersona && externalSelectedPersona !== speech.selectedPersona) {
      speech.setSelectedPersona(externalSelectedPersona);
    }
  }, [externalSelectedPersona, speech]);

  const handleSelectPersona = useCallback((pId: HecklerPersonaId) => {
    speech.setSelectedPersona(pId);
    if (externalOnSelectPersona) {
      externalOnSelectPersona(pId);
    }
  }, [externalOnSelectPersona, speech]);

  // --- INTERNAL STATE (Self-contained or controlled fallback) ---
  const [internalActiveHeckle, setInternalActiveHeckle] = useState<HeckleItem | null>(null);
  const [internalComposure, setInternalComposure] = useState(88);
  const [internalTotalHandled, setInternalTotalHandled] = useState(12);
  const [internalFrenzyMode, setInternalFrenzyMode] = useState(false);
  const [internalBrutalMode, setInternalBrutalMode] = useState(false);

  const activeHeckle = externalActiveHeckle !== undefined ? externalActiveHeckle : internalActiveHeckle;
  const composure = externalComposure !== undefined ? externalComposure : internalComposure;
  const totalHecklesHandled = externalTotalHandled !== undefined ? externalTotalHandled : internalTotalHandled;
  const isAutoRandom = externalFrenzyMode !== undefined ? externalFrenzyMode : internalFrenzyMode;
  const isBrutal = externalBrutalMode !== undefined ? externalBrutalMode : internalBrutalMode;

  const setAutoRandom = (val: boolean | ((prev: boolean) => boolean)) => {
    if (externalSetFrenzyMode) {
      externalSetFrenzyMode(val);
    } else {
      setInternalFrenzyMode(val);
    }
  };

  const setIsBrutal = (val: boolean | ((prev: boolean) => boolean)) => {
    if (externalSetBrutalMode) {
      externalSetBrutalMode(val);
    } else {
      setInternalBrutalMode(val);
    }
  };

  // --- RANDOM ENGINE CONFIGURATION ---
  const [randomIntervalSec, setRandomIntervalSec] = useState<number>(18);
  const [randomJitter, setRandomJitter] = useState<boolean>(true);
  const [chaosIntensity, setChaosIntensity] = useState<'mild' | 'standard' | 'riot' | 'brutal'>('standard');
  const [timeUntilNextSec, setTimeUntilNextSec] = useState<number>(18);
  const [categoryWeights, setCategoryWeights] = useState({
    audio: true,
    projectile: true,
    disruption: true,
    crowd: true,
  });

  // --- GEMINI AI HECKLER ENGINE STATE ---
  const [useGeminiAi, setUseGeminiAi] = useState<boolean>(true);
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [lastAiHeckle, setLastAiHeckle] = useState<any | null>(null);
  const [aiEngineSource, setAiEngineSource] = useState<string>('gemini-3.8-flash');

  // --- AUDIO/VISUAL TOGGLES ---
  const [enableVoiceSynth, setEnableVoiceSynth] = useState(true);
  const [enableSfx, setEnableSfx] = useState(true);
  const [enableScreenGlitch, setEnableScreenGlitch] = useState(true);
  const [enableProjectiles, setEnableProjectiles] = useState(true);

  // --- QUEUE & LOGS ---
  const [disruptionQueue, setDisruptionQueue] = useState<Map<string, HecklerDisruption>>(new Map());
  const [recentLogs, setRecentLogs] = useState<Array<{
    id: string;
    heckle: string;
    roast: string;
    theory: string;
    timestamp: string;
    category: string;
    xp: number;
  }>>([
    {
      id: 'init_log_1',
      heckle: '"Get on with it mate! We have jobs tomorrow!"',
      roast: 'Mate, linear time is an illusion anyway. Where are you rushing to? Times Up, Mother Fathers!',
      theory: 'Rule of Status Inversion: Disarm anxiety by questioning the sanctity of mundane routine.',
      timestamp: '11:42:15 PM',
      category: 'audio',
      xp: 45
    },
    {
      id: 'init_log_2',
      heckle: '*Splat!* Heirloom tomato flying at the stage',
      roast: 'An heirloom tomato in this economy? Super Puff weaves through gravity. Times Up, Mother Fathers!',
      theory: 'Physical Misdirection: Convert physical debris into economic satire.',
      timestamp: '11:44:02 PM',
      category: 'projectile',
      xp: 60
    }
  ]);

  // --- CUSTOM INJECTOR STATE ---
  const [customText, setCustomText] = useState('');
  const [customVoice, setCustomVoice] = useState<HecklerPersonaId>(externalSelectedPersona || 'the_heckler');
  const [customDelaySec, setCustomDelaySec] = useState(0);
  const [isInjecting, setIsInjecting] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<'all' | 'audio' | 'projectile' | 'disruption' | 'crowd'>('all');

  // --- UI TABS & EXPANSIONS ---
  const [activeSubTab, setActiveSubTab] = useState<'soundboard' | 'personas' | 'engine' | 'custom' | 'queue' | 'telemetry'>('soundboard');
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedPresetPreview, setSelectedPresetPreview] = useState<HeckleItem | null>(null);

  const nextDisruptionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const nextTargetTimestampRef = useRef<number>(Date.now() + randomIntervalSec * 1000);

  // --- CORE EXECUTION HANDLER ---
  const executeDisruption = useCallback((disruption: HecklerDisruption) => {
    // 1. Play Sound FX if enabled
    if (enableSfx) {
      playHeckleSfx(disruption.preset.id);
    }

    // 2. Play Voice Synthesis with distinct heckler persona voice if enabled
    if (enableVoiceSynth) {
      const phraseToSpeak = disruption.customText || disruption.preset.phrase;
      const targetPersona: HecklerPersonaId = 
        (disruption.preset.persona as HecklerPersonaId) || 
        (disruption.voiceAccent as HecklerPersonaId) || 
        speech.selectedPersona;
      speech.speak(phraseToSpeak, targetPersona);
    }

    // 3. Trigger screen glitch / chromatic ripple if enabled
    if (enableScreenGlitch) {
      const stage = document.querySelectorAll('#main-stage, #stage-video-container, .main-stage');
      stage.forEach(node => node.classList.add('super-puff-chromatic'));
      setTimeout(() => {
        stage.forEach(node => node.classList.remove('super-puff-chromatic'));
      }, 1600);
    }

    // 4. Fire external handlers if connected, or update internal state
    if (disruption.customText) {
      if (onTriggerCustomHeckle) {
        onTriggerCustomHeckle(disruption.customText);
      } else {
        setInternalActiveHeckle(disruption.preset);
        setInternalComposure(prev => Math.max(20, prev - 12));
      }
    } else {
      if (onTriggerHeckle) {
        onTriggerHeckle(disruption.preset);
      } else {
        setInternalActiveHeckle(disruption.preset);
        setInternalComposure(prev => Math.max(20, prev - 10));
      }
    }

    // 5. Automatic counter-roast delivery by Super Puff after 1.8s pause
    setTimeout(() => {
      if (enableVoiceSynth) {
        speakHeckle(disruption.preset.performerRoast, true, true);
      }
      if (enableSfx) {
        playSuperPuffDropSfx();
        setTimeout(() => playCrowdLaughterSfx(), 2200);
      }
      setInternalComposure(prev => Math.min(100, prev + 15));
      setInternalTotalHandled(prev => prev + 1);
    }, 1800);

    // 6. Record in live event log
    setRecentLogs(prev => [
      {
        id: disruption.id,
        heckle: disruption.customText ? `"${disruption.customText}"` : disruption.preset.phrase,
        roast: disruption.preset.performerRoast,
        theory: disruption.preset.comedyTheoryTakeaway,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        category: disruption.preset.category,
        xp: disruption.preset.xpAward || 50,
      },
      ...prev.slice(0, 19),
    ]);

    // 7. Update status in Map to 'active' then 'resolved'
    setDisruptionQueue(prev => {
      const existing = prev.get(disruption.id);
      if (!existing) return prev;
      const next = new Map(prev);
      next.set(disruption.id, { ...existing, status: 'active' });
      return next;
    });

    setTimeout(() => {
      setDisruptionQueue(prev => {
        const existing = prev.get(disruption.id);
        if (!existing) return prev;
        const next = new Map(prev);
        next.set(disruption.id, { ...existing, status: 'resolved' });
        return next;
      });
      if (!externalActiveHeckle) {
        setInternalActiveHeckle(null);
      }
    }, disruption.durationMs);
  }, [enableSfx, enableVoiceSynth, enableScreenGlitch, onTriggerCustomHeckle, onTriggerHeckle, externalActiveHeckle, speech]);

  // --- ENQUEUE DISRUPTION HELPER ---
  const enqueueDisruption = useCallback((
    preset: HeckleItem, 
    delaySeconds: number = 0, 
    customTextPhrase?: string,
    voiceAccent?: string
  ) => {
    const id = `heckle_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = Date.now();
    const isInstant = delaySeconds <= 0;

    const item: HecklerDisruption = {
      id,
      preset,
      status: isInstant ? 'active' : 'queued',
      enqueuedAt: now,
      scheduledTime: now + delaySeconds * 1000,
      delaySeconds,
      durationMs: 5500,
      customText: customTextPhrase,
      voiceAccent,
    };

    setDisruptionQueue(prev => {
      const next = new Map(prev);
      next.set(id, item);
      return next;
    });

    if (isInstant) {
      executeDisruption(item);
    }
  }, [executeDisruption]);

  // --- FETCH CONTEXT-AWARE HECKLE VIA GEMINI API ---
  const fetchAiHeckle = useCallback(async (forcedCategory?: string): Promise<HeckleItem | null> => {
    setIsGeneratingAi(true);
    try {
      const actPayload = currentAct ? {
        id: currentAct.id,
        title: currentAct.title,
        bit: currentAct.bit,
        topic: currentAct.comedyTheory || currentAct.studyTakeaway || currentAct.time,
        strainPairing: currentAct.strainPairing,
      } : {
        id: 'act_live',
        title: 'Live Stage Special',
        bit: 'Deconstructing 60-minute time and corporate routines',
        topic: 'Temporal Absurdism',
        strainPairing: activeStrain?.name || 'Chrono-Glaze'
      };

      const resp = await fetch('/api/heckler/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          act: actPayload,
          performer: {
            composure,
            comedyXp,
            rankTitle: 'Super Puff Performer',
            activeStrain: activeStrain?.name || 'Chrono-Glaze'
          },
          intensity: isBrutal ? 'brutal' : chaosIntensity,
          isBrutalMode: isBrutal,
          persona: speech.selectedPersona,
          preferredCategory: forcedCategory || (selectedCategoryFilter !== 'all' ? selectedCategoryFilter : undefined)
        })
      });

      if (!resp.ok) {
        throw new Error(`Heckler API status: ${resp.status}`);
      }

      const data = await resp.json();
      if (data?.heckle) {
        const h = data.heckle;
        setAiEngineSource(data.source === 'gemini-api' ? 'gemini-3.8-flash' : (h.isBrutal ? 'brutal-engine' : 'local-contextual'));
        const heckleItem: HeckleItem = {
          id: (h.id as any) || 'impatient',
          label: h.label || (isBrutal ? 'Ruthless Interruption' : 'Contextual Interruption'),
          category: h.category || 'audio',
          phrase: h.phrase,
          description: `${h.hecklerPersona || 'Audience Spectator'} • Generated by ${data.source === 'gemini-api' ? 'Gemini 3.8 Flash' : 'Contextual Engine'}${isBrutal ? ' [💀 BRUTAL]' : ''}`,
          icon: h.icon || (isBrutal ? '💀' : '🎙️'),
          performerRoast: h.performerRoast,
          reactionAnimation: h.reactionAnimation || 'eyebrow_raise',
          comedyTheoryTakeaway: h.comedyTheoryTakeaway || 'Status Inversion',
          terpenePairingNote: h.terpenePairingNote || 'High Pinene focus',
          xpAward: h.xpAward || (isBrutal ? 180 : 65),
          isBrutal: Boolean(h.isBrutal || isBrutal),
          persona: (h.persona as HecklerPersonaId) || speech.selectedPersona
        };
        setLastAiHeckle(h);
        return heckleItem;
      }
      return null;
    } catch (err) {
      console.warn('[Heckler Engine] Gemini call fallback engaged:', err);
      return null;
    } finally {
      setIsGeneratingAi(false);
    }
  }, [currentAct, composure, comedyXp, activeStrain, chaosIntensity, selectedCategoryFilter, isBrutal, speech.selectedPersona]);

  // Manual Trigger: Summon AI Heckle immediately
  const handleTriggerManualAiHeckle = async () => {
    const aiHeckle = await fetchAiHeckle();
    if (aiHeckle) {
      enqueueDisruption(aiHeckle, 0);
    } else {
      const allowedPresets = HECKLE_PRESETS.filter(p => categoryWeights[p.category]);
      const pool = allowedPresets.length > 0 ? allowedPresets : HECKLE_PRESETS;
      enqueueDisruption(pool[Math.floor(Math.random() * pool.length)], 0);
    }
  };

  // --- RANDOM TRIGGER ENGINE LOOP ---
  useEffect(() => {
    if (!isAutoRandom) {
      if (nextDisruptionTimerRef.current) clearInterval(nextDisruptionTimerRef.current);
      return;
    }

    // Calculate next delay based on intensity & jitter
    const calculateNextDelay = () => {
      let base = randomIntervalSec;
      if (isBrutal || chaosIntensity === 'brutal') base = 5;
      else if (chaosIntensity === 'mild') base = Math.max(15, randomIntervalSec * 1.5);
      else if (chaosIntensity === 'riot') base = Math.max(4, randomIntervalSec * 0.45);
      
      if (randomJitter) {
        const jitterVariance = (Math.random() * 0.6 - 0.3) * base; // ±30%
        return Math.max(3, Math.round(base + jitterVariance));
      }
      return Math.max(3, Math.round(base));
    };

    let delay = calculateNextDelay();
    nextTargetTimestampRef.current = Date.now() + delay * 1000;
    setTimeUntilNextSec(delay);

    const countdownInterval = setInterval(() => {
      const remainingMs = Math.max(0, nextTargetTimestampRef.current - Date.now());
      const remainingSec = Math.ceil(remainingMs / 1000);
      setTimeUntilNextSec(remainingSec);

      if (remainingMs <= 0) {
        // Schedule next random disruption immediately to avoid duplicate firings
        delay = calculateNextDelay();
        nextTargetTimestampRef.current = Date.now() + delay * 1000;
        setTimeUntilNextSec(delay);

        if (useGeminiAi) {
          fetchAiHeckle().then((aiHeckle) => {
            if (aiHeckle) {
              enqueueDisruption(aiHeckle, 0);
            } else {
              const allowedPresets = HECKLE_PRESETS.filter(p => categoryWeights[p.category]);
              const pool = allowedPresets.length > 0 ? allowedPresets : HECKLE_PRESETS;
              const randomPreset = pool[Math.floor(Math.random() * pool.length)];
              enqueueDisruption(randomPreset, 0);
            }
          });
        } else {
          // Filter allowed presets by category
          const allowedPresets = HECKLE_PRESETS.filter(p => categoryWeights[p.category]);
          const pool = allowedPresets.length > 0 ? allowedPresets : HECKLE_PRESETS;
          const randomPreset = pool[Math.floor(Math.random() * pool.length)];
          enqueueDisruption(randomPreset, 0);
        }
      }
    }, 250);

    nextDisruptionTimerRef.current = countdownInterval;

    return () => clearInterval(countdownInterval);
  }, [isAutoRandom, randomIntervalSec, randomJitter, chaosIntensity, categoryWeights, enqueueDisruption, useGeminiAi, fetchAiHeckle]);

  // --- QUEUE PROCESSING TIMER ---
  useEffect(() => {
    const queueInterval = setInterval(() => {
      const now = Date.now();
      disruptionQueue.forEach(item => {
        if (item.status === 'queued' && now >= item.scheduledTime) {
          executeDisruption(item);
        }
      });
    }, 150);

    return () => clearInterval(queueInterval);
  }, [disruptionQueue, executeDisruption]);

  // --- EJECT HECKLER / SILENCE SHIELD ---
  const handleSilenceShield = () => {
    speech.stop();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setDisruptionQueue(new Map());
    if (onClearDisruptions) {
      onClearDisruptions();
    }
    setInternalActiveHeckle(null);
    setInternalComposure(100);
    setAutoRandom(false);

    const stageNodes = document.querySelectorAll('#main-stage, #stage-video-container, .main-stage');
    stageNodes.forEach(node => node.classList.remove('super-puff-chromatic'));
  };

  // --- SUBMIT CUSTOM HECKLE ---
  const handleCustomSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;

    setIsInjecting(true);
    const phrase = customText.trim();
    const personaConfig = getHecklerPersona(customVoice);
    const customPreset: HeckleItem = {
      id: 'impatient',
      label: `"${phrase}"`,
      category: 'audio',
      phrase,
      description: `Live spectator interruption • ${personaConfig.name} (${personaConfig.tagline})`,
      icon: personaConfig.avatar || '🎙️',
      performerRoast: `You waited through all 4 dimensions to say "${phrase}"? お前、時間を舐めてるだろ？ Super Puff is in complete control. Times Up, Mother Fathers!`,
      reactionAnimation: 'eyebrow_raise',
      xpAward: 55,
      comedyTheoryTakeaway: 'Improv Reflex: Instant status grounding and room parity.',
      terpenePairingNote: 'High Terpinolene for rapid witty bantering.',
      persona: customVoice,
    };

    enqueueDisruption(customPreset, customDelaySec, phrase, customVoice);
    setCustomText('');
    setTimeout(() => setIsInjecting(false), 400);
  };

  // Filter presets for soundboard view
  const filteredPresets = selectedCategoryFilter === 'all' 
    ? HECKLE_PRESETS 
    : HECKLE_PRESETS.filter(p => p.category === selectedCategoryFilter);

  const queueList: HecklerDisruption[] = (Array.from(disruptionQueue.values()) as HecklerDisruption[]).sort((a, b) => a.scheduledTime - b.scheduledTime);
  const queuedCount = queueList.filter(i => i.status === 'queued').length;
  const activeCount = queueList.filter(i => i.status === 'active').length;

  return (
    <div className={`flex flex-col h-full bg-[#0d0d11]/95 text-white select-none ${isCompact ? 'p-3' : 'p-4 sm:p-5'} rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl`}>
      
      {/* Top Header & Composure Gauge Bar */}
      <div className="pb-3 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.25)]">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-black uppercase tracking-wider text-white">
                Heckler Lab & Control Panel
              </h2>
              {activeHeckle && (
                <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[9px] font-mono font-bold animate-pulse flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  LIVE HECKLE
                </span>
              )}
            </div>
            <p className="text-[10px] font-mono text-white/50">
              Auto-Random Pitch Disruptions • Real-time Audio-Visual Engine
            </p>
          </div>
        </div>

        {/* Master Silence Shield & Floating Close Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const next = !isBrutal;
              setIsBrutal(next);
              if (next) {
                setChaosIntensity('brutal');
                setRandomIntervalSec(5);
                playBrutalModeIntroSfx();
              } else {
                setChaosIntensity('standard');
                setRandomIntervalSec(18);
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-mono font-bold uppercase transition-all shadow-sm active:scale-95 ${
              isBrutal
                ? 'bg-red-600 text-white border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.7)] animate-pulse'
                : 'bg-red-950/20 hover:bg-red-950/40 border-red-900/40 text-red-400/70 hover:text-red-300'
            }`}
            title="Toggle Brutal Mode Crucible"
          >
            <Skull className="w-3.5 h-3.5" />
            <span>{isBrutal ? 'BRUTAL ON' : 'BRUTAL MODE'}</span>
          </button>

          <button
            onClick={handleSilenceShield}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-300 text-[10px] font-mono font-bold uppercase transition-all shadow-sm active:scale-95"
            title="Eject Heckler & Instantly Silence All Disruptions"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
            <span>Silence Shield</span>
          </button>

          {onCloseFloating && (
            <button
              onClick={onCloseFloating}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Live Composure & Quick Status HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-3">
        {/* Composure Bar */}
        <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1.5 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-[9px] font-mono">
            <span className="text-white/60 uppercase">Performer Composure</span>
            <span className={`font-bold ${composure > 70 ? 'text-emerald-400' : composure > 40 ? 'text-amber-400' : 'text-red-400'}`}>
              {composure}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className={`h-full transition-all duration-300 ${composure > 70 ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : composure > 40 ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'}`}
              style={{ width: `${composure}%` }}
            />
          </div>
        </div>

        {/* Auto-Random Status Indicator */}
        <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-[9px] font-mono text-white/60 uppercase">Random Heckler</div>
            <div className={`text-xs font-mono font-black ${isAutoRandom ? 'text-red-400 animate-pulse' : 'text-white/40'}`}>
              {isAutoRandom ? `ACTIVE (${timeUntilNextSec}s)` : 'PAUSED'}
            </div>
          </div>
          <button
            onClick={() => setAutoRandom(prev => !prev)}
            className={`p-2 rounded-lg border transition-all ${isAutoRandom ? 'bg-red-500/20 border-red-500/50 text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.4)]' : 'bg-white/5 border-white/10 text-white/50 hover:text-white'}`}
            title={isAutoRandom ? 'Pause Auto-Random Disruptions' : 'Start Auto-Random Disruptions'}
          >
            {isAutoRandom ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Deflected Heckles Counter */}
        <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
          <div className="text-[9px] font-mono text-white/60 uppercase">Heckles Deflected</div>
          <div className="text-xs font-mono font-black text-amber-400 flex items-center gap-1.5">
            <span>{totalHecklesHandled}</span>
            <span className="text-[9px] font-normal text-white/40">handled</span>
          </div>
        </div>

        {/* Comedy XP */}
        <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
          <div className="text-[9px] font-mono text-white/60 uppercase">Comedy XP Rank</div>
          <div className="text-xs font-mono font-black text-cyan-400 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-cyan-400" />
            <span>{comedyXp} XP</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1 border-b border-white/10 pb-2 mb-3 overflow-x-auto scrollbar-none text-[10px] font-mono uppercase tracking-wider">
        <button
          onClick={() => setActiveSubTab('soundboard')}
          className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${activeSubTab === 'soundboard' ? 'bg-red-500/20 text-red-300 border border-red-500/40 font-bold shadow-sm' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
        >
          <span>🎙️ Soundboard</span>
          <span className="text-[9px] opacity-70">({HECKLE_PRESETS.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('personas')}
          className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${activeSubTab === 'personas' ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40 font-bold shadow-sm' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
        >
          <span>🎭 Personas & Voices</span>
          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-fuchsia-500/20 text-fuchsia-200 border border-fuchsia-500/30">
            {speech.allPersonas.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('engine')}
          className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${activeSubTab === 'engine' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold shadow-sm' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
        >
          <Sliders className="w-3 h-3 text-amber-400" />
          <span>Random Engine</span>
        </button>

        <button
          onClick={() => setActiveSubTab('custom')}
          className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${activeSubTab === 'custom' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold shadow-sm' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
        >
          <Send className="w-3 h-3 text-purple-400" />
          <span>Custom Injector</span>
        </button>

        <button
          onClick={() => setActiveSubTab('queue')}
          className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${activeSubTab === 'queue' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-sm' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
        >
          <Clock className="w-3 h-3 text-cyan-400" />
          <span>Queue ({queuedCount})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('telemetry')}
          className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${activeSubTab === 'telemetry' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold shadow-sm' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
        >
          <Activity className="w-3 h-3 text-emerald-400" />
          <span>Event Logs</span>
        </button>
      </div>

      {/* TAB CONTENT AREA */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-[320px]">
        
        {/* --- 1. SOUNDBOARD TAB --- */}
        {activeSubTab === 'soundboard' && (
          <div className="space-y-3">
            {/* Gemini AI Heckler Quick Banner */}
            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-950/40 via-black/70 to-red-950/40 border border-purple-500/30 flex flex-wrap items-center justify-between gap-3 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-inner">
                  <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black uppercase text-purple-300 tracking-wider">
                      Gemini AI Heckler Engine
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-purple-500/20 border border-purple-500/40 text-[8px] font-mono text-purple-300">
                      {aiEngineSource}
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-white/60 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Listening to: <span className="text-white font-medium truncate max-w-[180px]">{currentAct?.title || 'Live Stand-Up Set'}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleTriggerManualAiHeckle}
                  disabled={isGeneratingAi}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-[10px] font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.4)] active:scale-95 cursor-pointer"
                  title="Summon Gemini to generate a context-aware heckle based on the active act"
                >
                  {isGeneratingAi ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>Synthesizing...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3 h-3 text-amber-300" />
                      <span>Summon AI Heckle</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Active Heckler Voice Persona Bar */}
            <div className="p-3 rounded-xl bg-black/60 border border-fuchsia-500/30 flex flex-wrap items-center justify-between gap-2.5 shadow-sm">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl p-1.5 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20">{speech.activePersonaConfig.avatar}</span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-mono uppercase text-white/50">Voice Persona:</span>
                    <span className="text-xs font-bold text-fuchsia-300">{speech.activePersonaConfig.name}</span>
                    <span className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40 uppercase">
                      {speech.activePersonaConfig.categoryTone}
                    </span>
                    {speech.isSpeaking && (
                      <span className="flex items-center gap-1 text-[8px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse">
                        <Volume2 className="w-2.5 h-2.5" />
                        <span>Speaking</span>
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-white/60 italic font-mono truncate max-w-xs sm:max-w-md">
                    "{speech.activePersonaConfig.tagline}"
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => speech.audition(speech.selectedPersona)}
                  disabled={speech.isSpeaking}
                  className="px-2.5 py-1.5 rounded-lg bg-fuchsia-600/30 hover:bg-fuchsia-600/50 border border-fuchsia-500/40 text-fuchsia-200 text-[10px] font-mono font-bold uppercase transition-all flex items-center gap-1 cursor-pointer active:scale-95 disabled:opacity-50"
                  title="Audition Persona Voice (Web Speech API)"
                >
                  <Volume2 className="w-3 h-3 text-fuchsia-400" />
                  <span>{speech.isSpeaking ? 'Speaking...' : 'Audition Voice'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('personas')}
                  className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 text-[10px] font-mono uppercase transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>Switch Voice</span>
                  <ChevronRight className="w-3 h-3 text-white/40" />
                </button>
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {(['all', 'audio', 'projectile', 'disruption', 'crowd'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[9px] font-mono uppercase tracking-wider transition-all ${
                    selectedCategoryFilter === cat
                      ? 'bg-white/20 text-white font-bold border border-white/30'
                      : 'bg-black/40 text-white/50 hover:text-white border border-white/5'
                  }`}
                >
                  {cat === 'all' ? 'All Disruption Types' : cat}
                </button>
              ))}
            </div>

            {/* Soundboard Preset Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredPresets.map(preset => {
                const isCurrentlyActive = activeHeckle?.id === preset.id;

                return (
                  <div
                    key={preset.id}
                    className={`p-3 rounded-xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                      isCurrentlyActive
                        ? 'bg-red-950/40 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.35)]'
                        : 'bg-black/50 border-white/10 hover:border-white/25 hover:bg-black/70'
                    }`}
                  >
                    <div className="space-y-1.5 mb-2">
                      <div className="flex items-start justify-between gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{preset.icon}</span>
                          <div>
                            <h4 className="text-xs font-bold text-white leading-tight">
                              {preset.label}
                            </h4>
                            <span className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-white/50 uppercase">
                              {preset.category} • +{preset.xpAward} XP
                            </span>
                          </div>
                        </div>

                        {/* Sound SFX Preview Button */}
                        <button
                          onClick={() => playHeckleSfx(preset.id)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white"
                          title="Preview Audio SFX"
                        >
                          <Volume2 className="w-3 h-3" />
                        </button>
                      </div>

                      <p className="text-[11px] text-white/70 italic font-mono pl-1 border-l-2 border-red-500/30">
                        "{preset.phrase}"
                      </p>
                    </div>

                    {/* Action Triggers: Instant or Delay */}
                    <div className="flex items-center gap-1.5 pt-2 border-t border-white/5">
                      <button
                        onClick={() => enqueueDisruption(preset, 0)}
                        className="flex-1 py-1.5 rounded-lg bg-red-600/30 hover:bg-red-600/50 border border-red-500/40 text-red-200 text-[10px] font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1 shadow-sm active:scale-95"
                      >
                        <Zap className="w-3 h-3 text-red-400" />
                        <span>Fire Now</span>
                      </button>

                      <button
                        onClick={() => enqueueDisruption(preset, 5)}
                        className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 text-[9px] font-mono uppercase transition-all"
                        title="Enqueue with 5-second delay"
                      >
                        +5s
                      </button>

                      <button
                        onClick={() => enqueueDisruption(preset, 10)}
                        className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 text-[9px] font-mono uppercase transition-all"
                        title="Enqueue with 10-second delay"
                      >
                        +10s
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* --- 2. PERSONAS & VOICES TAB --- */}
        {activeSubTab === 'personas' && (
          <div className="space-y-4">
            {/* Header / Engine Status Card */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-fuchsia-950/40 via-black/70 to-purple-950/40 border border-fuchsia-500/30 space-y-3 shadow-[0_0_25px_rgba(217,70,239,0.15)]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-fuchsia-500/20 border border-fuchsia-500/40 flex items-center justify-center text-xl shadow-inner">
                    {speech.activePersonaConfig.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-black uppercase text-fuchsia-300 tracking-wider">
                        Web Speech API Heckler Personas
                      </h3>
                      <span className="text-[8px] font-mono px-2 py-0.5 rounded-full bg-fuchsia-500/20 text-fuchsia-200 border border-fuchsia-500/30 uppercase">
                        {speech.isSpeechSupported ? 'Web Speech API Online' : 'Speech API Polyfill'}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/70 font-light">
                      Choose distinct comedic voice personas for AI disruptions and live crowd interruptions.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {speech.isSpeaking ? (
                    <button
                      type="button"
                      onClick={() => speech.stop()}
                      className="px-3 py-1.5 rounded-lg bg-red-600/30 hover:bg-red-600/50 border border-red-500/50 text-red-200 text-[10px] font-mono font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <VolumeX className="w-3.5 h-3.5 text-red-400" />
                      <span>Stop Voice</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => speech.audition(speech.selectedPersona)}
                      className="px-3 py-1.5 rounded-lg bg-fuchsia-600/30 hover:bg-fuchsia-600/50 border border-fuchsia-500/50 text-fuchsia-200 text-[10px] font-mono font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-fuchsia-400" />
                      <span>Audition Active Voice</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Real-time speech status banner */}
              {speech.isSpeaking && (
                <div className="p-2.5 rounded-lg bg-fuchsia-950/50 border border-fuchsia-500/40 flex items-center justify-between gap-2 text-[10px] font-mono">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="flex items-end gap-0.5 h-3 px-1">
                      <span className="w-1 bg-fuchsia-400 rounded animate-pulse" style={{ height: '60%' }} />
                      <span className="w-1 bg-fuchsia-400 rounded animate-pulse" style={{ height: '100%' }} />
                      <span className="w-1 bg-fuchsia-400 rounded animate-pulse" style={{ height: '40%' }} />
                      <span className="w-1 bg-fuchsia-400 rounded animate-pulse" style={{ height: '80%' }} />
                    </div>
                    <span className="text-fuchsia-300 font-bold uppercase">Now Speaking:</span>
                    <span className="text-white/90 italic truncate">"{speech.currentSpeakingPhrase}"</span>
                  </div>
                  <span className="text-[9px] text-fuchsia-400 shrink-0 font-bold">
                    {speech.activePersonaConfig.name}
                  </span>
                </div>
              )}
            </div>

            {/* Heckler Persona Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {speech.allPersonas.map((persona) => {
                const isSelected = speech.selectedPersona === persona.id;

                return (
                  <div
                    key={persona.id}
                    className={`p-3.5 rounded-xl border transition-all relative flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? 'bg-gradient-to-b from-fuchsia-950/50 to-black/80 border-fuchsia-500/60 shadow-[0_0_20px_rgba(217,70,239,0.2)]'
                        : 'bg-black/50 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {/* Top Row: Avatar, Title, Tone Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl p-1.5 rounded-xl bg-white/5 border border-white/10">
                          {persona.avatar}
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-bold text-white">{persona.name}</h4>
                            <span className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-white/80 uppercase">
                              {persona.categoryTone}
                            </span>
                          </div>
                          <p className="text-[10px] text-fuchsia-300/80 font-mono italic">
                            "{persona.tagline}"
                          </p>
                        </div>
                      </div>

                      {isSelected && (
                        <span className="px-2 py-0.5 rounded-md bg-fuchsia-500/30 text-fuchsia-200 border border-fuchsia-500/50 text-[8px] font-mono uppercase font-bold flex items-center gap-1">
                          <Check className="w-2.5 h-2.5 text-fuchsia-300" />
                          <span>Active</span>
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-[11px] text-white/60 font-light leading-relaxed">
                      {persona.description}
                    </p>

                    {/* Acoustic Profile Metrics */}
                    <div className="grid grid-cols-3 gap-1.5 p-2 rounded-lg bg-black/40 border border-white/5 text-[9px] font-mono">
                      <div>
                        <span className="text-white/40 block">Pitch</span>
                        <span className="text-fuchsia-300 font-bold">{persona.speechConfig.pitch}x</span>
                      </div>
                      <div>
                        <span className="text-white/40 block">Pacing</span>
                        <span className="text-amber-300 font-bold">{persona.speechConfig.rate}x</span>
                      </div>
                      <div>
                        <span className="text-white/40 block">Voice Family</span>
                        <span className="text-cyan-300 font-bold truncate block">{persona.speechConfig.voicePreferences[0] || 'Default'}</span>
                      </div>
                    </div>

                    {/* Sample Phrases / Quick Audition Buttons */}
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-white/40 uppercase block">Sample Lines:</span>
                      <div className="space-y-1">
                        {persona.sampleLines.slice(0, 2).map((sample, sIdx) => (
                          <button
                            key={sIdx}
                            type="button"
                            onClick={() => speech.speak(sample, persona.id)}
                            className="w-full text-left p-1.5 rounded bg-white/5 hover:bg-fuchsia-500/20 border border-white/5 hover:border-fuchsia-500/30 text-[10px] text-white/80 hover:text-white transition-all flex items-center justify-between gap-1.5 group cursor-pointer"
                            title={`Speak "${sample}"`}
                          >
                            <span className="italic truncate">"{sample}"</span>
                            <Volume2 className="w-3 h-3 text-white/30 group-hover:text-fuchsia-400 shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Action Bar: Select Persona & Audition */}
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => handleSelectPersona(persona.id)}
                        className={`py-1.5 px-2 rounded-lg text-[10px] font-mono font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-fuchsia-500 text-white shadow-sm'
                            : 'bg-white/10 hover:bg-white/20 text-white/80 hover:text-white'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Selected</span>
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-3 h-3" />
                            <span>Select Voice</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => speech.audition(persona.id)}
                        disabled={speech.isSpeaking}
                        className="py-1.5 px-2 rounded-lg bg-fuchsia-600/20 hover:bg-fuchsia-600/40 border border-fuchsia-500/30 text-fuchsia-200 text-[10px] font-mono font-bold uppercase transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 disabled:opacity-50"
                      >
                        <Volume2 className="w-3 h-3 text-fuchsia-400" />
                        <span>Audition</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Synthesizer Control Deck (Pitch, Rate, Volume, Browser Voice) */}
            <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-fuchsia-400" />
                  <h4 className="text-xs font-black uppercase text-white tracking-wider">
                    Speech Synthesizer Fine-Tuning
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    speech.setPitchMultiplier(1.0);
                    speech.setRateMultiplier(1.0);
                    speech.setVolume(1.0);
                  }}
                  className="text-[9px] font-mono text-white/50 hover:text-fuchsia-300 underline transition-colors cursor-pointer"
                >
                  Reset to Defaults
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[10px] font-mono">
                {/* Pitch Multiplier */}
                <div className="space-y-1 p-2.5 rounded-lg bg-white/5 border border-white/5">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Pitch Multiplier:</span>
                    <span className="text-fuchsia-300 font-bold">{speech.pitchMultiplier.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="1.8"
                    step="0.05"
                    value={speech.pitchMultiplier}
                    onChange={(e) => speech.setPitchMultiplier(Number(e.target.value))}
                    className="w-full accent-fuchsia-500 cursor-pointer h-1.5 bg-white/10 rounded-lg"
                  />
                </div>

                {/* Rate Multiplier */}
                <div className="space-y-1 p-2.5 rounded-lg bg-white/5 border border-white/5">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Speed / Rate:</span>
                    <span className="text-amber-300 font-bold">{speech.rateMultiplier.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="1.8"
                    step="0.05"
                    value={speech.rateMultiplier}
                    onChange={(e) => speech.setRateMultiplier(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer h-1.5 bg-white/10 rounded-lg"
                  />
                </div>

                {/* Volume Slider */}
                <div className="space-y-1 p-2.5 rounded-lg bg-white/5 border border-white/5">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Voice Volume:</span>
                    <span className="text-cyan-300 font-bold">{Math.round(speech.volume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={speech.volume}
                    onChange={(e) => speech.setVolume(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-white/10 rounded-lg"
                  />
                </div>
              </div>

              {/* Browser Speech Synthesis Engine info */}
              {speech.availableVoices.length > 0 && (
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-white/60">
                  <div className="flex items-center gap-1.5">
                    <Headphones className="w-3.5 h-3.5 text-fuchsia-400" />
                    <span>System Voice Engine:</span>
                    <span className="text-white font-medium">
                      {speech.availableVoices.length} voices loaded across system locales
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => speech.speak("Super Puff heckler audio synthesis test complete!", speech.selectedPersona)}
                    className="px-2.5 py-1 rounded bg-fuchsia-600/30 hover:bg-fuchsia-600/50 border border-fuchsia-500/40 text-fuchsia-200 uppercase font-bold cursor-pointer active:scale-95"
                  >
                    Test Synthesis
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- 3. RANDOM ENGINE TAB --- */}
        {activeSubTab === 'engine' && (
          <div className="space-y-4">
            {/* Gemini AI Engine Master Card */}
            <div className="p-4 rounded-xl bg-gradient-to-b from-purple-950/40 via-black/70 to-black/80 border border-purple-500/40 space-y-3.5 shadow-[0_0_25px_rgba(168,85,247,0.15)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase text-purple-300 tracking-wider flex items-center gap-1.5">
                      <span>Gemini API Heckler Engine</span>
                      <span className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-purple-500/30 text-purple-200 border border-purple-400/30">
                        {aiEngineSource}
                      </span>
                    </h3>
                    <span className="text-[9px] font-mono text-white/50">
                      Context-Aware Stand-Up Audience Simulator
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAutoRandom(prev => !prev)}
                    className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition-all flex items-center gap-1.5 ${
                      isAutoRandom
                        ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                        : 'bg-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${isAutoRandom ? 'bg-white animate-ping' : 'bg-white/30'}`} />
                    <span>{isAutoRandom ? 'ENGINE RUNNING' : 'ENGINE DISABLED'}</span>
                  </button>
                </div>
              </div>

              {/* AI Generation Mode Toggle */}
              <div className="grid grid-cols-2 gap-2 p-1.5 rounded-lg bg-black/60 border border-white/10 text-[10px] font-mono">
                <button
                  type="button"
                  onClick={() => setUseGeminiAi(true)}
                  className={`py-1.5 px-2 rounded flex items-center justify-center gap-1.5 transition-all ${
                    useGeminiAi
                      ? 'bg-purple-600 text-white font-bold shadow-sm'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>Gemini AI (Real-time)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setUseGeminiAi(false)}
                  className={`py-1.5 px-2 rounded flex items-center justify-center gap-1.5 transition-all ${
                    !useGeminiAi
                      ? 'bg-white/20 text-white font-bold shadow-sm'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  <Layers className="w-3 h-3 text-cyan-300" />
                  <span>Static Presets Pool</span>
                </button>
              </div>

              {/* Context Radar: What Gemini is analyzing */}
              <div className="p-3 rounded-lg bg-black/50 border border-purple-500/20 space-y-2">
                <div className="flex items-center justify-between text-[9px] font-mono text-purple-300/80">
                  <span className="flex items-center gap-1">
                    <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                    <span>LIVE PERFORMANCE CONTEXT RADAR</span>
                  </span>
                  <span className="text-white/40">Feed into gemini-3.8-flash</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                  <div className="p-2 rounded bg-white/5 border border-white/5">
                    <span className="text-white/40 block text-[8px] uppercase">Active Act</span>
                    <span className="text-white font-medium truncate block">
                      {currentAct?.title || 'Act I: The Threshold'}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-white/5 border border-white/5">
                    <span className="text-white/40 block text-[8px] uppercase">Premise / Bit</span>
                    <span className="text-white font-medium truncate block">
                      {currentAct?.bit || 'Temporal Stand-Up Routine'}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-white/5 border border-white/5">
                    <span className="text-white/40 block text-[8px] uppercase">Strain Pairing</span>
                    <span className="text-emerald-400 font-medium truncate block">
                      {activeStrain?.name || currentAct?.strainPairing || 'Chrono-Glaze 28.2%'}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-white/5 border border-white/5">
                    <span className="text-white/40 block text-[8px] uppercase">Performer Poise</span>
                    <span className="text-amber-400 font-medium truncate block">
                      {composure}% Composure
                    </span>
                  </div>
                </div>
              </div>

              {/* Live Countdown & Test Trigger */}
              <div className="flex items-center justify-between pt-1 text-[10px] font-mono">
                <div className="flex items-center gap-2">
                  <Timer className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-white/70">
                    Next {useGeminiAi ? 'AI Heckle' : 'Disruption'} in:
                  </span>
                  <span className="text-amber-400 font-bold font-mono">
                    {timeUntilNextSec}s
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleTriggerManualAiHeckle}
                  disabled={isGeneratingAi}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-500 hover:to-red-500 text-white font-bold uppercase transition-all shadow-[0_0_12px_rgba(168,85,247,0.3)] flex items-center gap-1.5 active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {isGeneratingAi ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>Synthesizing...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3 h-3 text-amber-300" />
                      <span>Test AI Heckle Now</span>
                    </>
                  )}
                </button>
              </div>

              {/* Interval Slider */}
              <div className="space-y-1.5 pt-2 border-t border-white/10">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-white/70">Scheduled Trigger Interval</span>
                  <span className="text-amber-400 font-bold">{randomIntervalSec}s</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="90"
                  step="1"
                  value={randomIntervalSec}
                  onChange={(e) => setRandomIntervalSec(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer h-1.5 bg-white/10 rounded-lg"
                />
              </div>

              {/* Chaos Intensity Preset Chips */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-white/70 uppercase">Interval & Chaos Presets:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => { setChaosIntensity('mild'); setRandomIntervalSec(30); }}
                    className={`p-2 rounded-lg border text-[10px] font-mono text-center transition-all ${chaosIntensity === 'mild' ? 'bg-emerald-950/40 border-emerald-400 text-emerald-300 font-bold shadow-sm' : 'bg-black/40 border-white/10 text-white/50 hover:text-white'}`}
                  >
                    🌱 Mild (30s)
                  </button>

                  <button
                    onClick={() => { setChaosIntensity('standard'); setRandomIntervalSec(18); }}
                    className={`p-2 rounded-lg border text-[10px] font-mono text-center transition-all ${chaosIntensity === 'standard' ? 'bg-amber-950/40 border-amber-400 text-amber-300 font-bold shadow-sm' : 'bg-black/40 border-white/10 text-white/50 hover:text-white'}`}
                  >
                    🎲 Standard (18s)
                  </button>

                  <button
                    onClick={() => { setChaosIntensity('riot'); setRandomIntervalSec(8); }}
                    className={`p-2 rounded-lg border text-[10px] font-mono text-center transition-all ${chaosIntensity === 'riot' ? 'bg-orange-950/40 border-orange-400 text-orange-300 font-bold shadow-sm' : 'bg-black/40 border-white/10 text-white/50 hover:text-white'}`}
                  >
                    🔥 Riot (8s)
                  </button>

                  <button
                    onClick={() => { 
                      setChaosIntensity('brutal'); 
                      setRandomIntervalSec(5); 
                      setIsBrutal(true); 
                      playBrutalModeIntroSfx();
                    }}
                    className={`p-2 rounded-lg border text-[10px] font-mono text-center transition-all ${chaosIntensity === 'brutal' || isBrutal ? 'bg-red-950/80 border-red-500 text-red-200 font-black shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse' : 'bg-black/40 border-red-900/40 text-red-400/60 hover:text-red-300'}`}
                  >
                    💀 Brutal (5s)
                  </button>
                </div>
              </div>

              {/* Brutal Mode Banner & Quick Toggle */}
              <div className={`p-3 rounded-xl border transition-all ${isBrutal ? 'bg-red-950/30 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'bg-white/5 border-white/10'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isBrutal ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-white/10 text-white/50'}`}>
                      <Skull className={`w-4 h-4 ${isBrutal ? 'animate-bounce' : ''}`} />
                    </div>
                    <div>
                      <span className={`text-xs font-black uppercase tracking-wider block ${isBrutal ? 'text-red-400' : 'text-white/80'}`}>
                        {isBrutal ? '💀 BRUTAL MODE ENGAGED' : 'Brutal Mode (Ruthless Hecklers)'}
                      </span>
                      <span className="text-[9px] font-mono text-white/50 block">
                        {isBrutal ? 'Ruthless 3AM cellar disruptions • Extreme XP (180-250) • Composure Meltdown at 0%' : 'Toggle high-stakes hostility with catastrophic composure penalties'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const next = !isBrutal;
                      setIsBrutal(next);
                      if (next) {
                        setChaosIntensity('brutal');
                        setRandomIntervalSec(5);
                        playBrutalModeIntroSfx();
                      } else {
                        setChaosIntensity('standard');
                        setRandomIntervalSec(18);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition-all flex items-center gap-1.5 ${
                      isBrutal
                        ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.6)]'
                        : 'bg-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    <span>{isBrutal ? 'ACTIVE' : 'ACTIVATE'}</span>
                  </button>
                </div>
              </div>

              {/* Random Jitter Variance Toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[10px] font-mono">
                <span className="text-white/70">Random Timing Jitter (±30% variance)</span>
                <input
                  type="checkbox"
                  checked={randomJitter}
                  onChange={(e) => setRandomJitter(e.target.checked)}
                  className="w-4 h-4 accent-purple-500 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Last Generated AI Heckle Inspector (if exists) */}
            {lastAiHeckle && (
              <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-2 text-left">
                <div className="flex items-center justify-between text-[9px] font-mono">
                  <span className="text-purple-300 uppercase flex items-center gap-1 font-bold">
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    Latest Generated Heckle & Retort
                  </span>
                  <span className="text-white/40">
                    {lastAiHeckle.hecklerPersona || 'Audience Member'}
                  </span>
                </div>

                <div className="p-2.5 rounded bg-black/50 border border-white/10 space-y-1 font-mono">
                  <p className="text-xs text-red-300 italic">
                    "{lastAiHeckle.phrase}"
                  </p>
                  <p className="text-xs text-emerald-300">
                    <strong>Dragon 9:</strong> "{lastAiHeckle.performerRoast}"
                  </p>
                </div>

                {lastAiHeckle.comedyTheoryTakeaway && (
                  <div className="text-[10px] font-mono text-white/60 flex items-center gap-1.5">
                    <Award className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>Comedy Theory: <span className="text-white">{lastAiHeckle.comedyTheoryTakeaway}</span></span>
                  </div>
                )}
              </div>
            )}

            {/* Allowed Disruption Categories */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2">
              <h4 className="text-[10px] font-mono uppercase tracking-wider text-white/70">
                Active Category Filters
              </h4>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                <label className="flex items-center gap-2 p-2 rounded bg-white/5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={categoryWeights.audio}
                    onChange={(e) => setCategoryWeights(prev => ({ ...prev, audio: e.target.checked }))}
                    className="accent-red-500 rounded"
                  />
                  <span>🗣️ Audio Shouts & Banter</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded bg-white/5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={categoryWeights.projectile}
                    onChange={(e) => setCategoryWeights(prev => ({ ...prev, projectile: e.target.checked }))}
                    className="accent-red-500 rounded"
                  />
                  <span>🍅 Projectiles (Tomatoes/Planes)</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded bg-white/5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={categoryWeights.disruption}
                    onChange={(e) => setCategoryWeights(prev => ({ ...prev, disruption: e.target.checked }))}
                    className="accent-red-500 rounded"
                  />
                  <span>📱 Tech Glitches & Lasers</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded bg-white/5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={categoryWeights.crowd}
                    onChange={(e) => setCategoryWeights(prev => ({ ...prev, crowd: e.target.checked }))}
                    className="accent-red-500 rounded"
                  />
                  <span>🦗 Awkward Crickets & Boos</span>
                </label>
              </div>
            </div>

            {/* Audio/Visual Engine Options */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2">
              <h4 className="text-[10px] font-mono uppercase tracking-wider text-white/70">
                Audio-Visual Feedback Systems
              </h4>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                <label className="flex items-center gap-2 p-2 rounded bg-white/5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableVoiceSynth}
                    onChange={(e) => setEnableVoiceSynth(e.target.checked)}
                    className="accent-cyan-500 rounded"
                  />
                  <span>🎙️ Web Speech Voices</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded bg-white/5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableSfx}
                    onChange={(e) => setEnableSfx(e.target.checked)}
                    className="accent-cyan-500 rounded"
                  />
                  <span>🔊 Procedural Web Audio SFX</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded bg-white/5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableScreenGlitch}
                    onChange={(e) => setEnableScreenGlitch(e.target.checked)}
                    className="accent-purple-500 rounded"
                  />
                  <span>⚡ Chromatic Screen Glitch</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded bg-white/5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableProjectiles}
                    onChange={(e) => setEnableProjectiles(e.target.checked)}
                    className="accent-purple-500 rounded"
                  />
                  <span>🎯 Flying Projectile Physics</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* --- 3. CUSTOM INJECTOR TAB --- */}
        {activeSubTab === 'custom' && (
          <form onSubmit={handleCustomSubmit} className="space-y-3.5 p-4 rounded-xl bg-black/60 border border-purple-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-black uppercase text-purple-300 tracking-wider">
                  Live Custom Heckle Injector
                </h3>
              </div>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Text-to-Speech + Retort
              </span>
            </div>

            <p className="text-[11px] text-white/60 font-light">
              Type any impromptu question, investor challenge, or heckle comment to trigger instant speech synthesis and Super Puff comeback.
            </p>

            {/* Input textarea */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-white/70 uppercase">
                Audience Phrase / Comment:
              </label>
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="e.g. 'Show us your blockchain tokenomics!' or 'Get off the stage, mate!'"
                rows={3}
                className="w-full bg-black/80 border border-white/20 rounded-xl p-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-purple-400 font-mono"
              />
            </div>

            {/* Voice Accent & Delay Selectors */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-white/70 uppercase">Voice Persona:</label>
                <select
                  value={customVoice}
                  onChange={(e: any) => setCustomVoice(e.target.value)}
                  className="w-full bg-black/80 border border-white/20 rounded-lg p-2 text-xs text-white font-mono focus:outline-none focus:border-purple-400"
                >
                  {speech.allPersonas.map((persona) => (
                    <option key={persona.id} value={persona.id}>
                      {persona.avatar} {persona.name} — {persona.tagline}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-white/70 uppercase">Schedule Delay:</label>
                <select
                  value={customDelaySec}
                  onChange={(e) => setCustomDelaySec(Number(e.target.value))}
                  className="w-full bg-black/80 border border-white/20 rounded-lg p-2 text-xs text-white font-mono focus:outline-none focus:border-purple-400"
                >
                  <option value={0}>⚡ Instant Trigger (0s)</option>
                  <option value={3}>⏱️ 3 Seconds</option>
                  <option value={5}>⏱️ 5 Seconds</option>
                  <option value={10}>⏱️ 10 Seconds</option>
                  <option value={20}>⏱️ 20 Seconds</option>
                </select>
              </div>
            </div>

            {/* Submit Inject Button */}
            <button
              type="submit"
              disabled={!customText.trim() || isInjecting}
              className="w-full py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/50 text-purple-200 text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isInjecting ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5 text-purple-400" />
              )}
              <span>{customDelaySec === 0 ? 'Inject Heckle Now' : `Enqueue Heckle (+${customDelaySec}s)`}</span>
            </button>
          </form>
        )}

        {/* --- 4. QUEUE TAB --- */}
        {activeSubTab === 'queue' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-white/10">
              <span className="text-[10px] font-mono uppercase text-white/60">
                Scheduled & Active Disruptions ({queueList.length})
              </span>
              {queueList.length > 0 && (
                <button
                  onClick={() => setDisruptionQueue(new Map())}
                  className="text-[9px] font-mono text-red-400 hover:text-red-300 uppercase underline"
                >
                  Clear All Queue
                </button>
              )}
            </div>

            {queueList.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-black/40 border border-white/5 space-y-2">
                <Clock className="w-6 h-6 text-white/20 mx-auto" />
                <p className="text-xs text-white/50 font-mono">
                  No disruptions currently queued.
                </p>
                <p className="text-[10px] text-white/30 font-mono">
                  Use the Soundboard or Custom Injector to schedule timing interruptions.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {queueList.map(item => {
                  const remainingSec = Math.max(0, Math.ceil((item.scheduledTime - Date.now()) / 1000));

                  return (
                    <div
                      key={item.id}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                        item.status === 'active'
                          ? 'bg-red-950/40 border-red-500 animate-pulse'
                          : 'bg-black/50 border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">{item.preset.icon}</span>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>{item.customText || item.preset.label}</span>
                            <span className={`text-[8px] font-mono px-1.5 py-0.2 rounded uppercase ${
                              item.status === 'active' ? 'bg-red-500 text-white' : 'bg-white/10 text-white/60'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                          <div className="text-[9px] font-mono text-white/40">
                            {item.status === 'queued' ? `Fires in ${remainingSec}s` : 'Playing live on stage'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {item.status === 'queued' && (
                          <button
                            onClick={() => executeDisruption(item)}
                            className="px-2 py-1 rounded bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 text-[9px] font-mono uppercase"
                          >
                            Trigger Now
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setDisruptionQueue(prev => {
                              const next = new Map(prev);
                              next.delete(item.id);
                              return next;
                            });
                          }}
                          className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/50 hover:text-white"
                          title="Dismiss item"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* --- 5. TELEMETRY & EVENT LOGS TAB --- */}
        {activeSubTab === 'telemetry' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-white/10">
              <span className="text-[10px] font-mono uppercase text-white/60">
                Live Disruption & Comeback Audit Log
              </span>
              <span className="text-[9px] font-mono text-emerald-400">
                {recentLogs.length} Events Recorded
              </span>
            </div>

            <div className="space-y-2.5">
              {recentLogs.map((log, idx) => (
                <div
                  key={log.id || idx}
                  className="p-3 rounded-xl bg-black/50 border border-white/10 space-y-1.5 text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono text-white/40">
                      {log.timestamp} • <strong className="text-red-400 uppercase">{log.category}</strong>
                    </span>
                    <span className="text-[9px] font-mono text-emerald-400 font-bold">
                      +{log.xp} XP
                    </span>
                  </div>

                  <div className="text-xs font-mono text-white/90">
                    <strong className="text-red-400">Heckle:</strong> {log.heckle}
                  </div>

                  <div className="text-xs font-mono text-amber-300 pl-2 border-l-2 border-amber-500/40">
                    <strong className="text-amber-400">Comeback:</strong> "{log.roast}"
                  </div>

                  <div className="text-[9px] font-mono text-white/50 pt-1 border-t border-white/5">
                    <span className="text-white/70">Theory:</span> {log.theory}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Heckler;
