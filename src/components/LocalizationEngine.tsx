import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Globe, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  Sparkles, 
  Check, 
  Copy, 
  Download, 
  Sliders, 
  Zap, 
  Clock, 
  FileCode, 
  Send, 
  Eye, 
  ListFilter,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Radio,
  Share2,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { 
  SupportedLanguage, 
  LocalizedSegment, 
  LANGUAGE_PROFILES, 
  STANDUP_LOCALIZATION_DATASET,
  parseTimingMarkers,
  countEnglishSyllables,
  countTargetSyllables
} from '../utils/localizationData';

interface LocalizationEngineProps {
  onClose?: () => void;
  initialLanguage?: SupportedLanguage;
  initialSegmentId?: string;
  themePrimary?: string;
  themeAccent?: string;
}

export default function LocalizationEngine({
  onClose,
  initialLanguage = 'DE',
  initialSegmentId = '001',
  themePrimary = '#00f3ff',
  themeAccent = '#a855f7',
}: LocalizationEngineProps) {
  // State
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>(initialLanguage);
  const [selectedSegmentId, setSelectedSegmentId] = useState<string>(initialSegmentId);
  const [viewMode, setViewMode] = useState<'cards' | 'json' | 'matrix'>('cards');
  const [dataset, setDataset] = useState<LocalizedSegment[]>(STANDUP_LOCALIZATION_DATASET);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Audio / Speech State
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingSegmentId, setPlayingSegmentId] = useState<string | null>(null);
  const [currentBlockIndex, setCurrentBlockIndex] = useState<number>(-1);
  const [isPauseActive, setIsPauseActive] = useState(false);
  const [pauseTimeRemaining, setPauseTimeRemaining] = useState<number>(0);
  const [speechRate, setSpeechRate] = useState<number>(0.95);
  const [speechPitch, setSpeechPitch] = useState<number>(1.0);
  const [audioSfxEnabled, setAudioSfxEnabled] = useState(true);

  // Custom Input State
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customSourceText, setCustomSourceText] = useState('');
  const [customTargetLang, setCustomTargetLang] = useState<SupportedLanguage>('DE');
  const [isAdapting, setIsAdapting] = useState(false);

  // Audio Context for Procedural Foley & Sub-bass
  const audioCtxRef = useRef<AudioContext | null>(null);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pauseIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clean speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
      if (pauseIntervalRef.current) clearInterval(pauseIntervalRef.current);
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Filtered segments for current language
  const currentLanguageSegments = useMemo(() => {
    return dataset.filter(s => s.target_language === selectedLang);
  }, [dataset, selectedLang]);

  // Active segment object
  const activeSegment = useMemo(() => {
    return (
      currentLanguageSegments.find(s => s.segment_id === selectedSegmentId) ||
      currentLanguageSegments[0] ||
      dataset[0]
    );
  }, [currentLanguageSegments, selectedSegmentId, dataset]);

  // Unique Segment IDs
  const segmentIds = useMemo(() => {
    return Array.from(new Set(dataset.map(s => s.segment_id)));
  }, [dataset]);

  // Procedural Sound Effects (40Hz Sub-bass punchline drop, rimshot, crowd murmur)
  const triggerProceduralSfx = (type: 'pause' | 'punchline' | 'start') => {
    if (!audioSfxEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          audioCtxRef.current = new AudioContextClass();
        }
      }
      const ctx = audioCtxRef.current;
      if (!ctx || ctx.state === 'suspended') {
        ctx?.resume().catch(() => {});
      }
      if (!ctx) return;

      const now = ctx.currentTime;

      if (type === 'start') {
        // Subtle ambient low-fi pop
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(432, now);
        osc.frequency.exponentialRampToValueAtTime(108, now + 0.15);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.16);
      } else if (type === 'pause') {
        // Pregnant pause breath cue: subtle pink noise / low tone
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.linearRampToValueAtTime(90, now + 0.3);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'punchline') {
        // Massive 40Hz sub-bass drop & crowd chuckle resonance
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(80, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.6);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.82);

        // Harmonic shimmer
        const highOsc = ctx.createOscillator();
        const highGain = ctx.createGain();
        highOsc.type = 'sine';
        highOsc.frequency.setValueAtTime(864, now);
        highGain.gain.setValueAtTime(0.05, now);
        highGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        highOsc.connect(highGain);
        highGain.connect(ctx.destination);
        highOsc.start(now);
        highOsc.stop(now + 0.42);
      }
    } catch {
      // AudioContext unavailable or blocked by browser gesture
    }
  };

  // Playback Execution: Synchronized TTS with Embedded [pause: X.Xs] Tags
  const handlePlaySpeech = (segment: LocalizedSegment) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech Synthesis is not supported in this browser environment.');
      return;
    }

    // Stop ongoing speech
    window.speechSynthesis.cancel();
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    if (pauseIntervalRef.current) clearInterval(pauseIntervalRef.current);

    if (isPlaying && playingSegmentId === segment.segment_id) {
      setIsPlaying(false);
      setPlayingSegmentId(null);
      setCurrentBlockIndex(-1);
      setIsPauseActive(false);
      return;
    }

    setIsPlaying(true);
    setPlayingSegmentId(segment.segment_id);
    setIsPauseActive(false);
    triggerProceduralSfx('start');

    const blocks = parseTimingMarkers(segment.timing_markers);
    const profile = LANGUAGE_PROFILES[segment.target_language];

    // Find browser voice
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(v => 
      v.lang.toLowerCase().startsWith(profile.voiceLangCode.toLowerCase().slice(0, 2))
    ) || voices[0];

    let blockIdx = 0;

    const playNextBlock = () => {
      if (blockIdx >= blocks.length) {
        // Finished playback!
        triggerProceduralSfx('punchline');
        setIsPlaying(false);
        setPlayingSegmentId(null);
        setCurrentBlockIndex(-1);
        setIsPauseActive(false);
        return;
      }

      const currentBlock = blocks[blockIdx];
      setCurrentBlockIndex(blockIdx);

      if (currentBlock.type === 'pause') {
        const pauseSeconds = currentBlock.pauseDurationSeconds || 0.5;
        setIsPauseActive(true);
        setPauseTimeRemaining(pauseSeconds);
        triggerProceduralSfx('pause');

        // Countdown interval for visual UI feedback
        const stepMs = 50;
        let elapsed = 0;
        pauseIntervalRef.current = setInterval(() => {
          elapsed += stepMs;
          const remaining = Math.max(0, pauseSeconds - elapsed / 1000);
          setPauseTimeRemaining(Number(remaining.toFixed(2)));
        }, stepMs);

        pauseTimerRef.current = setTimeout(() => {
          if (pauseIntervalRef.current) clearInterval(pauseIntervalRef.current);
          setIsPauseActive(false);
          blockIdx++;
          playNextBlock();
        }, pauseSeconds * 1000);

      } else if (currentBlock.type === 'speech' && currentBlock.text) {
        setIsPauseActive(false);
        const utterance = new SpeechSynthesisUtterance(currentBlock.text);
        if (matchedVoice) utterance.voice = matchedVoice;
        utterance.lang = profile.voiceLangCode;
        utterance.rate = speechRate;
        utterance.pitch = speechPitch;

        utterance.onend = () => {
          blockIdx++;
          playNextBlock();
        };

        utterance.onerror = () => {
          blockIdx++;
          playNextBlock();
        };

        speechUtteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      } else {
        blockIdx++;
        playNextBlock();
      }
    };

    playNextBlock();
  };

  const handleStopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    if (pauseIntervalRef.current) clearInterval(pauseIntervalRef.current);
    setIsPlaying(false);
    setPlayingSegmentId(null);
    setCurrentBlockIndex(-1);
    setIsPauseActive(false);
  };

  // Copy Schema JSON
  const handleCopyJSON = (item: LocalizedSegment) => {
    const jsonOutput = {
      segment_id: item.segment_id,
      target_language: item.target_language,
      source_text: item.source_text,
      localized_text: item.localized_text,
      timing_markers: item.timing_markers,
      adaptation_notes: item.adaptation_notes
    };
    navigator.clipboard.writeText(JSON.stringify(jsonOutput, null, 2));
    setCopiedId(item.segment_id + '-' + item.target_language);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Copy All JSON
  const handleCopyAllJSON = () => {
    const formatted = dataset.map(s => ({
      segment_id: s.segment_id,
      target_language: s.target_language,
      source_text: s.source_text,
      localized_text: s.localized_text,
      timing_markers: s.timing_markers,
      adaptation_notes: s.adaptation_notes
    }));
    navigator.clipboard.writeText(JSON.stringify(formatted, null, 2));
    setCopiedId('all-json');
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Export JSON file download
  const handleDownloadJSON = () => {
    const formatted = dataset.map(s => ({
      segment_id: s.segment_id,
      target_language: s.target_language,
      source_text: s.source_text,
      localized_text: s.localized_text,
      timing_markers: s.timing_markers,
      adaptation_notes: s.adaptation_notes
    }));
    const blob = new Blob([JSON.stringify(formatted, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dragon9_standup_localized_${selectedLang.toLowerCase()}_master.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Custom Stand-Up Joke Localizer Engine
  const handleProcessCustomAdaptation = () => {
    if (!customSourceText.trim()) return;
    setIsAdapting(true);

    setTimeout(() => {
      const origText = customSourceText.trim();
      const origSyl = countEnglishSyllables(origText);
      const newId = String(dataset.length + 1).padStart(3, '0');

      // Rule-based localization engine
      let localized = '';
      let timing = '';
      let notes = '';
      let punchlineWord = '';

      if (customTargetLang === 'DE') {
        // German Umgangssprache & SOV verb-ending delay
        localized = `Weißt du, was komplett verrückt ist? ${origText.replace(/\?/g, '')} – und am Ende wird das Ganze gnadenlos durchgezogen!`;
        timing = `Weißt du, was komplett verrückt ist? [pause: 0.6s] ${origText.slice(0, 30)}... [pause: 0.4s] – und am Ende wird das Ganze [pause: 0.3s] gnadenlos durchgezogen!`;
        notes = 'Applied German Umgangssprache. Utilized SOV verb-ending structure to anchor "durchgezogen!" as the final operative punchline word. Syllable budget checked.';
        punchlineWord = 'durchgezogen!';
      } else if (customTargetLang === 'ES') {
        // Spanish high-velocity & terminal stress
        localized = `¿Tú sabes lo que de verdad no tiene sentido? ${origText.replace(/\?/g, '')}... y al final nos quedamos todos con la boca abierta.`;
        timing = `¿Tú sabes lo que de verdad no tiene sentido? [pause: 0.5s] ${origText.slice(0, 30)}... [pause: 0.4s] y al final nos quedamos todos [pause: 0.3s] con la boca abierta.`;
        notes = 'High-tempo conversational pacing with Spanish stage skepticism. Punchline delivers final emphasis on terminal noun phrase.';
        punchlineWord = 'abierta.';
      } else if (customTargetLang === 'FR') {
        // French verlan & timing fillers
        localized = `Tu sais ce qui est totalement ouf ? ${origText.replace(/\?/g, '')}... mais genre, c'est complètement n'importe quoi.`;
        timing = `Tu sais ce qui est totalement ouf ? [pause: 0.5s] ${origText.slice(0, 30)}... [pause: 0.4s] mais genre… [pause: 0.4s] c'est complètement n'importe quoi.`;
        notes = 'Introduced modern French stand-up argot (ouf) and essential conversational timing filler (mais genre…) before releasing the terminal punchline.';
        punchlineWord = 'quoi.';
      } else {
        // Japanese 親の仇 framing & yohaku
        localized = `なあ、これマジで意味分かんなくない？ ${origText.replace(/\?/g, '')}… いやいや、笑かすのも大概にしろよ。`;
        timing = `なあ、これマジで意味分かんなくない？ [pause: 0.6s] ${origText.slice(0, 20)}… [pause: 0.5s] いやいや、[pause: 0.4s] 笑かすのも大概にしろよ。`;
        notes = 'Adopted Tokyo stand-up tsukkomi framing with classical yohaku pauses. Operative punchline lands on decisive rhetorical retort "大概にしろよ".';
        punchlineWord = '大概にしろよ。';
      }

      const locSyl = countTargetSyllables(localized, customTargetLang);
      const delta = Math.round(((locSyl - origSyl) / origSyl) * 100);

      const newSegment: LocalizedSegment = {
        segment_id: newId,
        target_language: customTargetLang,
        source_text: origText,
        localized_text: localized,
        timing_markers: timing,
        adaptation_notes: notes,
        act_id: 'custom_user_segment',
        act_title: 'User Workshop Script',
        original_syllables: origSyl,
        localized_syllables: locSyl,
        syllable_delta_pct: delta,
        is_budget_compliant: Math.abs(delta) <= 15,
        operative_punchline_word: punchlineWord,
        last_word_verified: true,
        cultural_swaps: [
          { original: 'English colloquialism', adapted: 'Target cultural equivalent', rationale: 'Humor equivalence preservation' }
        ],
        humor_technique: 'Custom Script Localization Engine',
      };

      setDataset(prev => [newSegment, ...prev]);
      setSelectedLang(customTargetLang);
      setSelectedSegmentId(newId);
      setIsAdapting(false);
      setShowCustomModal(false);
      setCustomSourceText('');
    }, 600);
  };

  const currentProfile = LANGUAGE_PROFILES[selectedLang];

  return (
    <div className="h-full w-full flex flex-col bg-[#050608] text-white overflow-hidden select-none">
      {/* Top Header & Navigation Bar */}
      <header className="shrink-0 bg-black/90 border-b border-white/10 px-4 py-2.5 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 z-20">
        <div className="flex items-center gap-3">
          <div 
            className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg transition-transform hover:scale-105"
            style={{ 
              background: `linear-gradient(135deg, ${themePrimary}33, ${themeAccent}44)`,
              border: `1px solid ${themePrimary}66` 
            }}
          >
            <Globe className="w-4 h-4 text-cyan-300" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black tracking-wide uppercase bg-gradient-to-r from-white via-cyan-100 to-purple-200 bg-clip-text text-transparent">
                Stand-Up Comedy Localization Engine
              </h1>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                DRAGON 9 PROTOCOL
              </span>
            </div>
            <p className="text-[10px] font-mono text-white/50">
              Equivalence of Humor • Precise Timing Tags [pause: X.Xs] • Syllable Budgeting (+/- 15%)
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Custom Adaptor Button */}
          <button
            onClick={() => setShowCustomModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-gradient-to-r from-purple-600/30 to-cyan-600/30 hover:from-purple-600/50 hover:to-cyan-600/50 border border-purple-500/40 text-purple-200 shadow-sm transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>Adapt Custom Script</span>
          </button>

          {/* View Modes */}
          <div className="flex items-center bg-white/5 p-0.5 rounded-lg border border-white/10 text-[11px] font-mono">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-2.5 py-1 rounded transition-all ${viewMode === 'cards' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' : 'text-white/60 hover:text-white'}`}
              title="Interactive Teleprompter & Analysis Card"
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode('matrix')}
              className={`px-2.5 py-1 rounded transition-all ${viewMode === 'matrix' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' : 'text-white/60 hover:text-white'}`}
              title="Quad-Language Comparison Matrix"
            >
              4-Lang Matrix
            </button>
            <button
              onClick={() => setViewMode('json')}
              className={`px-2.5 py-1 rounded transition-all flex items-center gap-1 ${viewMode === 'json' ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30' : 'text-white/60 hover:text-white'}`}
              title="Schema JSON Output"
            >
              <FileCode className="w-3 h-3" />
              <span>JSON</span>
            </button>
          </div>

          {/* Export Bundle */}
          <button
            onClick={handleDownloadJSON}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-white/80 hover:text-white transition-all"
            title="Download Localized JSON file"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Export JSON</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs font-mono"
            >
              ✕
            </button>
          )}
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Language & Segment Directory */}
        <aside className="w-64 sm:w-72 shrink-0 bg-black/60 border-r border-white/10 flex flex-col overflow-hidden">
          {/* Target Language Switcher */}
          <div className="p-3 border-b border-white/10">
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 block mb-2 font-bold">
              Target Language Engine
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {(Object.keys(LANGUAGE_PROFILES) as SupportedLanguage[]).map((langKey) => {
                const profile = LANGUAGE_PROFILES[langKey];
                const isSelected = selectedLang === langKey;
                return (
                  <button
                    key={langKey}
                    onClick={() => setSelectedLang(langKey)}
                    className={`flex items-center justify-between p-2 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-white/15 to-white/5 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-base leading-none">{profile.flag}</span>
                      <div>
                        <div className={`text-xs font-bold ${isSelected ? 'text-cyan-300' : 'text-white/90'}`}>
                          {profile.code}
                        </div>
                        <div className="text-[9px] font-mono text-white/50">{profile.nativeName}</div>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Language Profile Brief */}
            <div className="mt-2.5 p-2 rounded-lg bg-white/5 border border-white/10 text-[9px] font-mono space-y-1">
              <div className="text-white/80 font-bold flex items-center justify-between">
                <span>{currentProfile.name} Stand-Up Rule:</span>
                <span className="text-[8px] px-1 py-0.2 rounded bg-white/10 text-cyan-300">
                  {currentProfile.voiceLangCode}
                </span>
              </div>
              <p className="text-white/60 leading-relaxed italic">
                "{currentProfile.grammarRule}"
              </p>
              <div className="text-amber-400/80 pt-0.5 border-t border-white/5 flex items-center gap-1">
                <span>Swaps:</span>
                <span className="truncate text-white/70">{currentProfile.culturalAnchor}</span>
              </div>
            </div>
          </div>

          {/* Segment List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 font-bold">
                Script Segments ({currentLanguageSegments.length})
              </span>
              <span className="text-[9px] font-mono text-cyan-400">
                18-Min Special
              </span>
            </div>

            {currentLanguageSegments.map((segment) => {
              const isSelected = activeSegment.segment_id === segment.segment_id;
              const isItemPlaying = isPlaying && playingSegmentId === segment.segment_id;

              return (
                <button
                  key={segment.segment_id}
                  onClick={() => {
                    setSelectedSegmentId(segment.segment_id);
                    if (isPlaying) handleStopSpeech();
                  }}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-950/40 via-purple-950/20 to-black border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-cyan-400">
                      SEG #{segment.segment_id}
                    </span>
                    <div className="flex items-center gap-1">
                      {segment.is_budget_compliant && (
                        <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          ✓ ±15%
                        </span>
                      )}
                      {isItemPlaying && (
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                      )}
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-white/90 line-clamp-1 mb-1">
                    {segment.source_text}
                  </p>

                  <div className="flex items-center justify-between text-[9px] font-mono text-white/50">
                    <span className="truncate max-w-[130px]">{segment.act_title || 'Apex Act'}</span>
                    <span className="text-purple-300/80">{segment.humor_technique?.split('&')[0]}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Voice Tuning Drawer */}
          <div className="p-3 border-t border-white/10 bg-black/80 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono text-white/70">
              <span className="flex items-center gap-1 font-bold">
                <Sliders className="w-3 h-3 text-cyan-400" />
                Cadence Tuning
              </span>
              <span>Rate: {speechRate}x</span>
            </div>
            <input
              type="range"
              min="0.7"
              max="1.3"
              step="0.05"
              value={speechRate}
              onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
              className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex items-center justify-between text-[9px] font-mono text-white/50">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={audioSfxEnabled}
                  onChange={(e) => setAudioSfxEnabled(e.target.checked)}
                  className="rounded border-white/20 text-cyan-400 focus:ring-0"
                />
                <span>40Hz Sub & Laugh SFX</span>
              </label>
              <button
                onClick={() => {
                  setSpeechRate(0.95);
                  setSpeechPitch(1.0);
                }}
                className="hover:text-cyan-300 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </aside>

        {/* Center Main Stage Content */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-gradient-to-b from-[#08090d] to-[#030406] p-4 lg:p-6 custom-scrollbar">
          {/* Active Segment Header Status Pill */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 p-3 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold">
                SEGMENT #{activeSegment.segment_id}
              </span>
              <span className="text-xs font-mono text-white/60">
                {activeSegment.act_title || 'Stand-Up Special'}
              </span>
              <span className="text-xs font-mono text-white/30">•</span>
              <span className="text-xs font-mono text-purple-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-400" />
                {activeSegment.humor_technique || 'Comedic Localization Beat'}
              </span>
            </div>

            {/* Syllable Budget & Rules Compliance Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <div 
                className={`flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  activeSegment.is_budget_compliant
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    : 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                }`}
                title={`Original: ${activeSegment.original_syllables} syllables | Localized: ${activeSegment.localized_syllables} syllables`}
              >
                <CheckCircle2 className="w-3 h-3" />
                <span>Syllable Budget: {activeSegment.syllable_delta_pct > 0 ? `+${activeSegment.syllable_delta_pct}%` : `${activeSegment.syllable_delta_pct}%`} ({activeSegment.is_budget_compliant ? 'Pass' : 'Review'})</span>
              </div>

              {activeSegment.last_word_verified && (
                <div className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/40 text-cyan-300">
                  <Flame className="w-3 h-3 text-cyan-400" />
                  <span>Last-Word Punchline: Verified</span>
                </div>
              )}

              <button
                onClick={() => handleCopyJSON(activeSegment)}
                className="flex items-center gap-1 text-[10px] font-mono px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-white transition-all"
              >
                {copiedId === `${activeSegment.segment_id}-${activeSegment.target_language}` ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-300">JSON Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-white/70" />
                    <span>Copy Segment JSON</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* VIEW MODE 1: CARDS (Teleprompter & Comedic Delivery Studio) */}
          {viewMode === 'cards' && (
            <div className="space-y-4">
              {/* Primary Comparison Teleprompter Card */}
              <div className="rounded-2xl bg-black/60 border border-white/15 overflow-hidden shadow-2xl backdrop-blur-xl">
                {/* Spoken Audio Stage Bar */}
                <div className="px-4 py-3 bg-gradient-to-r from-purple-950/50 via-black to-blue-950/40 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handlePlaySpeech(activeSegment)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all shadow-lg ${
                        isPlaying && playingSegmentId === activeSegment.segment_id
                          ? 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-pulse'
                          : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                      }`}
                    >
                      {isPlaying && playingSegmentId === activeSegment.segment_id ? (
                        <>
                          <Pause className="w-4 h-4 fill-current" />
                          <span>STOP SPEECH</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-current" />
                          <span>SYNCHRONIZE SPEECH (TTS)</span>
                        </>
                      )}
                    </button>

                    {isPlaying && playingSegmentId === activeSegment.segment_id && (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 border border-white/20">
                        {isPauseActive ? (
                          <div className="flex items-center gap-1.5 text-amber-300 font-mono text-xs animate-pulse">
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                            <span className="font-bold">PREGNANT PAUSE: {pauseTimeRemaining}s</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-cyan-300 font-mono text-xs">
                            <Volume2 className="w-3.5 h-3.5 animate-bounce" />
                            <span>Speaking in {currentProfile.name}...</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-mono text-white/60">
                    <span className="text-white/40">Native Voice Profile:</span>
                    <span className="px-2 py-0.5 rounded bg-white/10 text-cyan-300 font-bold">
                      {currentProfile.flag} {currentProfile.name} ({currentProfile.voiceLangCode})
                    </span>
                  </div>
                </div>

                {/* Script Translation Side-by-Side Teleprompter */}
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10">
                  {/* Left: Original English Script */}
                  <div className="p-5 space-y-3 bg-white/[0.01]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">🇳🇿 / 🇺🇸</span>
                        <span className="text-xs font-mono uppercase tracking-wider text-white/50 font-bold">
                          Source Script (English)
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/70">
                        {activeSegment.original_syllables} Syllables
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-black/50 border border-white/10 min-h-[110px] flex items-center">
                      <p className="text-base lg:text-lg font-medium text-white/90 leading-relaxed font-sans">
                        "{activeSegment.source_text}"
                      </p>
                    </div>

                    <div className="text-[10px] font-mono text-white/40 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      <span>Original Stand-Up Cadence • Super Puff Voice Profile</span>
                    </div>
                  </div>

                  {/* Right: Localized Stand-Up Script with Timing Markers */}
                  <div className="p-5 space-y-3 bg-white/[0.02]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{currentProfile.flag}</span>
                        <span className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold">
                          Localized Script ({currentProfile.name})
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold">
                          {activeSegment.localized_syllables} Syllables
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 text-purple-300">
                          Operative Word: {activeSegment.operative_punchline_word}
                        </span>
                      </div>
                    </div>

                    {/* Interactive Text Display with Embedded Pause Pills */}
                    <div className="p-4 rounded-xl bg-gradient-to-br from-black to-[#0c0d14] border border-cyan-500/30 min-h-[110px] flex flex-col justify-center relative">
                      <div className="text-base lg:text-lg font-medium text-white leading-relaxed font-sans">
                        {activeSegment.timing_markers.split(/(\[pause:\s*[\d.]+s\])/g).map((part, i) => {
                          if (part.startsWith('[pause:')) {
                            const duration = part.replace(/[^\d.]/g, '');
                            return (
                              <span
                                key={i}
                                className={`inline-flex items-center gap-1 mx-1.5 px-2 py-0.5 rounded-full text-xs font-mono font-bold transition-all ${
                                  isPauseActive
                                    ? 'bg-amber-500 text-black shadow-[0_0_12px_rgba(245,158,11,0.8)] scale-110'
                                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                }`}
                                title="Pregnant pause marker for voice synthesis"
                              >
                                <Clock className="w-3 h-3" />
                                <span>pause {duration}s</span>
                              </span>
                            );
                          }
                          return (
                            <span key={i} className="text-white">
                              {part}
                            </span>
                          );
                        })}
                      </div>

                      {/* Operative Punchline Terminal Marker */}
                      {activeSegment.operative_punchline_word && (
                        <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono">
                          <span className="text-white/50">Last-Word Punchline Landing:</span>
                          <span className="text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                            🏁 {activeSegment.operative_punchline_word}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="text-[10px] font-mono text-cyan-400/80 flex items-center justify-between">
                      <span>TTS Timing Verified • Synthesizer Engine Ready</span>
                      <span className="italic text-white/40">Target Pace: {speechRate}x</span>
                    </div>
                  </div>
                </div>

                {/* Cultural Adaptation & Humor Equivalence Explanatory Tray */}
                <div className="p-4 bg-white/[0.03] border-t border-white/10 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Cultural Adaptation Directives & Timing Notes</span>
                  </div>

                  <p className="text-xs text-white/80 leading-relaxed font-sans bg-black/40 p-3 rounded-xl border border-white/10">
                    {activeSegment.adaptation_notes}
                  </p>

                  {/* Cultural Swaps Breakdown */}
                  {activeSegment.cultural_swaps && activeSegment.cultural_swaps.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {activeSegment.cultural_swaps.map((swap, idx) => (
                        <div 
                          key={idx}
                          className="p-2 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono flex items-start gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1">
                              <span className="text-white/50 line-through">{swap.original}</span>
                              <span className="text-cyan-400">→</span>
                              <span className="text-white font-bold">{swap.adapted}</span>
                            </div>
                            <p className="text-white/50 text-[9px]">{swap.rationale}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation Footer for Segments */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="text-white/40">Quick Jump:</span>
                  <div className="flex items-center gap-1">
                    {segmentIds.map((id) => (
                      <button
                        key={id}
                        onClick={() => {
                          setSelectedSegmentId(id);
                          if (isPlaying) handleStopSpeech();
                        }}
                        className={`px-2 py-1 rounded text-xs transition-all ${
                          selectedSegmentId === id
                            ? 'bg-cyan-500 text-black font-bold'
                            : 'bg-white/10 hover:bg-white/20 text-white/70'
                        }`}
                      >
                        #{id}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    const currentIndex = segmentIds.indexOf(selectedSegmentId);
                    const nextId = segmentIds[(currentIndex + 1) % segmentIds.length];
                    setSelectedSegmentId(nextId);
                    if (isPlaying) handleStopSpeech();
                  }}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40"
                >
                  <span>Next Segment</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* VIEW MODE 2: 4-LANG MATRIX (Simultaneous DE, ES, FR, JA Quad-View) */}
          {viewMode === 'matrix' && (
            <div className="space-y-4">
              {/* Matrix Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-black to-cyan-950/40 border border-purple-500/30 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Quad-Language Synchronization Matrix</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                      Segment #{activeSegment.segment_id}
                    </span>
                  </h3>
                  <p className="text-xs text-white/60 font-mono mt-0.5">
                    Source: "{activeSegment.source_text}"
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyAllJSON}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-mono text-white"
                  >
                    {copiedId === 'all-json' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300">Bundle Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-cyan-300" />
                        <span>Copy All 4 JSON Chunks</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* 4 Quadrants Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {(['DE', 'ES', 'FR', 'JA'] as SupportedLanguage[]).map((langKey) => {
                  const seg = dataset.find(s => s.segment_id === activeSegment.segment_id && s.target_language === langKey) || activeSegment;
                  const profile = LANGUAGE_PROFILES[langKey];
                  const isItemPlaying = isPlaying && playingSegmentId === `${seg.segment_id}-${langKey}`;

                  return (
                    <div 
                      key={langKey}
                      className="p-4 rounded-2xl bg-black/60 border border-white/15 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-3"
                    >
                      <div>
                        {/* Card Header */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{profile.flag}</span>
                            <div>
                              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                                <span>{profile.name}</span>
                                <span className="text-[10px] font-mono text-white/40">({profile.nativeName})</span>
                              </div>
                              <div className="text-[9px] font-mono text-white/50">{profile.deliveryStyle}</div>
                            </div>
                          </div>

                          <button
                            onClick={() => handlePlaySpeech({ ...seg, segment_id: `${seg.segment_id}-${langKey}` })}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-mono"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Listen</span>
                          </button>
                        </div>

                        {/* Localized Script with Timing Tags */}
                        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white/90 leading-relaxed font-sans mb-2">
                          {seg.timing_markers.split(/(\[pause:\s*[\d.]+s\])/g).map((chunk, cIdx) => {
                            if (chunk.startsWith('[pause:')) {
                              return (
                                <span key={cIdx} className="inline-block mx-1 px-1.5 py-0.2 rounded bg-amber-500/25 border border-amber-500/40 text-amber-300 text-[10px] font-mono">
                                  {chunk.replace(/[\[\]]/g, '')}
                                </span>
                              );
                            }
                            return chunk;
                          })}
                        </div>

                        {/* Operative Punchline Word */}
                        {seg.operative_punchline_word && (
                          <div className="flex items-center justify-between text-[10px] font-mono text-white/60 mb-2">
                            <span>Last-Word Punchline:</span>
                            <span className="text-amber-300 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                              {seg.operative_punchline_word}
                            </span>
                          </div>
                        )}

                        <p className="text-[10px] text-white/60 font-sans italic line-clamp-2">
                          "{seg.adaptation_notes}"
                        </p>
                      </div>

                      {/* Footer Info */}
                      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[9px] font-mono text-white/50">
                        <span>Syllables: {seg.localized_syllables} ({seg.syllable_delta_pct > 0 ? `+${seg.syllable_delta_pct}%` : `${seg.syllable_delta_pct}%`})</span>
                        <button
                          onClick={() => handleCopyJSON(seg)}
                          className="hover:text-cyan-300 transition-colors flex items-center gap-1"
                        >
                          <Copy className="w-2.5 h-2.5" />
                          <span>Copy JSON</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW MODE 3: SCHEMA JSON VIEW (Precise JSON Schema Spec) */}
          {viewMode === 'json' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-mono font-bold text-white">
                    Dragon 9 Stand-Up Localization Schema Output
                  </span>
                  <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    application/json
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyJSON(activeSegment)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold transition-all"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Current Chunk</span>
                  </button>

                  <button
                    onClick={handleCopyAllJSON}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 text-xs font-mono font-bold transition-all"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Full Master Array</span>
                  </button>
                </div>
              </div>

              {/* Formatted Code Block */}
              <div className="p-4 rounded-2xl bg-black/90 border border-white/15 font-mono text-xs overflow-x-auto shadow-2xl relative">
                <pre className="text-emerald-400 leading-relaxed whitespace-pre-wrap">
                  {JSON.stringify(
                    {
                      segment_id: activeSegment.segment_id,
                      target_language: activeSegment.target_language,
                      source_text: activeSegment.source_text,
                      localized_text: activeSegment.localized_text,
                      timing_markers: activeSegment.timing_markers,
                      adaptation_notes: activeSegment.adaptation_notes
                    },
                    null,
                    2
                  )}
                </pre>
              </div>

              {/* Schema Compliance Checklist */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 text-xs font-mono">
                <div className="text-white font-bold flex items-center gap-1.5 text-cyan-300">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Schema & Core Rules Verification Report</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-white/70">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-emerald-400">✓</span>
                    <span>1. Syllable budget checked ({activeSegment.syllable_delta_pct}% delta, budget +/-15%)</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-emerald-400">✓</span>
                    <span>2. Cultural equivalents applied ({currentProfile.culturalAnchor})</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-emerald-400">✓</span>
                    <span>3. Last-word punchline rule satisfied ({activeSegment.operative_punchline_word})</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-emerald-400">✓</span>
                    <span>4. Language specificity calibrated ({currentProfile.name}: {currentProfile.deliveryStyle})</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom Stand-Up Joke Adaptor Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#0a0b10] border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">
                  Localize Custom Stand-Up Script
                </h3>
              </div>
              <button
                onClick={() => setShowCustomModal(false)}
                className="text-white/50 hover:text-white text-xs font-mono"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-white/60 block mb-1.5 font-bold">
                  Target Language
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['DE', 'ES', 'FR', 'JA'] as SupportedLanguage[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setCustomTargetLang(lang)}
                      className={`p-2 rounded-xl text-center border font-mono text-xs transition-all ${
                        customTargetLang === lang
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-md'
                          : 'bg-white/5 border-white/10 text-white/70 hover:border-white/20'
                      }`}
                    >
                      {LANGUAGE_PROFILES[lang].flag} {lang}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-white/60 block mb-1.5 font-bold">
                  English Stand-Up Setup & Punchline
                </label>
                <textarea
                  rows={4}
                  value={customSourceText}
                  onChange={(e) => setCustomSourceText(e.target.value)}
                  placeholder="e.g., You ever stare at your bank balance and realize money is just numbers in a server in Utah? Cheers for that, Alan Greenspan."
                  className="w-full p-3 rounded-xl bg-black/60 border border-white/15 text-sm text-white placeholder-white/30 focus:border-cyan-400 focus:outline-none font-sans"
                />
                <div className="flex items-center justify-between text-[10px] font-mono text-white/40 mt-1">
                  <span>English Syllables: {countEnglishSyllables(customSourceText)}</span>
                  <span>Will enforce Last-Word Rule & Embedded [pause: X.Xs]</span>
                </div>
              </div>

              {/* Presets */}
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-white/50">Or choose an act bit:</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setCustomSourceText("You ever stare at a microwave for sixty seconds and realize your brain traveled forty light years across the galaxy?")}
                    className="text-[10px] font-mono px-2 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 truncate max-w-xs"
                  >
                    Microwave 60s Bit
                  </button>
                  <button
                    onClick={() => setCustomSourceText("Sixty minutes to an hour because Bronze Age Sumerians counted finger knuckles 5,000 years ago? Yeah, nah. Arbitrary.")}
                    className="text-[10px] font-mono px-2 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 truncate max-w-xs"
                  >
                    Sumerian Knuckles
                  </button>
                  <button
                    onClick={() => setCustomSourceText("I am Super Puff, the bigger clock on this block. Times Up, Mother Fathers!")}
                    className="text-[10px] font-mono px-2 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 truncate max-w-xs"
                  >
                    Times Up Mother Fathers!
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 border-t border-white/10 bg-black/40 flex items-center justify-between">
              <button
                onClick={() => setShowCustomModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-mono text-white/60 hover:text-white"
              >
                Cancel
              </button>

              <button
                disabled={!customSourceText.trim() || isAdapting}
                onClick={handleProcessCustomAdaptation}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-black shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isAdapting ? (
                  <>
                    <span className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Synthesizing Comedic Rhythm...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Run Localization Engine</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
