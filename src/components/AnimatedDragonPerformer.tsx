import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HeckleItem, playTheatricalModeTransitionSfx, playSuperPuffDropSfx, speakHeckle } from '../audio/hecklerAudio';
import { Flame, Sparkles, MessageSquare, Zap, Target, BookOpen, Award, Cannabis, GraduationCap, Mic, Coffee, Radio, Layers, Crown, Clock } from 'lucide-react';
import { PlasmaStageBackground } from './PlasmaStageBackground';

interface AnimatedDragonPerformerProps {
  isPlaying: boolean;
  activeHeckle: HeckleItem | null;
  roastDialogue: string | null;
  isRoasting: boolean;
  laserPos: { x: number; y: number } | null;
  hasTomatoSplat: boolean;
  onClearTomato: () => void;
  primaryColor?: string;
  accentColor?: string;
  comedyXp?: number;
  comedyRankTitle?: string;
  activeStrainName?: string;
  mode?: 'stage' | 'workshop';
  isTimingPeaked?: boolean;
  cameraAngle?: 'wide' | 'closeup' | 'crowd' | 'security';
  activeEmote?: 'eye_roll' | 'smirk' | 'shrug' | 'puff' | 'sweat' | 'mind_blown' | null;
  isBrutalMode?: boolean;
}

