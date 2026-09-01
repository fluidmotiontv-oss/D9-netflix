import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HeckleItem, playTheatricalModeTransitionSfx, playSuperPuffDropSfx, speakHeckle } from '../audio/hecklerAudio';
import { Flame, Sparkles, MessageSquare, Zap, Target, BookOpen, Award, Cannabis, GraduationCap, Mic, Coffee, Radio, Layers, Crown, Clock } from 'lucide-react';

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
}: AnimatedDragonPerformerProps) {
  const [mouthOpen, setMouthOpen] = useState(false);
  const [blink, setBlink] = useState(false);
  const [swayOffset, setSwayOffset] = useState(0);
  const [studyThoughtIndex, setStudyThoughtIndex] = useState(0);
  const [showModeBanner, setShowModeBanner] = useState(false);
  const [isSuperPuffStoned, setIsSuperPuffStoned] = useState(true);
  const [showTimesUpBanner, setShowTimesUpBanner] = useState(false);
  const prevModeRef = useRef(mode);

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

  // Speaking mouth movement when playing or roasting
  useEffect(() => {
    let speakInterval: any;
    if (isPlaying || isRoasting) {
      speakInterval = setInterval(() => {
        setMouthOpen(prev => !prev);
        setSwayOffset((Math.random() - 0.5) * 6);
      }, 140);
    } else {
      setMouthOpen(false);
      setSwayOffset(0);
    }
    return () => clearInterval(speakInterval);
  }, [isPlaying, isRoasting]);

  // Determine dragon animation reaction pose
  const reaction = activeHeckle?.reactionAnimation || 'idle';

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none">
      
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
          scale: reaction === 'smoke_blast' ? 1.06 : 1,
          x: reaction === 'dodge' ? -45 : laserPos ? (laserPos.x - 50) * 0.15 : swayOffset,
          y: reaction === 'dodge' ? 35 : (isPlaying ? -4 : 0),
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
          className="w-64 sm:w-80 h-72 sm:h-96 filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] transition-transform duration-500"
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
                  cy="120" 
                  rx={reaction === 'surprised' ? 7 : 3.5} 
                  ry="9" 
                  fill="#7f1d1d" 
                />
                <circle cx="133" cy="116" r="2.5" fill="#fef08a" />
              </>
            )}

            {/* Right Eye */}
            <ellipse cx="185" cy="120" rx="14" ry={blink ? 2 : 12} fill="#ef4444" stroke="#000" strokeWidth="2.5" />
            {!blink && (
              <>
                <ellipse 
                  cx={reaction === 'surprised' ? 185 : 183} 
                  cy="120" 
                  rx={reaction === 'surprised' ? 7 : 3.5} 
                  ry="9" 
                  fill="#7f1d1d" 
                />
                <circle cx="181" cy="116" r="2.5" fill="#fef08a" />
              </>
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
            d={reaction === 'eyebrow_raise' 
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
            d={reaction === 'eyebrow_raise' 
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
              d={reaction === 'deadpan' ? "M 135 186 L 185 186" : "M 130 182 Q 160 196 190 180"} 
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

          {/* Right Hand Holding the Master-Cured Blunt */}
          <g transform="translate(195, 175)">
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

    </div>
  );
}

