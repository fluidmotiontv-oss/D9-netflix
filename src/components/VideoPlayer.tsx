import React, { useState, useRef, useEffect, MouseEvent } from 'react';
import { 
  Play, 
  Pause, 
  Maximize, 
  Volume2, 
  VolumeX, 
  Settings, 
  Share2, 
  Twitter, 
  MessageSquare, 
  Check, 
  Mic, 
  Activity, 
  ShieldAlert, 
  Sparkles,
  Zap,
  Layers,
  Video,
  Smile
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import CrowdVibeHeatmap from './CrowdVibeHeatmap';
import AnimatedDragonPerformer from './AnimatedDragonPerformer';
import PreviewExportOverlay from './export/PreviewExportOverlay';
import CrowdReactionOverlay, { ActiveCrowdParticle } from './CrowdReactionOverlay';
import CrowdReaction from './CrowdReaction';
import { HeckleItem } from '../audio/hecklerAudio';
import { CrowdReactionItem } from '../audio/crowdAudio';
import { SessionTimelineEvent } from '../utils/sessionLog';
import { 
  StageEmotesOverlay, 
  ActiveEmote, 
  AUTOMATIC_EMOTE_BEATS, 
  PRESET_EMOTES 
} from './StageEmotesOverlay';

interface VideoPlayerProps {
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  currentAct: any;
  onActComplete: () => void;
  activeHeckle?: HeckleItem | null;
  roastDialogue?: string | null;
  isRoasting?: boolean;
  laserPos?: { x: number; y: number } | null;
  setLaserPos?: (pos: { x: number; y: number } | null) => void;
  hasTomatoSplat?: boolean;
  setHasTomatoSplat?: (splat: boolean) => void;
  onOpenHecklerRack?: () => void;
  primaryColor?: string;
  accentColor?: string;
  comedyXp?: number;
  comedyRankTitle?: string;
  activeStrainName?: string;
  mode?: 'stage' | 'workshop';
  isPreviewExportMode?: boolean;
  setIsPreviewExportMode?: (val: boolean | ((prev: boolean) => boolean)) => void;
  onCommitExport?: () => void;
  crowdParticles?: ActiveCrowdParticle[];
  activeCrowdReaction?: CrowdReactionItem | null;
  onTriggerCrowdReaction?: (reaction: CrowdReactionItem) => void;
  onOpenCrowdRack?: () => void;
  isBrutalMode?: boolean;
  timeline?: SessionTimelineEvent[];
  onProgressChange?: (progress: number) => void;
}

export default function VideoPlayer({ 
  isPlaying, 
  setIsPlaying, 
  currentAct, 
  onActComplete,
  activeHeckle = null,
  roastDialogue = null,
  isRoasting = false,
  laserPos = null,
  setLaserPos,
  hasTomatoSplat = false,
  setHasTomatoSplat,
  onOpenHecklerRack,
  primaryColor = '#ea580c',
  accentColor = '#f59e0b',
  comedyXp = 450,
  comedyRankTitle = 'Timing Alchemist',
  activeStrainName = 'Cosmic OG (31.4% THC)',
  mode = 'stage',
  isPreviewExportMode: externalPreviewExport,
  setIsPreviewExportMode: externalSetPreviewExport,
  onCommitExport,
  crowdParticles = [],
  activeCrowdReaction = null,
  onTriggerCrowdReaction,
  onOpenCrowdRack,
  isBrutalMode = false,
  timeline = [],
  onProgressChange,
}: VideoPlayerProps) {
  const [progress, setProgress] = useState(0);
  const [muted, setMuted] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showCommentary, setShowCommentary] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showCrowdBar, setShowCrowdBar] = useState(true);
  const [internalPreviewExport, setInternalPreviewExport] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isThrowingTomato, setIsThrowingTomato] = useState(false);
  const [cameraAngle, setCameraAngle] = useState<'wide' | 'closeup' | 'crowd' | 'security'>('wide');
  const [isCameraSwitching, setIsCameraSwitching] = useState(false);

  // Floating Emote System States
  const [activeEmotes, setActiveEmotes] = useState<ActiveEmote[]>([]);
  const [showEmoteDeck, setShowEmoteDeck] = useState(false);
  const [triggeredBeats, setTriggeredBeats] = useState<Record<string, boolean>>({});

  const triggerEmote = (
    type: ActiveEmote['type'], 
    customPhrase?: string, 
    customLabel?: string, 
    customEmoji?: string, 
    customX?: number, 
    customY?: number
  ) => {
    const preset = PRESET_EMOTES.find(p => p.type === type);
    if (!preset) return;

    const emoji = customEmoji || preset.emoji;
    const label = customLabel || preset.label;
    const phrase = customPhrase || preset.phrase;
    
    // Position slightly randomized around middle-upper section of stage
    const x = customX !== undefined ? customX : (35 + Math.random() * 30); // 35% to 65% width
    const y = customY !== undefined ? customY : (20 + Math.random() * 15); // 20% to 35% height

    const newEmote: ActiveEmote = {
      id: `emote-${Date.now()}-${Math.random()}`,
      type,
      emoji,
      label,
      phrase,
      x,
      y
    };

    // Limit to max 3 concurrent emotes to prevent UI clutter
    setActiveEmotes(prev => [...prev.slice(-2), newEmote]);

    // Automatically remove after 5.5 seconds
    setTimeout(() => {
      setActiveEmotes(prev => prev.filter(e => e.id !== newEmote.id));
    }, 5500);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      
      const key = e.key.toLowerCase();
      if (key === 'e') {
        setShowEmoteDeck(prev => !prev);
      } else if (showEmoteDeck) {
        const index = parseInt(e.key) - 1;
        if (index >= 0 && index < PRESET_EMOTES.length) {
          const preset = PRESET_EMOTES[index];
          triggerEmote(preset.type);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showEmoteDeck]);

  // Reset triggered beats when act changes
  useEffect(() => {
    setTriggeredBeats({});
  }, [currentAct.id]);

  // Reset triggered beats when progress goes back to start
  useEffect(() => {
    if (progress < 5) {
      setTriggeredBeats({});
    }
  }, [progress]);

  // Automatic timed emote cues monitoring effect
  useEffect(() => {
    if (!isPlaying) return;

    const actId = currentAct.id || 'act-1';
    const beatsForAct = AUTOMATIC_EMOTE_BEATS[actId] || AUTOMATIC_EMOTE_BEATS['act-1'];

    beatsForAct.forEach((beat) => {
      const beatKey = `${actId}-${beat.type}-${beat.minProgress}`;
      if (progress >= beat.minProgress && progress <= beat.maxProgress) {
        if (!triggeredBeats[beatKey]) {
          setTriggeredBeats(prev => ({ ...prev, [beatKey]: true }));
          triggerEmote(beat.type, beat.phrase, beat.label, beat.emoji, beat.x, beat.y);
        }
      }
    });
  }, [progress, isPlaying, currentAct.id, triggeredBeats]);

  const handleCameraChange = (angle: 'wide' | 'closeup' | 'crowd' | 'security') => {
    if (angle === cameraAngle) return;
    setIsCameraSwitching(true);
    setCameraAngle(angle);
    setTimeout(() => {
      setIsCameraSwitching(false);
    }, 300);
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isPreviewExport = externalPreviewExport !== undefined ? externalPreviewExport : internalPreviewExport;
  const setPreviewExport = externalSetPreviewExport || setInternalPreviewExport;

  // Trigger tomato throw projectile animation when a tomato heckle occurs
  useEffect(() => {
    if (activeHeckle?.id === 'tomato') {
      setIsThrowingTomato(true);
      const timer = setTimeout(() => {
        setIsThrowingTomato(false);
        if (setHasTomatoSplat) setHasTomatoSplat(true);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [activeHeckle, setHasTomatoSplat]);

  // Handle stage mouse move for laser pointer tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeHeckle?.id === 'laser' && containerRef.current && setLaserPos) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setLaserPos({ x, y });
    }
  };

  // Sync state with HTML5 Video element if it exists
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, currentAct]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = muted;
    }
  }, [muted]);

  // Fake progress for placeholder, real progress for video
  useEffect(() => {
    let interval: any;
    if (isPlaying && !currentAct.videoUrl) {
      interval = setInterval(() => {
        setProgress(p => {
          const next = p + 0.2; // faster fake progress for demo
          return next >= 100 ? 100 : next;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentAct]);

  // Handle completion for fake progress
  useEffect(() => {
    if (progress >= 100 && isPlaying && !currentAct.videoUrl) {
      setIsPlaying(false);
      setProgress(0);
      onActComplete();
    }
  }, [progress, isPlaying, currentAct, setIsPlaying, onActComplete]);

  // Sync progress updates to parent
  useEffect(() => {
    if (onProgressChange) {
      onProgressChange(progress);
    }
  }, [progress, onProgressChange]);

  const handleTimeUpdate = () => {
    if (videoRef.current && currentAct.videoUrl) {
      const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(p);
    }
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  const shareText = `Watching Dragon 9's "${currentAct.title}" on Nutflox!\n\n"Time is linear, but this joke is 4D." 🐉🚬\n\n`;
  const shareUrl = window.location.href;

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
    setShowShareMenu(false);
  };

  const shareToDiscord = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setShowShareMenu(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div 
      ref={containerRef} 
      onMouseMove={handleMouseMove}
      className="w-full h-full relative bg-black group flex flex-col justify-center items-center overflow-hidden select-none"
    >
      
      {/* Animated Dragon Comedian Stage Layer */}
      <AnimatedDragonPerformer
        isPlaying={isPlaying}
        activeHeckle={activeHeckle}
        roastDialogue={roastDialogue}
        isRoasting={isRoasting}
        laserPos={laserPos}
        hasTomatoSplat={hasTomatoSplat}
        onClearTomato={() => setHasTomatoSplat && setHasTomatoSplat(false)}
        primaryColor={primaryColor}
        accentColor={accentColor}
        comedyXp={comedyXp}
        comedyRankTitle={comedyRankTitle}
        activeStrainName={activeStrainName}
        mode={mode}
        cameraAngle={cameraAngle}
        activeEmote={activeEmotes.length > 0 ? activeEmotes[activeEmotes.length - 1].type : null}
        isBrutalMode={isBrutalMode}
      />

      {/* Floating Emotes Overlay */}
      <StageEmotesOverlay 
        activeEmotes={activeEmotes} 
        onRemoveEmote={(id) => setActiveEmotes(prev => prev.filter(e => e.id !== id))}
      />

      {/* Throwing Tomato Flying Projectile Animation */}
      <AnimatePresence>
        {isThrowingTomato && (
          <motion.div
            initial={{ scale: 2.8, x: 250, y: 220, opacity: 0.9, rotate: 0 }}
            animate={{ scale: 0.9, x: 0, y: 0, opacity: 1, rotate: 360 }}
            exit={{ scale: 0.2, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeIn' }}
            className="absolute z-50 pointer-events-none"
          >
            <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(220,38,38,0.8)] border-2 border-amber-300">
              <span className="text-2xl">🍅</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentAct.id}
          initial={{ opacity: 0, filter: 'blur(16px) contrast(200%) grayscale(100%) brightness(180%)', scale: 1.05 }}
          animate={{ opacity: 1, filter: 'blur(0px) contrast(100%) grayscale(0%) brightness(100%)', scale: 1 }}
          exit={{ opacity: 0, filter: 'blur(16px) contrast(200%) grayscale(100%) brightness(180%)', scale: 0.95 }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none"
        >
          {currentAct.videoUrl ? (
            <>
              <video
                ref={videoRef}
                src={currentAct.videoUrl}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => {
                  setIsPlaying(false);
                  onActComplete();
                }}
                className={`w-full h-full object-cover opacity-80 mix-blend-screen pointer-events-auto transition-all duration-700 ${
                  cameraAngle === 'closeup' 
                    ? 'scale-[1.3]' 
                    : cameraAngle === 'crowd' 
                      ? 'scale-[0.85]' 
                      : 'scale-100'
                }`}
                playsInline
              />
              {/* Stylized Cyberpunk Tint over the video */}
              <div className="absolute inset-0 bg-orange-900/20 mix-blend-color pointer-events-none" />
            </>
          ) : currentAct.status === 'generating_video' ? (
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-auto bg-black/80">
              <div className="text-center transition-all duration-1000 scale-100 opacity-80 flex flex-col items-center">
                <div className="w-[400px] h-[400px] bg-gradient-to-t from-blue-600 to-transparent rounded-full blur-[80px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 animate-pulse" />
                <h2 className="text-4xl font-black text-white uppercase tracking-[0.5em] relative z-10 mix-blend-overlay">
                  Generating Video
                </h2>
                <div className="mt-8 flex items-center space-x-3 relative z-10 text-blue-400">
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <span className="font-mono text-sm tracking-widest uppercase">Rendering Veo 3.1</span>
                </div>
              </div>
            </div>
          ) : null}
        </motion.div>
      </AnimatePresence>

      {/* Floating High-Tech Camera Selector Deck */}
      <div className="absolute top-4 right-4 z-40 flex items-center bg-black/75 backdrop-blur-md rounded-xl border border-white/10 p-1 pointer-events-auto transition-opacity duration-300 shadow-xl">
        <div className="flex items-center gap-1">
          <div className="px-2 py-1 text-[8px] font-mono text-white/40 uppercase tracking-widest border-r border-white/5 font-black flex items-center gap-1 shrink-0">
            <Video className="w-3 h-3 text-orange-500 animate-pulse" />
            <span className="hidden sm:inline">CAMS</span>
          </div>
          {(['wide', 'closeup', 'crowd', 'security'] as const).map((angle) => {
            const isActive = cameraAngle === angle;
            const label = 
              angle === 'wide' 
                ? 'CAM-1 WIDE' 
                : angle === 'closeup' 
                  ? 'CAM-2 TIGHT' 
                  : angle === 'crowd' 
                    ? 'CAM-3 REVERSE' 
                    : 'CAM-4 CCTV';
            const iconStr = 
              angle === 'wide' 
                ? '🎥' 
                : angle === 'closeup' 
                  ? '🔍' 
                  : angle === 'crowd' 
                    ? '👥' 
                    : '📟';

            return (
              <button
                key={angle}
                onClick={() => handleCameraChange(angle)}
                className={`px-2 py-1 rounded-lg text-[9px] font-mono font-bold transition-all flex items-center gap-1 ${
                  isActive
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30 shadow-[0_0_12px_rgba(249,115,22,0.2)]'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
                title={`Switch stage angle to ${label}`}
              >
                <span>{iconStr}</span>
                <span className="hidden md:inline">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Analog Camera Switch Glitch Static Flicker Layer */}
      <AnimatePresence>
        {isCameraSwitching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.95 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="absolute inset-0 z-50 bg-slate-950 pointer-events-none flex flex-col items-center justify-center"
          >
            {/* Retro White/Gray Dynamic Noise Pattern */}
            <div 
              className="absolute inset-0 opacity-[0.25]"
              style={{
                background: 'radial-gradient(circle, transparent 20%, black 120%), repeating-linear-gradient(rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.15) 2px, transparent 2px, transparent 4px)',
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
              }}
            />
            {/* Director's Cut Glitch Title */}
            <div className="z-10 font-mono text-[10px] text-orange-500 font-bold tracking-[0.25em] bg-black/85 px-4 py-2 rounded-lg border border-orange-500/30 shadow-2xl uppercase animate-pulse flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
              <span>CUT TO [CAM-{cameraAngle.toUpperCase()}]...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center Play Button Overlay */}
      {!isPlaying && !isPreviewExport && (
        <button 
          onClick={togglePlay}
          className={`absolute z-20 w-16 sm:w-20 h-16 sm:h-20 backdrop-blur-sm rounded-full flex items-center justify-center border hover:scale-110 transition-all ${
            isBrutalMode 
              ? 'bg-red-600/30 border-red-500/80 hover:bg-red-600/50 shadow-[0_0_35px_rgba(239,68,68,0.7)] animate-pulse'
              : 'bg-orange-500/20 border-orange-500/50 hover:bg-orange-500/40 shadow-[0_0_30px_rgba(249,115,22,0.3)]'
          }`}
          title="Play Set (Space)"
        >
          <Play className={`w-6 sm:w-8 h-6 sm:h-8 ml-1 ${isBrutalMode ? 'text-red-500' : 'text-orange-500'}`} />
        </button>
      )}

      {/* Real-time Multi-Layer Preview Export Overlay */}
      {isPreviewExport && (
        <PreviewExportOverlay
          act={currentAct}
          currentTimeSec={(progress / 100) * 60}
          isPlaying={isPlaying}
          primaryColor={primaryColor}
          accentColor={accentColor}
          onCommitExport={onCommitExport}
          onClose={() => setPreviewExport(false)}
        />
      )}

      {/* Audio-Visual Crowd Reaction Particles Overlay */}
      <CrowdReactionOverlay 
        particles={crowdParticles} 
        activeReaction={activeCrowdReaction} 
      />

      {/* Director's Commentary Overlay */}
      {showCommentary && (
        <div className="absolute top-6 left-6 w-80 bg-black/80 backdrop-blur-md border border-green-500/30 rounded-xl p-5 text-left shadow-[0_0_30px_rgba(34,197,94,0.15)] z-20 animate-in fade-in slide-in-from-left-4 pointer-events-auto">
          <div className="flex items-center space-x-2 mb-3">
            <Mic className="w-4 h-4 text-green-500 animate-pulse" />
            <span className="text-[10px] font-mono text-green-500 uppercase tracking-widest">Director's Audio Track</span>
          </div>
          <h3 className="text-white font-black uppercase tracking-wider mb-2 text-sm">The Chrono-Kush Paradox</h3>
          <div className="space-y-3 text-xs text-white/70 leading-relaxed font-light">
            <p>
              <strong className="text-white font-medium">Director:</strong> "You think we engineered prompts? Mate, we just cultivated a digital strain of <em className="text-green-400">Quantum Haze</em> and fed it to the neural net."
            </p>
            <p>
              "The botanical properties of this virtual weed are unprecedented. It doesn't just relax the tensors; it actively dilates the fourth dimension. We were trying to render a standard background, but the GPU got so high it hallucinated this entire timeline."
            </p>
            <p>
              "The outcome? Time stopped being a line and became a suggestion. Dragon 9 wasn't scripted—he's just the manifestation of the AI trying to process the concept of 'now' while completely baked."
            </p>
            <p>
              "Notice the volumetric smoke? That's not a physics simulation. That's raw, unadulterated temporal exhaust. We just pressed record."
            </p>
          </div>
        </div>
      )}

      {/* Custom Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 flex flex-col justify-end">
        
        {/* Dragon 9 Stage Emote Quick-Trigger Deck */}
        {showEmoteDeck && (
          <div className="w-full mb-2 bg-black/90 backdrop-blur-md rounded-xl border border-orange-500/30 p-2 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between px-1.5 mb-1.5 pointer-events-auto">
              <span className="text-[9px] font-mono text-orange-400 font-black uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                Dragon 9 Emote Control Deck
              </span>
              <span className="text-[8px] font-mono text-white/40 uppercase">
                Keys [1-6] Trigger Reactions • Key [E] Toggles
              </span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 pointer-events-auto">
              {PRESET_EMOTES.map((preset, idx) => (
                <button
                  key={preset.type}
                  onClick={() => triggerEmote(preset.type)}
                  className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/5 hover:bg-orange-500/15 border border-white/10 hover:border-orange-500/30 transition-all text-center pointer-events-auto group/em font-mono cursor-pointer"
                  title={`Trigger ${preset.label}`}
                >
                  <span className="text-xl group-hover/em:scale-125 transition-transform duration-200">{preset.emoji}</span>
                  <span className="text-[8px] font-bold text-white/80 mt-1 line-clamp-1 group-hover/em:text-orange-400">{preset.label}</span>
                  <span className="text-[7px] text-white/30 mt-0.5 font-bold">[{idx + 1}]</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Crowd Quick Reaction Dock Bar */}
        {showCrowdBar && (
          <div className="w-full mb-2 animate-in fade-in slide-in-from-bottom-2">
            <CrowdReaction 
              isCompact={true} 
              onTriggerReaction={onTriggerCrowdReaction} 
              activeReaction={activeCrowdReaction}
            />
          </div>
        )}

        {/* Crowd Vibe Heatmap */}
        {showHeatmap && (
          <div className="w-full px-2 mb-2 animate-in fade-in slide-in-from-bottom-2">
            <CrowdVibeHeatmap progress={progress} actId={currentAct.id} timeline={timeline} />
          </div>
        )}

        {/* Progress Bar */}
        <div className="w-full h-1 bg-white/20 rounded-full mb-4 cursor-pointer relative overflow-hidden">
          <div 
            className="h-full bg-orange-500 shadow-[0_0_10px_#ea580c] relative transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={togglePlay} className="text-white hover:text-orange-500 transition-colors">
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <button onClick={() => setMuted(!muted)} className="text-white hover:text-orange-500 transition-colors">
              {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <div className="text-[10px] font-mono text-white/50 tracking-widest">
              {currentAct.time}
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-white relative">
            <button 
              onClick={() => setShowCrowdBar(!showCrowdBar)}
              className={`transition-colors relative ${showCrowdBar ? 'text-amber-400' : 'hover:text-amber-400'}`}
              title="Toggle Live Audience Reaction Soundboard Bar (C)"
            >
              <Smile className="w-5 h-5" />
            </button>

            <button 
              onClick={() => setShowEmoteDeck(!showEmoteDeck)}
              className={`transition-colors relative ${showEmoteDeck ? 'text-orange-500' : 'hover:text-orange-500'}`}
              title="Toggle Dragon 9 Emote Control Deck (E)"
            >
              <Smile className="w-5 h-5 text-orange-400 scale-105" />
              <span className="absolute -bottom-1 -right-1 text-[7px] font-mono font-black bg-orange-600 px-0.5 rounded text-white leading-none scale-75">E</span>
            </button>

            {onOpenCrowdRack && (
              <button
                onClick={onOpenCrowdRack}
                className="hover:text-amber-300 text-amber-400/80 transition-colors relative"
                title="Open Audience Atmosphere Lab"
              >
                <Sparkles className="w-5 h-5" />
              </button>
            )}

            <button 
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`transition-colors relative ${showHeatmap ? 'text-green-500' : 'hover:text-green-500'}`}
              title="Crowd Vibe Heatmap"
            >
              <Activity className="w-5 h-5" />
            </button>

            {onOpenHecklerRack && (
              <button 
                onClick={onOpenHecklerRack}
                className="hover:text-red-400 text-red-500/80 transition-colors relative"
                title="Trigger Heckler & Test Timing (H)"
              >
                <ShieldAlert className="w-5 h-5" />
                {activeHeckle && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                )}
              </button>
            )}

            <button 
              onClick={() => setPreviewExport(prev => !prev)}
              className={`transition-colors relative ${isPreviewExport ? 'text-amber-400' : 'hover:text-amber-400'}`}
              title="Toggle Real-Time Multi-Layer Preview Export Mode (P)"
            >
              <Layers className="w-5 h-5" />
              {isPreviewExport && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full animate-ping" />
              )}
            </button>

            <button 
              onClick={() => setShowCommentary(!showCommentary)}
              className={`transition-colors relative ${showCommentary ? 'text-green-500' : 'hover:text-green-500'}`}
              title="Director's Commentary"
            >
              <Mic className="w-5 h-5" />
            </button>

            <button 
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="hover:text-orange-500 transition-colors relative"
            >
              <Share2 className="w-5 h-5" />
            </button>

            {/* Share Menu Popup */}
            {showShareMenu && (
              <div className="absolute bottom-full right-8 mb-4 w-48 bg-[#0a0a0a] border border-orange-500/30 rounded-xl shadow-[0_0_30px_rgba(249,115,22,0.15)] overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                <div className="px-3 py-2 border-b border-white/10 text-[10px] font-mono text-orange-500/70 tracking-widest uppercase">
                  Broadcast Clip
                </div>
                <div className="flex flex-col">
                  <button 
                    onClick={shareToTwitter}
                    className="flex items-center space-x-3 px-4 py-3 hover:bg-white/5 transition-colors text-sm text-white/80 hover:text-white"
                  >
                    <Twitter className="w-4 h-4 text-[#1DA1F2]" />
                    <span>Share to X</span>
                  </button>
                  <button 
                    onClick={shareToDiscord}
                    className="flex items-center space-x-3 px-4 py-3 hover:bg-white/5 transition-colors text-sm text-white/80 hover:text-white border-t border-white/5"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <MessageSquare className="w-4 h-4 text-[#5865F2]" />
                    )}
                    <span className={copied ? "text-green-500" : ""}>
                      {copied ? "Link Copied!" : "Share to Discord"}
                    </span>
                  </button>
                </div>
              </div>
            )}

            <button className="hover:text-orange-500 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <button className="hover:text-orange-500 transition-colors">
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