export default function AnimatedDragonPerformer({
  isPlaying,
  activeHeckle,
  roastDialogue,
  isRoasting,
  laserPos,
  hasTomatoSplat,
  onClearTomato,
  primaryColor = '#f97316',
  accentColor = '#fdba74',
  comedyXp = 450,
  comedyRankTitle = 'Timing Alchemist',
  activeStrainName = 'Cosmic OG (31.4% THC)',
  mode = 'stage',
  isTimingPeaked = false,
  cameraAngle = 'wide',
  activeEmote = null,
  isBrutalMode = false,
}: AnimatedDragonPerformerProps) {
  const [mouthOpen, setMouthOpen] = useState(false);
  const [blink, setBlink] = useState(false);
  const [swayOffset, setSwayOffset] = useState(0);
  const [studyThoughtIndex, setStudyThoughtIndex] = useState(0);
  const [showModeBanner, setShowModeBanner] = useState(false);
  const [isSuperPuffStoned, setIsSuperPuffStoned] = useState(true);
  const [showTimesUpBanner, setShowTimesUpBanner] = useState(false);
  const [cctvTime, setCctvTime] = useState('');
  const prevModeRef = useRef(mode);

  // D9Enigma Plasma Overload State & Listener
  const [isPlasmaOverloaded, setIsPlasmaOverloaded] = useState(false);
  const isPlasmaActive = isPlasmaOverloaded || isTimingPeaked || activeEmote === 'puff' || activeEmote === 'mind_blown';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      if (e.key.toLowerCase() === 'p') {
        setIsPlasmaOverloaded(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Synchronous ticking clock for security footage
  useEffect(() => {
    const updateClock = () => {
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      const ss = String(d.getSeconds()).padStart(2, '0');
      setCctvTime(`${hh}:${mm}:${ss}`);
    };
    updateClock();
    const t = setInterval(updateClock, 1000);
    return () => clearInterval(t);
  }, []);

  // Play audio and show flash banner whenever mode switches
  useEffect(() => {
    if (prevModeRef.current !== mode) {
      playTheatricalModeTransitionSfx(mode);
      setShowModeBanner(true);
      const timer = setTimeout(() => setShowModeBanner(false), 2400);
      prevModeRef.current = mode;
      return () => clearTimeout(timer);
    }
  }, [mode]);

  // Comedy study field thoughts rotating in Super Puff's mind (Bilingual Japanese/English + Origami/Bonsai)
  const STUDY_THOUGHTS = [
    '👑 SUPER PUFF MODE: "俺がこの街で一番デカい時計だ (I am the bigger clock on this block). Times Up, Mother Fathers!"',
    '🎋 BONSAI PRUNING: "盆栽のように無駄な言葉を剪定しろ" (Prune wasteful words like a bonsai). Clean deadwood, let the punchline breathe.',
    '🕊️ ORIGAMI GEOMETRY: "折り紙のように次元を畳む" (Fold multidimensional spacetime like washi paper). 3 crisp creases into a punchline.',
    '⚡ BILINGUAL SWAGGER: "お前ら、時間を舐めてるだろ？" (You lot take time for granted). Drop the 1.4s pause, then destroy the linear grid.',
    '🌿 TERPENE CONNOISSEUR: 3.2% Myrcene + Terpinolene. Keeping vocal pitch down in the 40Hz sub-bass velvet pocket.',
    '⏱️ TEMPORAL GEOMETRY: 54-minute fluid cycle > 60-minute Babylonian illusion. "時間切れだぜ、マザーファザーズ！"',
    '🕶️ COOL CONFIDENCE: Never rush the delivery for a heckler in flip-flops. Look through the smoke, smile in Japanese, mic drop.',
    '🎙️ KIWI-TOKYO HYBRID: "Aw mate, look at you. 顔見ろよ、完全にフリーズしてるぜ." Disarm with warmth, atomize with punchlines.',
  ];

  // Rotate study thought every 7 seconds when not actively roasting
  useEffect(() => {
    const thoughtInterval = setInterval(() => {
      setStudyThoughtIndex(prev => (prev + 1) % STUDY_THOUGHTS.length);
    }, 7000);
    return () => clearInterval(thoughtInterval);
  }, []);

  // Periodic blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 180);
    }, 3800);
    return () => clearInterval(blinkInterval);
  }, []);

  // Trigger "Times Up Mother Fathers" catchphrase drop manually
  const triggerTimesUpDrop = () => {
    playSuperPuffDropSfx();
    setShowTimesUpBanner(true);
    speakHeckle("俺がこの街で一番デカい時計だ。Times Up, Mother Fathers!", true, true);
    setTimeout(() => {
      setShowTimesUpBanner(false);
    }, 3200);
  };

  // Real-time audio-synced mouth movement matching speech synthesis and audio playback
  const [isSpeakingAudio, setIsSpeakingAudio] = useState(false);

  useEffect(() => {
    const handleSpeechActive = (e: any) => {
      setIsSpeakingAudio(!!e.detail?.speaking);
      if (!e.detail?.speaking) setMouthOpen(false);
    };

    const handleSpeechBoundary = () => {
      // Toggle mouth on phoneme/word boundaries for speech-synced flapping
      setMouthOpen(prev => !prev);
    };

    window.addEventListener('dragon-speech-active', handleSpeechActive as EventListener);
    window.addEventListener('dragon-speech-boundary', handleSpeechBoundary as EventListener);

    // Periodic poller to verify speechSynthesis.speaking state in case events are missed
    const pollInterval = setInterval(() => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        const speaking = window.speechSynthesis.speaking;
        setIsSpeakingAudio(speaking);
        if (!speaking && !isPlaying && !isRoasting) {
          setMouthOpen(false);
        }
      }
    }, 200);

    return () => {
      window.removeEventListener('dragon-speech-active', handleSpeechActive as EventListener);
      window.removeEventListener('dragon-speech-boundary', handleSpeechBoundary as EventListener);
      clearInterval(pollInterval);
    };
  }, []);

  // Speaking mouth movement loop when playing, roasting, or actively speaking via speech synthesis
  useEffect(() => {
    let speakInterval: any;
    if (isPlaying || isRoasting || isSpeakingAudio) {
      speakInterval = setInterval(() => {
        setMouthOpen(prev => !prev);
        setSwayOffset((Math.random() - 0.5) * 6);
      }, isSpeakingAudio ? 110 : 140); // Faster flap during live speech
    } else {
      setMouthOpen(false);
      setSwayOffset(0);
    }
    return () => clearInterval(speakInterval);
  }, [isPlaying, isRoasting, isSpeakingAudio]);

  // Determine dragon animation reaction pose
  const reaction = activeHeckle?.reactionAnimation || 'idle';

  return (
    <div 
      className={`absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none transition-all duration-700 ${
        cameraAngle === 'security'
          ? 'grayscale-[0.95] sepia-[0.35] hue-rotate-[85deg] brightness-[1.1] contrast-[1.25]'
          : ''
      }`}
    >
      
      {/* Theatrical Spotlight Cone (Stage Mode) or Warm Ambient Lounge (Workshop Mode) */}
      <AnimatePresence mode="wait">
        {mode === 'stage' ? (
          <motion.div
            key="stage-spotlight"
            initial={{ opacity: 0, scaleY: 0.8 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0.8 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute inset-0 pointer-events-none flex items-center justify-center"
          >
            {/* Top Spotlight Overhead Cone */}
            <div 
              className="absolute -top-10 w-[420px] h-[550px] opacity-40 blur-2xl"
              style={{ 
                background: `conic-gradient(from 180deg at 50% 0%, transparent 40%, ${primaryColor} 50%, transparent 60%)`,
                clipPath: 'polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)'
              }}
            />
            {/* Stage Floor Spotlight Circle */}
            <div 
              className="absolute bottom-6 w-80 sm:w-96 h-24 rounded-full blur-xl opacity-50"
              style={{ background: `radial-gradient(ellipse, ${primaryColor} 0%, transparent 70%)` }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="workshop-ambient"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute inset-0 pointer-events-none"
          >
            {/* Cozy Backstage Green Room Ambient Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/40 via-amber-950/20 to-black/60 mix-blend-screen" />
            <div className="absolute top-12 left-1/4 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl animate-pulse" />
            <div className="absolute bottom-10 right-1/4 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Floating Student of Comedy, Super Puff Mode & Times Up Trigger HUD */}
      <div className="absolute top-4 left-4 right-4 sm:left-6 sm:right-auto z-30 flex flex-wrap items-center gap-2 pointer-events-auto">
        
        {/* Super Puff Persona Badge */}
        <motion.button
          onClick={triggerTimesUpDrop}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-400/80 bg-gradient-to-r from-amber-600/40 via-orange-600/30 to-purple-600/40 backdrop-blur-md shadow-[0_0_20px_rgba(245,158,11,0.35)] cursor-pointer text-amber-200 group transition-all"
          title="Click to drop Super Puff signature: Times Up Mother Fathers"
        >
          <Crown className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
          <span className="font-mono text-[10px] font-black uppercase tracking-wider text-amber-300">
            SUPER PUFF • THE BIGGER CLOCK
          </span>
          <span className="text-[9px] px-1.5 py-0.2 bg-amber-400/20 rounded font-mono text-amber-300 font-bold border border-amber-300/40 group-hover:bg-amber-400/40">
            日本語・EN
          </span>
        </motion.button>

        {/* Super Puff Peaked Timing Visual Indicator */}
        {isTimingPeaked && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-purple-400/80 bg-gradient-to-r from-purple-900/60 via-purple-700/50 to-amber-600/50 backdrop-blur-md shadow-[0_0_25px_rgba(168,85,247,0.6)] font-mono text-[9px] font-bold uppercase tracking-wider text-purple-200 animate-pulse"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
            <span>SUPER PUFF TIMING: PEAKED (極上の間)</span>
          </motion.div>
        )}

        {/* Plasma Core Overlay Toggle Badge */}
        <motion.button
          layout
          onClick={() => setIsPlasmaOverloaded(prev => !prev)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-mono text-[9px] font-bold uppercase tracking-wider backdrop-blur-md shadow-lg transition-all duration-300 cursor-pointer select-none ${
            isPlasmaActive
              ? 'border-cyan-400/80 bg-gradient-to-r from-cyan-950/60 via-purple-950/50 to-emerald-950/50 text-cyan-200 shadow-[0_0_25px_rgba(34,211,238,0.6)] animate-pulse'
              : 'border-white/10 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white hover:border-white/20'
          }`}
          title="Toggle D9Enigma Plasma Performance Shield (P)"
        >
          <span className="relative flex h-2 w-2">
            {isPlasmaActive && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isPlasmaActive ? 'bg-cyan-400' : 'bg-white/40'}`}></span>
          </span>
          <span>D9 PLASMA: {isPlasmaActive ? 'OVERLOAD' : 'READY'}</span>
          <span className="text-[7px] bg-white/10 px-1 rounded text-white/50 font-black">P</span>
        </motion.button>

        {/* Theatrical Mode / Rank Badge */}
        <motion.div 
          layout
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-mono text-[9px] font-bold uppercase tracking-widest backdrop-blur-md shadow-md transition-all duration-500 ${
            mode === 'stage'
              ? 'border-amber-500/50 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
              : 'border-emerald-500/50 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
          }`}
        >
          {mode === 'stage' ? (
            <>
              <Radio className="w-3 h-3 text-amber-400 animate-pulse" />
              <span>MAIN STAGE SET</span>
            </>
          ) : (
            <>
              <Coffee className="w-3 h-3 text-emerald-400" />
              <span>GREEN ROOM LAB</span>
            </>
          )}
          <span className="text-white/30">•</span>
          <span className="text-emerald-400">{activeStrainName.split(' ')[0]}</span>
        </motion.div>
      </div>

      {/* "TIMES UP MOTHER FATHERS" Theatrical Screen Stinger Flash */}
      <AnimatePresence>
        {showTimesUpBanner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6, y: -40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.2, y: -20 }}
            transition={{ type: 'spring', stiffness: 450, damping: 20 }}
            className="absolute top-16 z-50 px-6 py-3 rounded-2xl border-2 border-amber-400 bg-black/95 backdrop-blur-2xl shadow-[0_0_60px_rgba(245,158,11,0.8)] text-center pointer-events-auto"
          >
            <div className="flex items-center justify-center gap-2 text-amber-400 font-mono text-xs font-black uppercase tracking-widest mb-1">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
              <span>SUPER PUFF • THE BIGGER CLOCK ON THE BLOCK</span>
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            </div>
            <h2 className="text-lg sm:text-2xl font-black font-sans uppercase tracking-tight text-white drop-shadow-[0_0_20px_#f59e0b]">
              "TIMES UP, MOTHER FATHERS!"
            </h2>
            <p className="text-xs font-mono text-amber-300 font-bold mt-0.5">
              時間切れだぜ、マザーファザーズ！ • 54-MIN TEMPORAL SHIFT ENGAGED
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mode Switch Theatrical Flash Banner */}
      <AnimatePresence>
        {showModeBanner && !showTimesUpBanner && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className={`absolute top-16 z-40 px-4 py-2 rounded-2xl border backdrop-blur-xl shadow-2xl font-mono text-center pointer-events-auto ${
              mode === 'stage'
                ? 'bg-amber-950/90 border-amber-400/80 text-amber-200 shadow-[0_0_30px_rgba(245,158,11,0.4)]'
                : 'bg-emerald-950/90 border-emerald-400/80 text-emerald-200 shadow-[0_0_30px_rgba(16,185,129,0.4)]'
            }`}
          >
            <div className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest">
              {mode === 'stage' ? <Mic className="w-4 h-4 text-amber-400" /> : <Layers className="w-4 h-4 text-emerald-400" />}
              <span>{mode === 'stage' ? 'ENTERING LIVE STAGE PERFORMANCE' : 'ENTERING GREEN ROOM FREESTYLE WORKSHOP'}</span>
            </div>
            <p className="text-[10px] text-white/70 font-light mt-0.5">
              {mode === 'stage' 
                ? 'Super Puff in full control • 54-min rolling timing engaged • Japanese fluency hot'
                : 'Pencil in hand • Testing punchlines, cadence & pause geometry'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Dragon & Rig Container with Theatrical Entrance Animations */}
      <motion.div
        key={`dragon-rig-${mode}`}
        initial={{
          opacity: 0.6,
          scale: mode === 'stage' ? 0.94 : 0.97,
          y: mode === 'stage' ? 25 : 10,
          rotate: mode === 'workshop' ? -2 : 0,
        }}
        animate={{
          opacity: 1,
          scale: 
            cameraAngle === 'closeup' 
              ? (reaction === 'smoke_blast' ? 1.55 : 1.5)
              : cameraAngle === 'crowd'
                ? (reaction === 'smoke_blast' ? 0.8 : 0.75)
                : (reaction === 'smoke_blast' ? 1.06 : 1),
          x: reaction === 'dodge' ? -45 : laserPos ? (laserPos.x - 50) * 0.15 : swayOffset,
          y: 
            cameraAngle === 'closeup' 
              ? (reaction === 'dodge' ? -5 : -32)
              : cameraAngle === 'crowd'
                ? (reaction === 'dodge' ? 55 : 42)
                : (reaction === 'dodge' ? 35 : (isPlaying ? -4 : 0)),
          rotate: reaction === 'dodge' ? -8 : reaction === 'eyebrow_raise' ? 3 : (mode === 'workshop' ? -1.5 : 0),
        }}
        transition={{
          type: 'spring',
          stiffness: 240,
          damping: 22,
          opacity: { duration: 0.45 },
        }}
        className="relative flex flex-col items-center justify-center transition-all duration-300"
      >
        {/* Dragon Speech / Roast Dialogue Bubble or Inner Comedy Study Thought */}
        <AnimatePresence mode="wait">
          {roastDialogue ? (
            <motion.div
              key="roast"
              initial={{ opacity: 0, y: 15, scale: 0.85 }}
              animate={{ opacity: 1, y: -20, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              className="absolute -top-28 z-40 max-w-sm sm:max-w-md bg-[#0a0a0d]/95 border-2 rounded-2xl p-3.5 sm:p-4 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl text-left pointer-events-auto"
              style={{
                borderColor: primaryColor,
                boxShadow: `0 0 30px ${primaryColor}44`,
              }}
            >
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest font-bold mb-1" style={{ color: accentColor }}>
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>SUPER PUFF (THE BIGGER CLOCK)</span>
                <span className="ml-auto px-1.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded text-[9px] font-mono">
                  BILINGUAL RETORT
                </span>
              </div>
              <p className="text-xs sm:text-sm text-white font-medium italic leading-relaxed">
                "{roastDialogue}"
              </p>
              {activeHeckle?.comedyTheoryTakeaway && (
                <div className="mt-2 pt-2 border-t border-white/10 text-[9px] font-mono text-amber-300 flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="truncate">{activeHeckle.comedyTheoryTakeaway}</span>
                </div>
              )}
              {/* Bubble pointer triangle */}
              <div 
                className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px]"
                style={{ borderTopColor: primaryColor }}
              />
            </motion.div>
          ) : activeHeckle ? (
            <motion.div
              key={`heckle-shout-${activeHeckle.id}`}
              initial={{ opacity: 0, y: 30, scale: 0.8, rotate: -3 }}
              animate={{ opacity: 1, y: -24, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, y: -10, scale: 0.85 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="absolute -top-28 z-40 max-w-sm bg-black/95 border-2 border-red-500 rounded-2xl p-3.5 shadow-[0_0_35px_rgba(239,68,68,0.6)] text-left backdrop-blur-xl pointer-events-auto animate-bounce"
            >
              <div className="flex items-center justify-between gap-1 text-[10px] font-mono text-red-400 uppercase tracking-widest font-black mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">{activeHeckle.icon}</span>
                  <span>AUDIENCE HECKLER INTERRUPT</span>
                </div>
                <span className="px-1.5 py-0.2 bg-red-500 text-white rounded text-[8px] font-bold">
                  {activeHeckle.category.toUpperCase()}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-white font-black italic leading-tight">
                "{activeHeckle.phrase}"
              </p>
              {/* Pointing down triangle */}
              <div 
                className="absolute -bottom-2.5 left-12 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-red-500"
              />
            </motion.div>
          ) : (isPlaying || mode === 'workshop') && !activeHeckle ? (
            <motion.div
              key={`${studyThoughtIndex}-${mode}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 0.95, y: -16 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.5 }}
              className="absolute -top-20 z-30 max-w-xs sm:max-w-md bg-black/85 border border-amber-400/50 rounded-xl px-3 py-1.5 shadow-xl backdrop-blur-md text-left"
            >
              <div className="text-[8px] font-mono text-amber-400 uppercase tracking-widest flex items-center gap-1 mb-0.5">
                <Crown className="w-2.5 h-2.5 text-amber-300" />
                <span>{mode === 'stage' ? 'SUPER PUFF INNER SWAGGER • TOKYO/KIWI' : 'GREEN ROOM MIND • BILINGUAL WORKSHOP'}</span>
              </div>
              <p className="text-[10px] text-amber-100 font-mono italic truncate">
                {STUDY_THOUGHTS[studyThoughtIndex]}
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* 2.5D Cell-Shaded Animated Super Puff Dragon Graphic - Vibrant & High Visibility */}
        <svg 
          viewBox="0 0 320 380" 
          className={`w-64 sm:w-80 h-72 sm:h-96 transition-all duration-500 ${
            isPlasmaActive 
              ? 'filter drop-shadow-[0_0_35px_rgba(34,211,238,0.75)] scale-[1.03]' 
              : 'filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]'
          }`}
        >
          <defs>
            {/* Super Puff Vibrant Radiant Dragon Skin Gradients */}
            <linearGradient id="dragonSkin" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="35%" stopColor="#16a34a" />
              <stop offset="70%" stopColor="#15803d" />
              <stop offset="100%" stopColor="#14532d" />
            </linearGradient>

            <linearGradient id="dragonHeadGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="40%" stopColor="#16a34a" />
              <stop offset="85%" stopColor="#15803d" />
              <stop offset="100%" stopColor="#0f4625" />
            </linearGradient>

            <linearGradient id="dragonScales" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#86efac" stopOpacity="0.85" />
              <stop offset="40%" stopColor="#4ade80" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0.25" />
            </linearGradient>

            <linearGradient id="dragonHorn" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="35%" stopColor="#f59e0b" />
              <stop offset="75%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#92400e" />
            </linearGradient>

            <linearGradient id="goldChainGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="40%" stopColor="#fbbf24" />
              <stop offset="70%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>

            <linearGradient id="sunglassesGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#312e81" />
              <stop offset="50%" stopColor="#1e1b4b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
              <stop offset="30%" stopColor="#93c5fd" stopOpacity="0.3" />
              <stop offset="70%" stopColor="#2563eb" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.4" />
            </linearGradient>

            <linearGradient id="weedJuiceGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#059669" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#064e3b" stopOpacity="0.95" />
            </linearGradient>

            <linearGradient id="bluntGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#92400e" />
              <stop offset="70%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>

            <radialGradient id="cherryFire" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff7ed" />
              <stop offset="35%" stopColor="#f97316" />
              <stop offset="75%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#7f1d1d" />
            </radialGradient>

            <radialGradient id="dragonAura" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#4ade80" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#22c55e" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#15803d" stopOpacity="0" />
            </radialGradient>
          </defs>

          <PlasmaStageBackground 
            intensity={isBrutalMode ? 'high' : 'normal'} 
            isPlasmaActive={isPlasmaActive} 
          />

          {/* Luminous Ambient Dragon Aura */}
          <circle cx="160" cy="180" r="140" fill="url(#dragonAura)" className="animate-pulse" />

          {/* Dragon Back Spikes - Golden Amber Edges */}
          <path d="M 120 70 L 95 45 L 125 60 Z" fill="url(#dragonHorn)" stroke="#451a03" strokeWidth="1.5" />
          <path d="M 105 110 L 75 90 L 110 105 Z" fill="url(#dragonHorn)" stroke="#451a03" strokeWidth="1.5" />
          <path d="M 95 160 L 60 145 L 100 155 Z" fill="url(#dragonHorn)" stroke="#451a03" strokeWidth="1.5" />

          {/* Majestic Curved Dragon Horns */}
          <path 
            d="M 140 75 Q 110 20 80 15 Q 110 45 130 85 Z" 
            fill="url(#dragonHorn)" 
            stroke="#451a03" 
            strokeWidth="2.5"
          />
          {/* Horn Ridge Highlight */}
          <path d="M 135 70 Q 112 28 85 18" stroke="#fef08a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path 
            d="M 180 75 Q 210 20 240 15 Q 210 45 190 85 Z" 
            fill="url(#dragonHorn)" 
            stroke="#451a03" 
            strokeWidth="2.5"
          />
          {/* Right Horn Ridge Highlight */}
          <path d="M 185 70 Q 208 28 235 18" stroke="#fef08a" strokeWidth="1.5" fill="none" strokeLinecap="round" />

          {/* Dragon Body & Chest */}
          <path 
            d="M 100 240 C 90 320, 80 370, 70 380 L 250 380 C 240 370, 230 320, 220 240 Z" 
            fill="url(#dragonSkin)" 
            stroke="#052e16" 
            strokeWidth="2.5"
          />

          {/* Body Shoulder Specular Highlights */}
          <path d="M 105 245 Q 92 310 82 360" stroke="#86efac" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.65" />
          <path d="M 215 245 Q 228 310 238 360" stroke="#86efac" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.65" />

          {/* Chest Underbelly Scales with Neon Rim Light */}
          <path 
            d="M 125 240 Q 160 260 195 240 Q 205 320 190 380 L 130 380 Q 115 320 125 240 Z" 
            fill="url(#dragonScales)" 
            stroke={mode === 'stage' ? primaryColor : '#4ade80'} 
            strokeWidth="2"
            strokeDasharray="4 3"
          />

          {/* Individual Scales Rows */}
          <path d="M 135 270 Q 160 282 185 270" stroke="#86efac" strokeWidth="1.5" fill="none" opacity="0.75" />
          <path d="M 132 300 Q 160 312 188 300" stroke="#86efac" strokeWidth="1.5" fill="none" opacity="0.75" />
          <path d="M 130 330 Q 160 342 190 330" stroke="#86efac" strokeWidth="1.5" fill="none" opacity="0.75" />

          {/* Super Puff Thick Heavy Gold Chain with Big Clock Medallion */}
          <g transform="translate(0, 0)">
            {/* Chain links */}
            <path 
              d="M 115 235 Q 160 275 205 235" 
              fill="none" 
              stroke="url(#goldChainGrad)" 
              strokeWidth="5" 
              strokeDasharray="6 3"
            />
            {/* Giant "Bigger Clock on the Block" Medallion */}
            <circle cx="160" cy="275" r="14" fill="#0f172a" stroke="url(#goldChainGrad)" strokeWidth="3" />
            <circle cx="160" cy="275" r="11" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 2" />
            {/* Clock hands showing 9:54 (54-min cycle) */}
            <line x1="160" y1="275" x2="153" y2="273" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" />
            <line x1="160" y1="275" x2="162" y2="267" stroke="#fef08a" strokeWidth="1.5" strokeLinecap="round" />
            {/* Medallion Kanji for Super Clock "超時" */}
            <text x="160" y="295" fontSize="7" fill="#fbbf24" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              超時
            </text>
          </g>

          {/* Dragon Scholar Lapel / Notebook tucked into vest */}
          <g transform="translate(108, 255) rotate(-10)">
            <rect x="0" y="0" width="22" height="30" rx="3" fill="#3b2f2f" stroke="#d97706" strokeWidth="1.5" />
            <line x1="4" y1="6" x2="18" y2="6" stroke="#fbbf24" strokeWidth="1" />
            <line x1="4" y1="12" x2="18" y2="12" stroke="#e5e7eb" strokeWidth="1" />
            <line x1="4" y1="18" x2="14" y2="18" stroke="#e5e7eb" strokeWidth="1" />
            {/* Tiny feather quill / pen */}
            <line x1="18" y1="-4" x2="21" y2="10" stroke="#f59e0b" strokeWidth="1.5" />
          </g>

          {/* Dragon Neck with Emerald Lighting */}
          <path 
            d="M 120 180 L 115 245 L 205 245 L 200 180 Z" 
            fill="url(#dragonSkin)" 
            stroke="#052e16" 
            strokeWidth="2.5"
          />
          <path d="M 122 185 L 118 240" stroke="#86efac" strokeWidth="2" fill="none" opacity="0.6" strokeLinecap="round" />
          <path d="M 198 185 L 202 240" stroke="#86efac" strokeWidth="2" fill="none" opacity="0.6" strokeLinecap="round" />

          {/* Dragon Head Structure with Vibrant Jade-Emerald Gradient */}
          <path 
            d="M 115 130 Q 110 75 160 75 Q 210 75 205 130 Q 225 155 210 190 Q 160 215 110 190 Q 95 155 115 130 Z" 
            fill="url(#dragonHeadGrad)" 
            stroke="#052e16" 
            strokeWidth="2.5"
          />

          {/* Forehead & Brow Specular Ridge */}
          <path d="M 125 90 Q 160 80 195 90" stroke="#bbf7d0" strokeWidth="2.5" fill="none" opacity="0.75" strokeLinecap="round" />
          {/* Cheekbone Highlights */}
          <ellipse cx="112" cy="155" rx="6" ry="12" fill="#4ade80" opacity="0.5" transform="rotate(-15 112 155)" />
          <ellipse cx="208" cy="155" rx="6" ry="12" fill="#4ade80" opacity="0.5" transform="rotate(15 208 155)" />

          {/* Expressive Snout & Nostrils with Upper Bridge Glint */}
          <path d="M 132 155 Q 160 142 188 155" stroke="#bbf7d0" strokeWidth="2" fill="none" opacity="0.8" strokeLinecap="round" />
          <ellipse cx="145" cy="165" rx="5" ry="7" fill="#052e16" stroke="#4ade80" strokeWidth="1" />
          <ellipse cx="175" cy="165" rx="5" ry="7" fill="#052e16" stroke="#4ade80" strokeWidth="1" />

          {/* Nostril Smoke Wisps */}
          {(isPlaying || isRoasting || mode === 'workshop') && (
            <>
              <circle cx="143" cy="155" r="3" fill="#ffffff" opacity="0.5" className="animate-ping" />
              <circle cx="177" cy="155" r="3" fill="#ffffff" opacity="0.5" className="animate-ping" />
            </>
          )}

          {/* Eyes (Stoned Red-Glow Dragon Eyes behind cool shades) */}
          <g transform={`translate(${laserPos ? (laserPos.x - 50) * 0.08 : 0}, ${laserPos ? (laserPos.y - 50) * 0.05 : 0})`}>
            {/* Left Eye */}
            <ellipse cx="135" cy="120" rx="14" ry={blink ? 2 : 12} fill="#ef4444" stroke="#000" strokeWidth="2.5" />
            {!blink && (
              <>
                <ellipse 
                  cx={reaction === 'surprised' ? 135 : 137} 
                  cy={activeEmote === 'eye_roll' ? 112 : 120} 
                  rx={reaction === 'surprised' ? 7 : 3.5} 
                  ry={activeEmote === 'eye_roll' ? 4 : 9} 
                  fill="#7f1d1d" 
                />
                <circle cx={activeEmote === 'eye_roll' ? 135 : 133} cy={activeEmote === 'eye_roll' ? 110 : 116} r="2.5" fill="#fef08a" />
              </>
            )}

            {/* Right Eye */}
            <ellipse cx="185" cy="120" rx="14" ry={blink ? 2 : 12} fill="#ef4444" stroke="#000" strokeWidth="2.5" />
            {!blink && (
              <>
                <ellipse 
                  cx={reaction === 'surprised' ? 185 : 183} 
                  cy={activeEmote === 'eye_roll' ? 112 : 120} 
                  rx={reaction === 'surprised' ? 7 : 3.5} 
                  ry={activeEmote === 'eye_roll' ? 4 : 9} 
                  fill="#7f1d1d" 
                />
                <circle cx={activeEmote === 'eye_roll' ? 185 : 181} cy={activeEmote === 'eye_roll' ? 110 : 116} r="2.5" fill="#fef08a" />
              </>
            )}

            {/* Floating Sweat Drop (Sweat Reaction) */}
            {activeEmote === 'sweat' && (
              <motion.path
                d="M 120 108 C 118 114, 115 116, 115 120 C 115 123, 117 125, 120 125 C 123 125, 125 123, 125 120 C 125 116, 122 114, 120 108 Z"
                fill="#38bdf8"
                stroke="#0284c7"
                strokeWidth="1"
                animate={{ y: [0, 15, 30], opacity: [1, 0.9, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />
            )}
          </g>

          {/* Super Cool Aviator Sunglasses for Super Puff */}
          <g transform="translate(0, 0)">
            {/* Gold Wire Frame Bridge */}
            <line x1="147" y1="116" x2="173" y2="116" stroke="#f59e0b" strokeWidth="2" />
            {/* Top Brow Bar */}
            <path d="M 120 110 Q 160 106 200 110" stroke="#fbbf24" strokeWidth="2" fill="none" />
            
            {/* Left Lens */}
            <path 
              d="M 120 112 Q 135 110 148 114 Q 148 132 135 134 Q 120 132 120 112 Z" 
              fill="url(#sunglassesGrad)" 
              stroke="#f59e0b" 
              strokeWidth="2" 
              opacity="0.94"
            />
            {/* Left Lens Glint */}
            <line x1="124" y1="115" x2="132" y2="128" stroke="#ffffff" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
            
            {/* Right Lens */}
            <path 
              d="M 172 114 Q 185 110 200 112 Q 200 132 185 134 Q 172 132 172 114 Z" 
              fill="url(#sunglassesGrad)" 
              stroke="#f59e0b" 
              strokeWidth="2" 
              opacity="0.94"
            />
            {/* Right Lens Glint */}
            <line x1="176" y1="115" x2="184" y2="128" stroke="#ffffff" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
          </g>

          {/* Eyebrows (Dynamic Swagger Mood) */}
          <path 
            d={activeEmote === 'smirk'
              ? "M 118 96 Q 135 88 152 98" 
              : activeEmote === 'eye_roll'
              ? "M 118 100 Q 135 112 152 106"
              : reaction === 'eyebrow_raise' 
              ? "M 118 98 Q 135 88 152 102" 
              : reaction === 'surprised' 
              ? "M 118 92 Q 135 84 152 94" 
              : "M 118 104 Q 135 108 152 102"
            } 
            stroke="#000" 
            strokeWidth="4" 
            fill="none" 
          />
          <path 
            d={activeEmote === 'smirk'
              ? "M 168 106 Q 185 110 202 104"
              : activeEmote === 'eye_roll'
              ? "M 168 100 Q 185 112 202 106"
              : reaction === 'eyebrow_raise' 
              ? "M 168 102 Q 185 94 202 92" 
              : reaction === 'surprised' 
              ? "M 168 94 Q 185 84 202 92" 
              : "M 168 102 Q 185 108 202 104"
            } 
            stroke="#000" 
            strokeWidth="4" 
            fill="none" 
          />

          {/* Mouth (Talking / Confident Grin / Roasting) */}
          {mouthOpen ? (
            <path 
              d="M 130 182 Q 160 215 190 182 Q 160 190 130 182 Z" 
              fill="#7f1d1d" 
              stroke="#000" 
              strokeWidth="2.5" 
            />
          ) : (
            <path 
              d={activeEmote === 'smirk'
                ? "M 130 186 Q 155 198 190 176" 
                : reaction === 'deadpan' || activeEmote === 'eye_roll' 
                ? "M 135 186 L 185 186" 
                : "M 130 182 Q 160 196 190 180"
              } 
              stroke="#000" 
              strokeWidth="3.5" 
              fill="none" 
            />
          )}

          {/* Sharp Little Dragon Teeth */}
          {mouthOpen && (
            <>
              <polygon points="142,183 147,190 152,183" fill="#fff" />
              <polygon points="168,183 173,190 178,183" fill="#fff" />
            </>
          )}

          {/* LEFT ARM & DRAGON BONG */}
          <motion.g
            animate={{
              y: activeEmote === 'shrug' ? [0, -18, -15] : [0, -3, 0],
              rotate: activeEmote === 'shrug' ? [0, -12, -10] : [0, 1.2, 0],
            }}
            transition={{
              duration: activeEmote === 'shrug' ? 0.35 : 4.8,
              repeat: activeEmote === 'shrug' ? 0 : Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Left Arm Outline */}
            <path d="M 105 245 Q 65 220 85 185" fill="none" stroke="#052e16" strokeWidth="18" strokeLinecap="round" />
            {/* Left Arm Fill */}
            <path d="M 105 245 Q 65 220 85 185" fill="none" stroke="url(#dragonSkin)" strokeWidth="13" strokeLinecap="round" />
            {/* Left Arm Highlight */}
            <path d="M 104 242 Q 68 218 84 187" fill="none" stroke="#86efac" strokeWidth="2" opacity="0.6" strokeLinecap="round" />

            {/* Glass Bong Group */}
            <g transform="translate(42, 115)">
              {/* Bong Neck (Glass Tube) */}
              <rect x="35" y="10" width="12" height="45" rx="2" fill="url(#glassGrad)" stroke="#1e3a8a" strokeWidth="1.5" />
              
              {/* Beaker Base of the Bong */}
              <path 
                d="M 41 52 L 20 85 C 16 92, 22 98, 30 98 L 52 98 C 60 98, 66 92, 62 85 L 41 52 Z" 
                fill="url(#glassGrad)" 
                stroke="#1e3a8a" 
                strokeWidth="1.8" 
              />

              {/* Glowing Green Terpene Liquid inside Beaker Base */}
              <path 
                d="M 26 75 L 21 84 C 18 89, 22 95, 29 95 L 53 95 C 60 95, 64 89, 61 84 L 56 75 C 50 78, 32 78, 26 75 Z" 
                fill="url(#weedJuiceGrad)" 
              />

              {/* Moving / Bubbling Water Chamber Dots */}
              <motion.circle cx="30" cy="85" r="2.5" fill="#a7f3d0" animate={{ y: [0, -12, 0], opacity: [0, 1, 0] }} transition={{ duration: 1.6, repeat: Infinity, delay: 0.1 }} />
              <motion.circle cx="42" cy="82" r="1.8" fill="#a7f3d0" animate={{ y: [0, -14, 0], opacity: [0, 1, 0] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.5 }} />
              <motion.circle cx="51" cy="88" r="3" fill="#a7f3d0" animate={{ y: [0, -10, 0], opacity: [0, 1, 0] }} transition={{ duration: 2.0, repeat: Infinity, delay: 0.9 }} />
              <motion.circle cx="36" cy="90" r="2" fill="#34d399" animate={{ y: [0, -8, 0], opacity: [0, 0.8, 0] }} transition={{ duration: 1.4, repeat: Infinity, delay: 1.3 }} />

              {/* Downstem & Herb Bowl piece (Glass Slide) */}
              <line x1="53" y1="62" x2="68" y2="52" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" />
              {/* Herb Bowl */}
              <path d="M 66 48 L 74 44 L 72 56 Z" fill="#92400e" stroke="#1e3a8a" strokeWidth="1" />
              {/* Glowing green embers in Bowl */}
              <circle cx="70" cy="50" r="3" fill="#34d399" className="animate-pulse" />
              <circle cx="70" cy="50" r="6" fill="#10b981" opacity="0.4" className="animate-ping" style={{ animationDuration: '2s' }} />

              {/* Water bubbling surface waves */}
              <path d="M 26 75 Q 41 78 56 75" fill="none" stroke="#34d399" strokeWidth="1.5" strokeDasharray="3 2" />

              {/* Glass Rim Top */}
              <ellipse cx="41" cy="10" rx="6" ry="2" fill="none" stroke="#93c5fd" strokeWidth="1.5" />

              {/* Bubbling Smoke Wisps coming out of Bong Mouthpiece */}
              <motion.path 
                d="M 41 8 Q 30 -10 45 -22" 
                fill="none" 
                stroke="#cbd5e1" 
                strokeWidth="2.5" 
                strokeLinecap="round"
                opacity="0.5"
                animate={{
                  pathLength: [0, 1],
                  opacity: [0, 0.6, 0],
                  x: [0, -6, 2],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.path 
                d="M 41 8 Q 50 -14 38 -28" 
                fill="none" 
                stroke="#e2e8f0" 
                strokeWidth="1.5" 
                strokeLinecap="round"
                opacity="0.3"
                animate={{
                  pathLength: [0, 1],
                  opacity: [0, 0.5, 0],
                  x: [0, 8, -4],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.2,
                }}
              />
            </g>

            {/* Left Hand / Claws holding the neck of the Bong */}
            <g transform="translate(70, 150)">
              {/* Claws grasping around the tube */}
              <path d="M 5 10 Q 18 6 25 12 Q 18 18 5 15 Z" fill="url(#dragonSkin)" stroke="#000" strokeWidth="1.5" />
              <polygon points="25,12 30,11 26,14" fill="#f59e0b" />

              <path d="M 4 20 Q 16 16 22 22 Q 16 28 4 25 Z" fill="url(#dragonSkin)" stroke="#000" strokeWidth="1.5" />
              <polygon points="22,22 27,21 23,24" fill="#f59e0b" />
            </g>
          </motion.g>

          {/* RIGHT ARM & PRECISION BLUNT */}
          <motion.g
            animate={{
              y: activeEmote === 'shrug' ? [0, -18, -15] : [0, 3, 0],
              rotate: activeEmote === 'shrug' ? [0, 12, 10] : [0, -1.2, 0],
            }}
            transition={{
              duration: activeEmote === 'shrug' ? 0.35 : 4.2,
              repeat: activeEmote === 'shrug' ? 0 : Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Right Arm Outline */}
            <path d="M 215 245 Q 255 220 230 185" fill="none" stroke="#052e16" strokeWidth="18" strokeLinecap="round" />
            {/* Right Arm Fill */}
            <path d="M 215 245 Q 255 220 230 185" fill="none" stroke="url(#dragonSkin)" strokeWidth="13" strokeLinecap="round" />
            {/* Right Arm Highlight */}
            <path d="M 216 242 Q 252 218 229 187" fill="none" stroke="#86efac" strokeWidth="2" opacity="0.6" strokeLinecap="round" />

            {/* Right Hand Holding the Master-Cured Blunt */}
            <g transform="translate(205, 155)">
              {/* Dragon Claws */}
              <path d="M 10 20 Q 25 15 35 25 Q 25 35 10 30 Z" fill="url(#dragonSkin)" stroke="#000" strokeWidth="2" />
              <polygon points="35,25 42,24 36,28" fill="#f59e0b" />
              
              {/* The Precision Blunt */}
              <rect x="20" y="8" width="55" height="10" rx="3" fill="url(#bluntGlow)" stroke="#451a03" strokeWidth="1.5" transform="rotate(-25 20 8)" />
              {/* Burning Cherry & Terpene Resonance Ring */}
              <circle cx="72" cy="-16" r="6" fill="url(#cherryFire)" className="animate-pulse" />
              <circle cx="74" cy="-17" r="10" fill={mode === 'stage' ? primaryColor : '#10b981'} opacity="0.5" className="animate-ping" />
              
              {/* Floating Smoke Rings with Japanese Kanji Symbols */}
              <g transform="translate(85, -28)">
                <circle cx="0" cy="0" r="10" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.4" className="animate-pulse" />
                <circle cx="12" cy="-10" r="14" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.25" />
              </g>
            </g>
          </motion.g>

          {/* Mode-Specific Foreground Rig */}
          {mode === 'stage' ? (
            /* Vintage Comedy Club Mic Stand Rig in Foreground */
            <g transform="translate(145, 160)">
              {/* Mic Head (Chrome Shure 55SH style) */}
              <rect x="5" y="45" width="20" height="26" rx="6" fill="#94a3b8" stroke="#0f172a" strokeWidth="2" />
              <line x1="8" y1="52" x2="22" y2="52" stroke="#334155" strokeWidth="1.5" />
              <line x1="8" y1="58" x2="22" y2="58" stroke="#334155" strokeWidth="1.5" />
              <line x1="8" y1="64" x2="22" y2="64" stroke="#334155" strokeWidth="1.5" />
              
              {/* Mic Neck Swivel */}
              <rect x="12" y="71" width="6" height="12" fill="#475569" stroke="#000" strokeWidth="1" />
              {/* Chrome Stand Pole */}
              <rect x="13.5" y="83" width="3" height="140" fill="#cbd5e1" stroke="#334155" strokeWidth="1" />
            </g>
          ) : (
            /* Green Room Workshop Desk Elements (Bonsai, Origami Crane, Manuscript, Coffee Mug) */
            <g transform="translate(130, 290)">
              {/* Green Room Wood Craft Desk Outline */}
              <rect x="-45" y="48" width="160" height="17" rx="3" fill="#27272a" stroke="#52525b" strokeWidth="1.5" />
              
              {/* Zen Juniper Bonsai Tree in Japanese Ceramic Pot (盆栽) */}
              <g transform="translate(-40, 24)">
                {/* Shallow Oval Ceramic Bonsai Pot */}
                <ellipse cx="12" cy="24" rx="14" ry="4" fill="#3f3f46" stroke="#71717a" strokeWidth="1.2" />
                <rect x="0" y="22" width="24" height="4" rx="1" fill="#27272a" />
                {/* Pot legs */}
                <rect x="3" y="26" width="3" height="2" fill="#52525b" />
                <rect x="18" y="26" width="3" height="2" fill="#52525b" />
                {/* Rich Soil Mound */}
                <ellipse cx="12" cy="22" rx="11" ry="2.5" fill="#451a03" />
                {/* Gnarled Old Juniper Trunk */}
                <path d="M 12 22 Q 10 14 15 10 Q 18 7 13 2" fill="none" stroke="#78350f" strokeWidth="2.8" strokeLinecap="round" />
                <path d="M 14 11 Q 7 9 5 5" fill="none" stroke="#78350f" strokeWidth="1.8" strokeLinecap="round" />
                {/* Tiered Cloud Pine Foliage Pads (Deep Emerald Pine) */}
                <ellipse cx="14" cy="2" rx="7" ry="3.5" fill="#047857" stroke="#065f46" strokeWidth="0.8" />
                <ellipse cx="5" cy="5" rx="6" ry="3" fill="#10b981" stroke="#047857" strokeWidth="0.8" />
                <ellipse cx="17" cy="8" rx="5.5" ry="2.8" fill="#059669" stroke="#047857" strokeWidth="0.8" />
                {/* Mini Bonsai Kanjo Label */}
                <text x="12" y="32" fontSize="5" fill="#a7f3d0" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                  盆栽
                </text>
              </g>

              {/* Open Grimoire / Manuscript on Desk */}
              <rect x="-10" y="38" width="42" height="20" rx="2" fill="#fef3c7" stroke="#b45309" strokeWidth="1" transform="rotate(-4)" />
              <line x1="-6" y1="44" x2="26" y2="44" stroke="#92400e" strokeWidth="0.8" />
              <line x1="-6" y1="48" x2="26" y2="48" stroke="#92400e" strokeWidth="0.8" />
              <line x1="-6" y1="52" x2="18" y2="52" stroke="#92400e" strokeWidth="0.8" />
              
              {/* Geometric Folded Origami Crane (折り鶴) resting on manuscript */}
              <g transform="translate(18, 32)">
                {/* Origami Wings & Facets (Crisp Washi White & Gold) */}
                <polygon points="0,10 6,0 12,10" fill="#ffffff" stroke="#d97706" strokeWidth="0.8" />
                <polygon points="6,0 10,8 6,10" fill="#fef08a" stroke="#b45309" strokeWidth="0.6" />
                {/* Left Wing Flap */}
                <polygon points="0,10 -8,4 2,8" fill="#fef9c3" stroke="#d97706" strokeWidth="0.8" />
                {/* Right Wing Flap */}
                <polygon points="12,10 20,4 10,8" fill="#fef08a" stroke="#d97706" strokeWidth="0.8" />
                {/* Neck & Head */}
                <polygon points="6,10 8,16 6,14" fill="#fbbf24" stroke="#b45309" strokeWidth="0.6" />
                {/* Tail */}
                <polygon points="6,0 4,-4 5,2" fill="#f59e0b" stroke="#b45309" strokeWidth="0.6" />
                <text x="6" y="24" fontSize="4.5" fill="#fde047" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                  折り鶴
                </text>
              </g>

              {/* Hot Coffee Ceramic Mug */}
              <rect x="58" y="38" width="16" height="18" rx="2" fill="#10b981" stroke="#047857" strokeWidth="1.5" />
              <path d="M 74 42 Q 80 47 74 52" stroke="#047857" strokeWidth="2" fill="none" />
              <path d="M 62 34 Q 65 26 62 20" stroke="#fff" strokeWidth="1" fill="none" opacity="0.6" className="animate-pulse" />
            </g>
          )}
        </svg>
      </motion.div>

      {/* Laser Pointer Disruption Dot */}
      {laserPos && (
        <motion.div
          className="absolute z-50 pointer-events-none"
          style={{ left: `${laserPos.x}%`, top: `${laserPos.y}%` }}
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ repeat: Infinity, duration: 0.2 }}
        >
          <div className="w-4 h-4 bg-green-400 rounded-full shadow-[0_0_20px_#22c55e,0_0_40px_#4ade80] animate-pulse" />
          <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </motion.div>
      )}

      {/* Tomato Splat on Screen */}
      {hasTomatoSplat && (
        <motion.div
          initial={{ scale: 0.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.92 }}
          exit={{ opacity: 0 }}
          className="absolute z-50 flex flex-col items-center pointer-events-auto cursor-pointer"
          style={{ top: '28%', left: '46%' }}
          onClick={onClearTomato}
          title="Click to wipe off tomato"
        >
          {/* Splat Graphic */}
          <div className="relative">
            <svg width="140" height="140" viewBox="0 0 100 100" className="filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
              <path 
                d="M 50 20 C 65 15, 80 30, 85 45 C 90 60, 75 75, 60 85 C 45 95, 25 85, 15 70 C 5 55, 15 35, 30 25 C 40 18, 45 22, 50 20 Z" 
                fill="#dc2626" 
              />
              <circle cx="35" cy="35" r="8" fill="#b91c1c" />
              <circle cx="65" cy="55" r="10" fill="#991b1b" />
              <circle cx="45" cy="65" r="6" fill="#ef4444" />
              <circle cx="25" cy="50" r="4" fill="#ef4444" />
              {/* Tomato Seeds */}
              <ellipse cx="48" cy="42" rx="3" ry="5" fill="#fde047" transform="rotate(25 48 42)" />
              <ellipse cx="60" cy="48" rx="2.5" ry="4" fill="#fef08a" transform="rotate(-15 60 48)" />
              {/* Splat Drips */}
              <path d="M 52 82 Q 54 110 50 120 Q 48 110 50 82 Z" fill="#b91c1c" />
              <path d="M 32 72 Q 30 95 28 102 Q 26 95 30 72 Z" fill="#dc2626" />
            </svg>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-0.5 rounded text-[9px] font-mono text-red-400 whitespace-nowrap border border-red-500/40 uppercase">
              [Click to Wipe Stage]
            </div>
          </div>
        </motion.div>
      )}

      {/* Foreground Audience Silhouette for Cam C (Vibe Cam) */}
      {cameraAngle === 'crowd' && (
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none z-30 flex items-end justify-around px-4 sm:px-12 opacity-85 select-none animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="flex items-end space-x-12 sm:space-x-24 w-full justify-between">
            {/* Heckler left side silhouette */}
            <div className="relative flex flex-col items-center">
              <div className="w-16 h-10 bg-slate-950/90 rounded-t-full border-t border-slate-900/40 relative">
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-emerald-500/20 blur-sm animate-pulse" />
                <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-400/40" />
              </div>
              <div className="w-14 h-16 bg-slate-950/95 rounded-t-[40%] mt-[-4px]" />
            </div>

            {/* Center silhouettes */}
            <div className="hidden sm:flex items-end space-x-16">
              <div className="w-12 h-14 bg-slate-950/95 rounded-t-[42%] transform -rotate-6" />
              <div className="relative flex flex-col items-center">
                <div className="w-10 h-12 bg-slate-950/95 rounded-t-[45%] transform rotate-3" />
                <div className="absolute -top-2 left-3 w-4 h-3 bg-blue-500/30 rounded-md rotate-12 blur-[1px] animate-pulse" />
              </div>
            </div>

            {/* Right side silhouette */}
            <div className="relative flex flex-col items-center">
              <div className="w-20 h-8 bg-slate-950/90 rounded-t-full border-t border-slate-900/40 flex justify-center items-end">
                <div className="w-2 h-5 bg-slate-900/80 rounded mb-1" />
              </div>
              <div className="w-16 h-18 bg-slate-950/95 rounded-t-[38%] mt-[-4px] transform -scale-x-100" />
            </div>
          </div>
        </div>
      )}

      {/* Retro CCTV Infrared Security Overlay for Cam D (Security Feed) */}
      {cameraAngle === 'security' && (
        <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-4 font-mono text-[10px] text-emerald-500 uppercase tracking-widest bg-emerald-950/10 mix-blend-color-dodge select-none overflow-hidden animate-in fade-in duration-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold relative">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 absolute inline-block" />
              <span className="text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.8)] ml-4">REC [CAM-04]</span>
            </div>
            <div className="text-right text-emerald-400 font-bold">
              <span>CAMS: SECURITY FEED</span>
            </div>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-emerald-500/25 rounded-full flex items-center justify-center">
            <div className="w-2 h-[1px] bg-emerald-400" />
            <div className="h-2 w-[1px] bg-emerald-400 absolute" />
          </div>

          <div className="flex items-end justify-between font-bold z-10">
            <div className="flex flex-col gap-0.5 text-[9px]">
              <div>SYS: ACTIVE_DRAGON_V9</div>
              <div>ST THC: Cosmic OG (31.4%)</div>
              <div>XP LEVEL: {comedyXp}</div>
            </div>
            <div className="text-right flex flex-col gap-0.5 text-[9px]">
              <div>DATE: SEPT 12, 2026</div>
              <div>TIME: {cctvTime}</div>
              <div className="text-white">CODEC: VEO_3.1_INFRARED</div>
            </div>
          </div>

          {/* CRT Horizontal Line Scanning CSS Gradient */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.14]" 
            style={{
              background: 'repeating-linear-gradient(rgba(16,185,129,0.1) 0px, rgba(16,185,129,0.1) 1px, transparent 1px, transparent 3px)'
            }}
          />
          {/* Heavy CRT Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_55%,rgba(0,12,0,0.45)_100%)] pointer-events-none" />
        </div>
      )}

    </div>
  );
}

