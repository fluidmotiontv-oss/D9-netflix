import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  playBambooClackSfx, 
  playSingingBowlSfx, 
  playBonsaiPruneSfx, 
  playPaperCreaseSfx, 
  playWaterMistSfx, 
  playTempleBellSfx 
} from '../audio/zenAudio';
import { 
  Sparkles, 
  Scissors, 
  Droplets, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  X, 
  RotateCcw, 
  Compass, 
  Heart, 
  Flower2, 
  Feather, 
  Wind, 
  Layers, 
  Award,
  Crown,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

interface ZenBonsaiOrigamiSanctuaryProps {
  isOpen: boolean;
  onClose: () => void;
  isOverlay?: boolean;
  onGainXp?: (amount: number) => void;
}

// Bonsai Types
type BonsaiStyle = 'juniper' | 'sakura' | 'cascading' | 'maple';
type OrigamiModel = 'crane' | 'dragon' | 'lotus' | 'helmet' | 'star';
type WashiPattern = 'gold' | 'sakura' | 'indigo' | 'jade' | 'obsidian';

export default function ZenBonsaiOrigamiSanctuary({
  isOpen,
  onClose,
  isOverlay = false,
  onGainXp,
}: ZenBonsaiOrigamiSanctuaryProps) {
  // Navigation tabs inside sanctuary
  const [activeZenTab, setActiveZenTab] = useState<'bonsai' | 'origami' | 'meditation'>('bonsai');

  // Bonsai state
  const [selectedBonsai, setSelectedBonsai] = useState<BonsaiStyle>('juniper');
  const [prunedBranches, setPrunedBranches] = useState<number[]>([]);
  const [mistActive, setMistActive] = useState(false);
  const [zenFocusLevel, setZenFocusLevel] = useState(65);
  const [totalPrunesCount, setTotalPrunesCount] = useState(0);

  // Origami state
  const [selectedOrigami, setSelectedOrigami] = useState<OrigamiModel>('crane');
  const [washiPattern, setWashiPattern] = useState<WashiPattern>('gold');
  const [foldingStep, setFoldingStep] = useState(3); // 0: flat square, 1: valley creases, 2: base form, 3: completed
  const [isFlappingWings, setIsFlappingWings] = useState(true);

  // Meditation & Audio state
  const [ambientSound, setAmbientSound] = useState<'none' | 'bamboo' | 'bowl' | 'bell'>('bamboo');
  const [isMuted, setIsMuted] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathTimer, setBreathTimer] = useState(4);

  // Rotating Zen Dragon Wisdom
  const [wisdomIndex, setWisdomIndex] = useState(0);

  const ZEN_WISDOMS = [
    {
      ja: '「盆栽のように無駄を削ぎ落とし、折り紙のように次元を畳む」',
      en: 'Prune conversational fluff like a 200-year-old bonsai; fold dimensional punchlines like crisp washi paper.',
      author: 'Super Puff • Zen Comedy Grimoire'
    },
    {
      ja: '「焦るな。1.4秒の間（ま）こそが、最高の一撃を生む」',
      en: 'Never rush. The 1.4-second pregnant pause between branches is where sacred geometry breathes.',
      author: 'Super Puff • Timing & Sentei Master'
    },
    {
      ja: '「形なき煙も、呼吸を整えれば優美な折り鶴となる」',
      en: 'Even shapeless smoke forms an elegant origami crane when your breath is in alignment.',
      author: 'Super Puff • The Bigger Clock on the Block'
    },
    {
      ja: '「完璧な枝などない。不完全な歪みこそが観客の心を掴む」',
      en: 'There is no perfect branch. The organic, asymmetrical quirk is what captures the room.',
      author: 'Wabi-Sabi Comedy Theory'
    }
  ];

  // Auto-rotate wisdom
  useEffect(() => {
    const timer = setInterval(() => {
      setWisdomIndex(prev => (prev + 1) % ZEN_WISDOMS.length);
    }, 9000);
    return () => clearInterval(timer);
  }, []);

  // Ambient loop trigger
  useEffect(() => {
    if (isMuted || ambientSound === 'none') return;
    
    let intervalTime = 6000;
    if (ambientSound === 'bowl') intervalTime = 7500;
    if (ambientSound === 'bell') intervalTime = 9000;

    const soundLoop = setInterval(() => {
      if (ambientSound === 'bamboo') playBambooClackSfx();
      if (ambientSound === 'bowl') playSingingBowlSfx(432);
      if (ambientSound === 'bell') playTempleBellSfx();
    }, intervalTime);

    return () => clearInterval(soundLoop);
  }, [ambientSound, isMuted]);

  // Breathing loop (4-7-8 Pranayama pacing)
  useEffect(() => {
    const breathInterval = setInterval(() => {
      setBreathTimer(prev => {
        if (prev <= 1) {
          if (breathPhase === 'inhale') {
            setBreathPhase('hold');
            return 7;
          } else if (breathPhase === 'hold') {
            setBreathPhase('exhale');
            return 8;
          } else {
            setBreathPhase('inhale');
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(breathInterval);
  }, [breathPhase]);

  // Handle pruning a branch
  const handlePruneBranch = (branchId: number) => {
    if (prunedBranches.includes(branchId)) return;
    playBonsaiPruneSfx();
    setPrunedBranches(prev => [...prev, branchId]);
    setTotalPrunesCount(prev => prev + 1);
    setZenFocusLevel(prev => Math.min(100, prev + 8));
    if (onGainXp) onGainXp(15);
  };

  // Reset bonsai branches
  const handleResetBonsai = () => {
    setPrunedBranches([]);
    playWaterMistSfx();
  };

  // Handle Misting
  const handleMistBonsai = () => {
    setMistActive(true);
    playWaterMistSfx();
    setZenFocusLevel(prev => Math.min(100, prev + 5));
    setTimeout(() => setMistActive(false), 1400);
  };

  // Handle Origami step change
  const handleOrigamiStepChange = (newStep: number) => {
    setFoldingStep(newStep);
    playPaperCreaseSfx();
    if (newStep === 3 && onGainXp) {
      onGainXp(20);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className={
        isOverlay 
          ? "fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-300"
          : "w-full rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-stone-950/95 via-emerald-950/30 to-black/95 p-4 sm:p-6 shadow-2xl backdrop-blur-md relative overflow-hidden"
      }
    >
      {/* Background Zen Japanese Garden Atmosphere Elements */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Gentle Sakura Petals Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2.5 h-3 bg-pink-300/40 rounded-full"
            style={{
              left: `${(i * 9 + 4) % 100}%`,
              top: '-20px',
            }}
            animate={{
              y: ['0vh', '110vh'],
              x: [0, (i % 2 === 0 ? 30 : -30), 0],
              rotate: [0, 360],
              opacity: [0, 0.7, 0]
            }}
            transition={{
              duration: 8 + (i % 5) * 2,
              repeat: Infinity,
              delay: i * 0.8,
              ease: 'linear'
            }}
          />
        ))}
      </div>

      {/* Main Container */}
      <div className={`w-full ${isOverlay ? 'max-w-4xl max-h-[92vh] overflow-y-auto' : ''} flex flex-col space-y-4 relative z-10 text-white`}>
        
        {/* Sanctuary Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <Flower2 className="w-4 h-4" />
              </div>
              <h2 className="text-base sm:text-lg font-black tracking-wider font-mono text-emerald-300 uppercase flex items-center gap-2">
                <span>Zen Sanctuary • 盆栽 & 折り紙</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-normal border border-emerald-500/30">
                  CALM-DOWN ZONE
                </span>
              </h2>
            </div>
            <p className="text-xs text-white/60 font-light mt-0.5">
              Super Puff's mindful refuge — prune comedic clutter, fold geometric washi cranes, and center your delivery cadence.
            </p>
          </div>

          {/* Top Controls: Soundscapes & Close/Dismiss */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            
            {/* Ambient Soundscape Selector */}
            <div className="flex items-center bg-black/60 p-1 rounded-xl border border-white/10 text-[10px] font-mono">
              <button
                onClick={() => {
                  setAmbientSound('bamboo');
                  playBambooClackSfx();
                }}
                className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  ambientSound === 'bamboo' && !isMuted ? 'bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-500/40' : 'text-white/40 hover:text-white'
                }`}
                title="Bamboo Water Fountain (鹿威し Shishi-odoshi)"
              >
                <span>🎋</span>
                <span className="hidden sm:inline">Bamboo</span>
              </button>
              <button
                onClick={() => {
                  setAmbientSound('bowl');
                  playSingingBowlSfx(432);
                }}
                className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  ambientSound === 'bowl' && !isMuted ? 'bg-amber-500/30 text-amber-300 font-bold border border-amber-500/40' : 'text-white/40 hover:text-white'
                }`}
                title="432Hz Tibetan Singing Bowl (鈴)"
              >
                <span>🔔</span>
                <span className="hidden sm:inline">Singing Bowl</span>
              </button>
              <button
                onClick={() => {
                  setAmbientSound('bell');
                  playTempleBellSfx();
                }}
                className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  ambientSound === 'bell' && !isMuted ? 'bg-purple-500/30 text-purple-300 font-bold border border-purple-500/40' : 'text-white/40 hover:text-white'
                }`}
                title="Temple Bell Gong (大鐘)"
              >
                <span>⛩️</span>
                <span className="hidden sm:inline">Gong</span>
              </button>
              <button
                onClick={() => setIsMuted(p => !p)}
                className={`p-1.5 rounded-lg transition-colors ml-1 ${isMuted ? 'text-red-400 hover:text-red-300' : 'text-white/60 hover:text-white'}`}
                title={isMuted ? "Unmute Sanctuary" : "Mute Soundscape"}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              title="Close Zen Sanctuary"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs: Bonsai Garden / Origami Studio / Breathing Sphere */}
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveZenTab('bonsai')}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeZenTab === 'bonsai'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-white/50 hover:text-emerald-300'
              }`}
            >
              <span>🎋</span>
              <span>Bonsai Garden (盆栽)</span>
            </button>

            <button
              onClick={() => setActiveZenTab('origami')}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeZenTab === 'origami'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-white/50 hover:text-amber-300'
              }`}
            >
              <span>🕊️</span>
              <span>Origami Studio (折り紙)</span>
            </button>

            <button
              onClick={() => setActiveZenTab('meditation')}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeZenTab === 'meditation'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                  : 'text-white/50 hover:text-teal-300'
              }`}
            >
              <span>🧘</span>
              <span>Breathing Sphere (呼吸)</span>
            </button>
          </div>

          {/* Zen Clarity Meter */}
          <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-emerald-400">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>Zen Clarity: {zenFocusLevel}%</span>
            <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-300 transition-all duration-500"
                style={{ width: `${zenFocusLevel}%` }}
              />
            </div>
          </div>
        </div>

        {/* Dynamic Tab Contents */}
        <AnimatePresence mode="wait">
          
          {/* 1. BONSAI GARDEN TAB */}
          {activeZenTab === 'bonsai' && (
            <motion.div
              key="bonsai-tab"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-4"
            >
              {/* Left Canvas: Interactive Bonsai Tree Display */}
              <div className="lg:col-span-8 bg-black/60 border border-emerald-500/30 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden min-h-[300px] sm:min-h-[340px]">
                
                {/* Background Serene Mountains Gradient Outline */}
                <div className="absolute inset-0 opacity-15 pointer-events-none flex items-end justify-center">
                  <svg viewBox="0 0 400 150" className="w-full h-36">
                    <path d="M 0 150 Q 80 50 160 150 Q 240 70 320 150 Q 380 90 400 150 Z" fill="#047857" />
                  </svg>
                </div>

                {/* Top Status & Pruning Instructions */}
                <div className="w-full flex items-center justify-between z-20 mb-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-300">
                    <Scissors className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    <span>Click wild branches to prune comedy deadwood ({prunedBranches.length}/4 pruned)</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleMistBonsai}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold flex items-center gap-1 transition-all"
                    >
                      <Droplets className="w-3 h-3 text-emerald-400" />
                      <span>Mist Foliage (葉水)</span>
                    </button>
                    <button
                      onClick={handleResetBonsai}
                      className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white border border-white/10 text-[10px]"
                      title="Reset Branches"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Main Interactive SVG Bonsai Canvas */}
                <div className="relative w-full flex items-center justify-center py-2">
                  <svg viewBox="0 0 320 260" className="w-72 sm:w-80 h-56 sm:h-64 filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.7)]">
                    <defs>
                      <linearGradient id="ceramicPotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3f3f46" />
                        <stop offset="50%" stopColor="#27272a" />
                        <stop offset="100%" stopColor="#18181b" />
                      </linearGradient>
                      <linearGradient id="trunkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#78350f" />
                        <stop offset="50%" stopColor="#92400e" />
                        <stop offset="100%" stopColor="#451a03" />
                      </linearGradient>
                      <linearGradient id="mossGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#047857" />
                      </linearGradient>
                    </defs>

                    {/* Pot Table Stand / Wood Dai (台) */}
                    <rect x="70" y="235" width="180" height="8" rx="2" fill="#1c1917" stroke="#44403c" strokeWidth="1.5" />
                    <rect x="85" y="243" width="10" height="6" fill="#1c1917" />
                    <rect x="225" y="243" width="10" height="6" fill="#1c1917" />

                    {/* Shallow Oval Ceramic Bonsai Pot */}
                    <ellipse cx="160" cy="222" rx="75" ry="14" fill="url(#ceramicPotGrad)" stroke="#71717a" strokeWidth="2" />
                    <rect x="88" y="212" width="144" height="12" rx="2" fill="#27272a" stroke="#52525b" strokeWidth="1" />
                    <ellipse cx="160" cy="212" rx="72" ry="10" fill="#291e14" />

                    {/* Rich Soil Mound & Green Moss Accents */}
                    <ellipse cx="160" cy="210" rx="68" ry="8" fill="#38220f" />
                    <ellipse cx="140" cy="209" rx="24" ry="4" fill="url(#mossGrad)" opacity="0.85" />
                    <ellipse cx="180" cy="210" rx="20" ry="3.5" fill="url(#mossGrad)" opacity="0.75" />

                    {/* Gnarled Ancient Bonsai Trunk (Different Style Paths) */}
                    {selectedBonsai === 'juniper' && (
                      <g>
                        {/* Informal Upright (Moyogi) Trunk with Natural Shari deadwood highlight */}
                        <path d="M 160 210 Q 148 160 175 125 Q 192 95 155 45" fill="none" stroke="url(#trunkGrad)" strokeWidth="16" strokeLinecap="round" />
                        {/* Jin / Shari White Deadwood streak */}
                        <path d="M 160 185 Q 152 145 170 120" fill="none" stroke="#fef3c7" strokeWidth="3.5" strokeLinecap="round" opacity="0.8" />
                      </g>
                    )}

                    {selectedBonsai === 'sakura' && (
                      <g>
                        <path d="M 160 210 Q 140 150 170 110 Q 185 80 150 40" fill="none" stroke="#573018" strokeWidth="14" strokeLinecap="round" />
                        <path d="M 155 130 Q 120 115 100 95" fill="none" stroke="#573018" strokeWidth="6" strokeLinecap="round" />
                        <path d="M 165 90 Q 205 75 220 55" fill="none" stroke="#573018" strokeWidth="5" strokeLinecap="round" />
                      </g>
                    )}

                    {selectedBonsai === 'cascading' && (
                      <g>
                        {/* Kengai Cascading dramatic plunge below pot level */}
                        <path d="M 160 210 Q 165 150 140 120 Q 95 110 80 145 Q 65 190 60 230" fill="none" stroke="url(#trunkGrad)" strokeWidth="13" strokeLinecap="round" />
                        <path d="M 140 120 Q 165 95 160 60" fill="none" stroke="url(#trunkGrad)" strokeWidth="8" strokeLinecap="round" />
                      </g>
                    )}

                    {selectedBonsai === 'maple' && (
                      <g>
                        <path d="M 160 210 Q 155 160 160 110" fill="none" stroke="#451a03" strokeWidth="15" strokeLinecap="round" />
                        <path d="M 160 110 Q 130 85 105 65" fill="none" stroke="#451a03" strokeWidth="7" strokeLinecap="round" />
                        <path d="M 160 110 Q 190 85 215 65" fill="none" stroke="#451a03" strokeWidth="7" strokeLinecap="round" />
                        <path d="M 160 110 Q 160 70 155 45" fill="none" stroke="#451a03" strokeWidth="6" strokeLinecap="round" />
                      </g>
                    )}

                    {/* Permanent Balanced Foliage Clouds (Deep Master Silhouette) */}
                    <g className="transition-all duration-700">
                      {selectedBonsai === 'sakura' ? (
                        <>
                          <ellipse cx="150" cy="40" rx="38" ry="22" fill="#fbcfe8" stroke="#f472b6" strokeWidth="1.5" opacity="0.95" />
                          <ellipse cx="100" cy="95" rx="30" ry="18" fill="#f472b6" stroke="#db2777" strokeWidth="1.5" opacity="0.9" />
                          <ellipse cx="220" cy="55" rx="28" ry="16" fill="#fbcfe8" stroke="#f472b6" strokeWidth="1.5" opacity="0.9" />
                          <ellipse cx="175" cy="75" rx="25" ry="15" fill="#f9a8d4" stroke="#ec4899" strokeWidth="1.2" />
                        </>
                      ) : selectedBonsai === 'maple' ? (
                        <>
                          <ellipse cx="105" cy="65" rx="32" ry="18" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" opacity="0.92" />
                          <ellipse cx="215" cy="65" rx="32" ry="18" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" opacity="0.92" />
                          <ellipse cx="155" cy="45" rx="35" ry="20" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1.5" opacity="0.95" />
                        </>
                      ) : selectedBonsai === 'cascading' ? (
                        <>
                          <ellipse cx="160" cy="60" rx="35" ry="18" fill="#047857" stroke="#065f46" strokeWidth="1.5" />
                          <ellipse cx="80" cy="145" rx="30" ry="16" fill="#059669" stroke="#047857" strokeWidth="1.5" />
                          <ellipse cx="60" cy="230" rx="26" ry="14" fill="#10b981" stroke="#047857" strokeWidth="1.5" />
                        </>
                      ) : (
                        <>
                          {/* Juniper Foliage Clouds */}
                          <ellipse cx="155" cy="45" rx="42" ry="22" fill="#047857" stroke="#065f46" strokeWidth="1.5" />
                          <ellipse cx="115" cy="95" rx="32" ry="16" fill="#059669" stroke="#047857" strokeWidth="1.5" />
                          <ellipse cx="205" cy="85" rx="34" ry="17" fill="#047857" stroke="#065f46" strokeWidth="1.5" />
                          <ellipse cx="180" cy="135" rx="28" ry="15" fill="#10b981" stroke="#047857" strokeWidth="1.2" />
                        </>
                      )}
                    </g>

                    {/* PRUNABLE WILD BRANCHES (Interactive Comedy Pruning mechanic) */}
                    
                    {/* Branch 1: Top-Right Overgrowth */}
                    {!prunedBranches.includes(1) && (
                      <g 
                        onClick={() => handlePruneBranch(1)}
                        className="cursor-pointer group"
                      >
                        <path d="M 155 45 Q 185 25 210 15" fill="none" stroke="#78350f" strokeWidth="3.5" strokeLinecap="round" />
                        <ellipse cx="210" cy="15" rx="14" ry="8" fill="#10b981" stroke="#34d399" strokeWidth="1.5" className="animate-pulse group-hover:fill-red-400 group-hover:stroke-red-500" />
                        <circle cx="210" cy="15" r="4" fill="#fbbf24" opacity="0.8" />
                        <text x="210" y="32" fontSize="7" fill="#fde047" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                          [Prune Fat]
                        </text>
                      </g>
                    )}

                    {/* Branch 2: Left Side Stray Twig */}
                    {!prunedBranches.includes(2) && (
                      <g 
                        onClick={() => handlePruneBranch(2)}
                        className="cursor-pointer group"
                      >
                        <path d="M 115 95 Q 80 85 60 80" fill="none" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
                        <ellipse cx="60" cy="80" rx="13" ry="7" fill="#10b981" stroke="#34d399" strokeWidth="1.5" className="animate-pulse group-hover:fill-red-400 group-hover:stroke-red-500" />
                        <text x="60" y="96" fontSize="7" fill="#fde047" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                          [Cut Syllables]
                        </text>
                      </g>
                    )}

                    {/* Branch 3: Lower Right Awkward Tangle */}
                    {!prunedBranches.includes(3) && (
                      <g 
                        onClick={() => handlePruneBranch(3)}
                        className="cursor-pointer group"
                      >
                        <path d="M 180 135 Q 220 145 245 150" fill="none" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
                        <ellipse cx="245" cy="150" rx="14" ry="8" fill="#10b981" stroke="#34d399" strokeWidth="1.5" className="animate-pulse group-hover:fill-red-400 group-hover:stroke-red-500" />
                        <text x="245" y="166" fontSize="7" fill="#fde047" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                          [Drop Setup]
                        </text>
                      </g>
                    )}

                    {/* Branch 4: Far Top Wild Sprout */}
                    {!prunedBranches.includes(4) && (
                      <g 
                        onClick={() => handlePruneBranch(4)}
                        className="cursor-pointer group"
                      >
                        <path d="M 155 45 Q 145 20 130 -5" fill="none" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
                        <ellipse cx="130" cy="-5" rx="12" ry="7" fill="#10b981" stroke="#34d399" strokeWidth="1.5" className="animate-pulse group-hover:fill-red-400 group-hover:stroke-red-500" />
                        <text x="130" y="10" fontSize="7" fill="#fde047" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                          [Snip Filler]
                        </text>
                      </g>
                    )}

                    {/* Misting Spray Water Droplets Particles Effect */}
                    {mistActive && (
                      <g className="animate-in fade-in duration-200">
                        {[...Array(16)].map((_, i) => (
                          <circle
                            key={i}
                            cx={100 + (i * 12) % 120}
                            cy={30 + (i * 14) % 130}
                            r={1.5 + (i % 3)}
                            fill="#67e8f9"
                            opacity={0.8}
                            className="animate-ping"
                          />
                        ))}
                      </g>
                    )}
                  </svg>
                </div>

                {/* Bottom Bonsai Metadata & Zen Quote */}
                <div className="w-full flex items-center justify-between mt-2 pt-2 border-t border-white/10 text-[10px] font-mono text-white/50">
                  <span>Style: {selectedBonsai.toUpperCase()} ({selectedBonsai === 'juniper' ? '模樹 杜松' : selectedBonsai === 'sakura' ? '桜 盆栽' : selectedBonsai === 'cascading' ? '懸崖 赤松' : '紅葉 盆栽'})</span>
                  <span className="text-emerald-400 font-bold">Total Prunes: {totalPrunesCount} cuts</span>
                </div>
              </div>

              {/* Right Panel: Bonsai Style Selection & Sentei Comedy Philosophy */}
              <div className="lg:col-span-4 flex flex-col space-y-3">
                
                {/* Bonsai Cultivar Selectors */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                  <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold mb-2 flex items-center gap-1">
                    <Flower2 className="w-3.5 h-3.5" />
                    <span>Select Master Bonsai</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'juniper', label: 'Juniper (杜松)', desc: 'Gnarled Moyogi', icon: '🌲' },
                      { id: 'sakura', label: 'Sakura (桜)', desc: 'Cherry Blossom', icon: '🌸' },
                      { id: 'cascading', label: 'Cascading (懸崖)', desc: 'Alpine Waterfall', icon: '🌿' },
                      { id: 'maple', label: 'Maple (紅葉)', desc: 'Scarlet Leaves', icon: '🍁' },
                    ].map(b => (
                      <button
                        key={b.id}
                        onClick={() => {
                          setSelectedBonsai(b.id as BonsaiStyle);
                          handleResetBonsai();
                        }}
                        className={`p-2 rounded-lg border text-left transition-all ${
                          selectedBonsai === b.id
                            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200 shadow-sm'
                            : 'bg-black/40 border-white/10 text-white/60 hover:text-white hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold text-xs">
                          <span>{b.icon}</span>
                          <span>{b.label}</span>
                        </div>
                        <div className="text-[9px] text-white/40 font-mono mt-0.5">{b.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sentei Pruning Theory Card */}
                <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] font-mono text-emerald-300 uppercase tracking-wider font-bold mb-1.5 flex items-center gap-1">
                      <Scissors className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Sentei Comedy Philosophy (剪定笑学)</span>
                    </div>
                    <p className="text-xs text-white/80 font-light leading-relaxed">
                      "In Japanese bonsai (盆栽), you do not add branches to create beauty — you remove deadwood so the light reaches the inner core. In stand-up, prune every adjective that doesn't trigger a laugh."
                    </p>
                  </div>
                  
                  <div className="mt-3 pt-2 border-t border-emerald-500/20 flex items-center justify-between text-[10px] font-mono text-emerald-400">
                    <span>Terpene Pairing:</span>
                    <span className="font-bold text-emerald-300">α-Pinene (Sharp Focus)</span>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* 2. ORIGAMI STUDIO TAB */}
          {activeZenTab === 'origami' && (
            <motion.div
              key="origami-tab"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-4"
            >
              {/* Left Canvas: Interactive Origami Folding Model Display */}
              <div className="lg:col-span-8 bg-black/60 border border-amber-500/30 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden min-h-[300px] sm:min-h-[340px]">
                
                {/* Washi Pattern Watermark */}
                <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
                  <div className="text-[120px] font-black font-mono">折紙</div>
                </div>

                {/* Model Title & Wing Flap Toggle */}
                <div className="w-full flex items-center justify-between z-20 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-amber-300 font-mono">
                      {selectedOrigami === 'crane' && 'Orizuru (折り鶴 - Sacred Crane)'}
                      {selectedOrigami === 'dragon' && 'Ryū (折り竜 - Cosmic Origami Dragon)'}
                      {selectedOrigami === 'lotus' && 'Hasu (折り蓮 - Blooming Lotus)'}
                      {selectedOrigami === 'helmet' && 'Kabuto (折り兜 - Samurai Crest)'}
                      {selectedOrigami === 'star' && 'Shuriken (折り手裏剣 - Wind Star)'}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono border border-amber-400/30">
                      Step {foldingStep + 1}/4
                    </span>
                  </div>

                  {selectedOrigami === 'crane' && foldingStep === 3 && (
                    <button
                      onClick={() => setIsFlappingWings(p => !p)}
                      className="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold flex items-center gap-1 transition-all"
                    >
                      <Wind className="w-3 h-3 text-amber-400" />
                      <span>{isFlappingWings ? 'Rest Wings' : 'Flap Wings'}</span>
                    </button>
                  )}
                </div>

                {/* SVG Origami Canvas with Geometric Washi Facets */}
                <div className="relative w-full flex items-center justify-center py-4">
                  <svg viewBox="0 0 300 240" className="w-64 sm:w-72 h-52 sm:h-60 filter drop-shadow-[0_12px_30px_rgba(0,0,0,0.8)]">
                    <defs>
                      {/* Washi Pattern Fills */}
                      <linearGradient id="washiGold" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fef08a" />
                        <stop offset="50%" stopColor="#fbbf24" />
                        <stop offset="100%" stopColor="#d97706" />
                      </linearGradient>

                      <linearGradient id="washiSakura" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fdf2f8" />
                        <stop offset="50%" stopColor="#f472b6" />
                        <stop offset="100%" stopColor="#db2777" />
                      </linearGradient>

                      <linearGradient id="washiIndigo" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#e0e7ff" />
                        <stop offset="50%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#312e81" />
                      </linearGradient>

                      <linearGradient id="washiJade" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ecfdf5" />
                        <stop offset="50%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#064e3b" />
                      </linearGradient>

                      <linearGradient id="washiObsidian" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#52525b" />
                        <stop offset="50%" stopColor="#27272a" />
                        <stop offset="100%" stopColor="#09090b" />
                      </linearGradient>
                    </defs>

                    {/* Selection of Active Washi Gradient Fill */}
                    {(() => {
                      const grad = washiPattern === 'gold' ? 'url(#washiGold)' 
                        : washiPattern === 'sakura' ? 'url(#washiSakura)' 
                        : washiPattern === 'indigo' ? 'url(#washiIndigo)' 
                        : washiPattern === 'jade' ? 'url(#washiJade)' 
                        : 'url(#washiObsidian)';
                      
                      const strokeCol = washiPattern === 'obsidian' ? '#a1a1aa' : washiPattern === 'gold' ? '#78350f' : '#ffffff';

                      // STEP 0: Flat Square Washi Sheet
                      if (foldingStep === 0) {
                        return (
                          <g transform="translate(75, 45)">
                            <rect x="0" y="0" width="150" height="150" fill={grad} stroke={strokeCol} strokeWidth="2" rx="2" />
                            {/* Grid / Watermark */}
                            <line x1="0" y1="0" x2="150" y2="150" stroke={strokeCol} strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
                            <line x1="150" y1="0" x2="0" y2="150" stroke={strokeCol} strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
                            <circle cx="75" cy="75" r="3" fill="#ffffff" />
                            <text x="75" y="88" fontSize="10" fill="#ffffff" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                              和紙 (Washi Paper)
                            </text>
                          </g>
                        );
                      }

                      // STEP 1: Valley and Mountain Creases
                      if (foldingStep === 1) {
                        return (
                          <g transform="translate(150, 120) rotate(45)">
                            <polygon points="-60,-60 60,-60 60,60 -60,60" fill={grad} stroke={strokeCol} strokeWidth="2" />
                            <polygon points="0,-60 0,60 60,0" fill="#ffffff" opacity="0.25" />
                            <line x1="-60" y1="0" x2="60" y2="0" stroke={strokeCol} strokeWidth="1.5" strokeDasharray="5 3" />
                            <line x1="0" y1="-60" x2="0" y2="60" stroke={strokeCol} strokeWidth="1.5" strokeDasharray="5 3" />
                          </g>
                        );
                      }

                      // STEP 2: Bird Base (Tsuru no Kihonkei)
                      if (foldingStep === 2) {
                        return (
                          <g transform="translate(150, 120)">
                            <polygon points="0,-80 50,0 0,80 -50,0" fill={grad} stroke={strokeCol} strokeWidth="2" />
                            <polygon points="0,-80 0,80 50,0" fill="#ffffff" opacity="0.2" />
                            <polygon points="0,-80 -25,-10 0,0" fill="#000000" opacity="0.15" />
                            <polygon points="0,-80 25,-10 0,0" fill="#ffffff" opacity="0.3" />
                          </g>
                        );
                      }

                      // STEP 3: Completed Masterpiece Models
                      if (selectedOrigami === 'crane') {
                        return (
                          <motion.g 
                            transform="translate(150, 120)"
                            animate={isFlappingWings ? {
                              scaleY: [1, 0.88, 1],
                              y: [0, -4, 0]
                            } : {}}
                            transition={{ type: 'tween', duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                          >
                            {/* Main Body Diamond */}
                            <polygon points="0,-50 25,0 0,40 -25,0" fill={grad} stroke={strokeCol} strokeWidth="1.5" />
                            
                            {/* Left Wing Facet */}
                            <motion.polygon 
                              points="0,-30 -110,-60 -25,0" 
                              fill={grad} 
                              stroke={strokeCol} 
                              strokeWidth="1.5"
                              animate={isFlappingWings ? { rotate: [0, -5, 0] } : {}}
                              transition={{ type: 'tween', duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                            />
                            {/* Left Wing Under-Shade */}
                            <polygon points="0,-30 -80,-40 -25,0" fill="#ffffff" opacity="0.25" />

                            {/* Right Wing Facet */}
                            <motion.polygon 
                              points="0,-30 110,-60 25,0" 
                              fill={grad} 
                              stroke={strokeCol} 
                              strokeWidth="1.5"
                              animate={isFlappingWings ? { rotate: [0, 5, 0] } : {}}
                              transition={{ type: 'tween', duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                            />
                            {/* Right Wing Under-Shade */}
                            <polygon points="0,-30 80,-40 25,0" fill="#ffffff" opacity="0.25" />

                            {/* Long Slender Neck & Head */}
                            <polygon points="0,-30 -35,50 -25,55 -5,15" fill={grad} stroke={strokeCol} strokeWidth="1.5" />
                            {/* Head beak crease */}
                            <polygon points="-35,50 -48,45 -33,42" fill="#d97706" stroke={strokeCol} strokeWidth="1" />

                            {/* Tail Crest */}
                            <polygon points="0,-30 35,55 25,60 5,15" fill={grad} stroke={strokeCol} strokeWidth="1.5" />
                          </motion.g>
                        );
                      }

                      if (selectedOrigami === 'dragon') {
                        return (
                          <g transform="translate(150, 120)">
                            {/* Origami Dragon Body */}
                            <polygon points="0,-60 35,-10 0,50 -35,-10" fill={grad} stroke={strokeCol} strokeWidth="1.5" />
                            {/* Dragon Angular Wings */}
                            <polygon points="0,-40 -95,-70 -35,-10" fill={grad} stroke={strokeCol} strokeWidth="1.5" />
                            <polygon points="-95,-70 -120,-30 -60,-20" fill={grad} stroke={strokeCol} strokeWidth="1.2" opacity="0.85" />
                            <polygon points="0,-40 95,-70 35,-10" fill={grad} stroke={strokeCol} strokeWidth="1.5" />
                            <polygon points="95,-70 120,-30 60,-20" fill={grad} stroke={strokeCol} strokeWidth="1.2" opacity="0.85" />
                            {/* Dragon Horned Head */}
                            <polygon points="0,-60 -20,-95 -5,-80 0,-105 10,-80 20,-95 0,-60" fill={grad} stroke={strokeCol} strokeWidth="1.5" />
                            {/* Tail Segments */}
                            <polygon points="0,50 15,80 0,105 -15,80" fill={grad} stroke={strokeCol} strokeWidth="1.5" />
                          </g>
                        );
                      }

                      if (selectedOrigami === 'lotus') {
                        return (
                          <g transform="translate(150, 130)">
                            {/* Layered Lotus Petals */}
                            <ellipse cx="0" cy="30" rx="90" ry="15" fill="#047857" opacity="0.4" />
                            {/* Outer Petals */}
                            <polygon points="0,20 -70,-20 -40,-60 0,-30" fill={grad} stroke={strokeCol} strokeWidth="1.2" />
                            <polygon points="0,20 70,-20 40,-60 0,-30" fill={grad} stroke={strokeCol} strokeWidth="1.2" />
                            {/* Center Blooming Petals */}
                            <polygon points="0,20 -35,-65 0,-90 35,-65" fill={grad} stroke={strokeCol} strokeWidth="1.5" />
                            <polygon points="0,20 0,-90 20,-50" fill="#ffffff" opacity="0.3" />
                          </g>
                        );
                      }

                      // Kabuto / Shuriken default
                      return (
                        <g transform="translate(150, 120)">
                          <polygon points="0,-70 70,0 0,70 -70,0" fill={grad} stroke={strokeCol} strokeWidth="2" />
                          {/* Samurai Horn Crests */}
                          <polygon points="0,-70 60,-95 30,-50" fill="#fbbf24" stroke="#78350f" strokeWidth="1.5" />
                          <polygon points="0,-70 -60,-95 -30,-50" fill="#fbbf24" stroke="#78350f" strokeWidth="1.5" />
                        </g>
                      );
                    })()}
                  </svg>
                </div>

                {/* Interactive Folding Step Slider Controls */}
                <div className="w-full mt-2 pt-2 border-t border-white/10 flex flex-col space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-white/60">
                    <span>Crease Progression:</span>
                    <span className="text-amber-400 font-bold">
                      {foldingStep === 0 && '1. Raw Washi Paper'}
                      {foldingStep === 1 && '2. Valley & Mountain Folds'}
                      {foldingStep === 2 && '3. Geometric Diamond Base'}
                      {foldingStep === 3 && '4. Masterpiece Form Completed'}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5">
                    {['1. Flat Square', '2. Creases', '3. Base', '4. Form'].map((label, idx) => (
                      <button
                        key={label}
                        onClick={() => handleOrigamiStepChange(idx)}
                        className={`py-1.5 px-2 rounded-lg font-mono text-[10px] font-bold border transition-all ${
                          foldingStep === idx
                            ? 'bg-amber-500/30 text-amber-200 border-amber-400 shadow-sm'
                            : 'bg-black/40 border-white/10 text-white/40 hover:text-white'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Panel: Origami Model Selectors & Washi Paper Patterns */}
              <div className="lg:col-span-4 flex flex-col space-y-3">
                
                {/* Model Selector */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                  <div className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold mb-2 flex items-center gap-1">
                    <Feather className="w-3.5 h-3.5" />
                    <span>Select Origami Model</span>
                  </div>
                  <div className="grid grid-cols-1 gap-1.5">
                    {[
                      { id: 'crane', label: 'Orizuru (折り鶴)', desc: 'The 1,000 Cranes of Timing', icon: '🕊️' },
                      { id: 'dragon', label: 'Ryū (折り竜)', desc: 'Super Puff Geometric Dragon', icon: '🐉' },
                      { id: 'lotus', label: 'Hasu (折り蓮)', desc: 'Zen Pond Blooming Lotus', icon: '🪷' },
                      { id: 'helmet', label: 'Kabuto (折り兜)', desc: 'Samurai Crest of Delivery', icon: '⚔️' },
                    ].map(m => (
                      <button
                        key={m.id}
                        onClick={() => {
                          setSelectedOrigami(m.id as OrigamiModel);
                          setFoldingStep(3);
                          playPaperCreaseSfx();
                        }}
                        className={`p-2 rounded-lg border text-left flex items-center justify-between transition-all ${
                          selectedOrigami === m.id
                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-200'
                            : 'bg-black/40 border-white/10 text-white/60 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{m.icon}</span>
                          <div>
                            <div className="font-bold text-xs">{m.label}</div>
                            <div className="text-[9px] text-white/40 font-mono">{m.desc}</div>
                          </div>
                        </div>
                        {selectedOrigami === m.id && (
                          <span className="text-[10px] text-amber-400 font-mono">Active</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Washi Paper Sheet Pattern Selector */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                  <div className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold mb-2">
                    Washi Paper Texture (和紙模様)
                  </div>
                  <div className="flex items-center justify-between gap-1.5">
                    {[
                      { id: 'gold', label: 'Gold Leaf', color: 'bg-amber-400' },
                      { id: 'sakura', label: 'Sakura Pink', color: 'bg-pink-400' },
                      { id: 'indigo', label: 'Shibori Indigo', color: 'bg-indigo-500' },
                      { id: 'jade', label: 'Bamboo Jade', color: 'bg-emerald-500' },
                      { id: 'obsidian', label: 'Obsidian Noir', color: 'bg-zinc-800' },
                    ].map(w => (
                      <button
                        key={w.id}
                        onClick={() => {
                          setWashiPattern(w.id as WashiPattern);
                          playPaperCreaseSfx();
                        }}
                        className={`w-8 h-8 rounded-lg ${w.color} border-2 transition-all ${
                          washiPattern === w.id ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                        title={w.label}
                      />
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* 3. BREATHING & MEDITATION SPHERE TAB */}
          {activeZenTab === 'meditation' && (
            <motion.div
              key="meditation-tab"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center justify-center p-6 bg-black/60 border border-teal-500/30 rounded-2xl relative min-h-[320px]"
            >
              <div className="text-center mb-6">
                <h3 className="text-base font-bold font-mono text-teal-300 uppercase tracking-wider">
                  Pranayama 4-7-8 Comedy Timing Pacer
                </h3>
                <p className="text-xs text-white/60 font-light mt-1">
                  Synchronize your nervous system with Dragon 9's 54-minute fluid geometry.
                </p>
              </div>

              {/* Pulsing Breathing Sphere */}
              <div className="relative w-48 h-48 flex items-center justify-center">
                {/* Outer Glow Halo */}
                <motion.div 
                  className="absolute inset-0 rounded-full bg-gradient-to-tr from-teal-500/30 via-emerald-500/20 to-cyan-500/30 blur-xl"
                  animate={{
                    scale: breathPhase === 'inhale' ? [1, 1.4] : breathPhase === 'hold' ? 1.4 : [1.4, 1],
                    opacity: breathPhase === 'inhale' ? [0.4, 0.8] : breathPhase === 'hold' ? 0.8 : [0.8, 0.4]
                  }}
                  transition={{ 
                    duration: breathPhase === 'inhale' ? 4 : breathPhase === 'hold' ? 7 : 8,
                    ease: 'easeInOut' 
                  }}
                />

                {/* Central Ring */}
                <motion.div 
                  className="w-36 h-36 rounded-full border-2 border-teal-400/80 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center shadow-[0_0_30px_rgba(20,184,166,0.4)]"
                  animate={{
                    scale: breathPhase === 'inhale' ? [1, 1.25] : breathPhase === 'hold' ? 1.25 : [1.25, 1],
                  }}
                  transition={{ 
                    duration: breathPhase === 'inhale' ? 4 : breathPhase === 'hold' ? 7 : 8,
                    ease: 'easeInOut' 
                  }}
                >
                  <span className="text-xs font-mono font-black uppercase tracking-widest text-teal-300">
                    {breathPhase === 'inhale' && '吸う (INHALE)'}
                    {breathPhase === 'hold' && '止める (HOLD)'}
                    {breathPhase === 'exhale' && '吐く (EXHALE)'}
                  </span>
                  <span className="text-3xl font-black font-mono text-white mt-1">
                    {breathTimer}s
                  </span>
                </motion.div>
              </div>

              <div className="mt-6 flex items-center gap-4 text-xs font-mono text-white/50">
                <span className={breathPhase === 'inhale' ? 'text-teal-300 font-bold' : ''}>4s Inhale</span>
                <span>•</span>
                <span className={breathPhase === 'hold' ? 'text-teal-300 font-bold' : ''}>7s Hold (Timing Void)</span>
                <span>•</span>
                <span className={breathPhase === 'exhale' ? 'text-teal-300 font-bold' : ''}>8s Exhale (Punchline Drop)</span>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* Bottom Rotating Bilingual Zen Wisdom Banner */}
        <div className="p-3 rounded-xl bg-black/50 border border-white/10 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-start sm:items-center gap-2">
            <div className="p-1 rounded-md bg-amber-500/20 text-amber-400 mt-0.5 sm:mt-0">
              <Crown className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-xs text-amber-200 font-medium font-sans">
                {ZEN_WISDOMS[wisdomIndex].ja}
              </div>
              <div className="text-[10px] text-white/60 font-light italic">
                "{ZEN_WISDOMS[wisdomIndex].en}" — <span className="text-amber-400/80">{ZEN_WISDOMS[wisdomIndex].author}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 self-end sm:self-center text-[10px] font-mono text-white/30">
            <span>{wisdomIndex + 1}/{ZEN_WISDOMS.length}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
