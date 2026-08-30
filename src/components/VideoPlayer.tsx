import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Maximize, Volume2, VolumeX, Settings, Share2, Twitter, MessageSquare, Check, Mic, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import CrowdVibeHeatmap from './CrowdVibeHeatmap';

interface VideoPlayerProps {
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  currentAct: any;
  onActComplete: () => void;
}

export default function VideoPlayer({ isPlaying, setIsPlaying, currentAct, onActComplete }: VideoPlayerProps) {
  const [progress, setProgress] = useState(0);
  const [muted, setMuted] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showCommentary, setShowCommentary] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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
          if (p >= 100) {
            setIsPlaying(false);
            setTimeout(onActComplete, 0);
            return 0;
          }
          return p + 0.2; // faster fake progress for demo
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentAct, onActComplete]);

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
    <div ref={containerRef} className="w-full h-full relative bg-black group flex flex-col justify-center items-center overflow-hidden">
      
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
                className="w-full h-full object-cover opacity-80 mix-blend-screen pointer-events-auto"
                playsInline
              />
              {/* Stylized Cyberpunk Tint over the video */}
              <div className="absolute inset-0 bg-orange-900/20 mix-blend-color pointer-events-none" />
            </>
          ) : currentAct.status === 'generating_video' ? (
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-auto bg-black">
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
          ) : (
            /* Video Placeholder (Using the poster concept) */
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-auto">
              <div className={`text-center transition-all duration-1000 ${isPlaying ? 'scale-105 opacity-60' : 'scale-100 opacity-30'}`}>
                <div className="w-[400px] h-[400px] bg-gradient-to-t from-orange-600 to-transparent rounded-full blur-[80px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20" />
                <h2 className="text-4xl font-black text-white/50 uppercase tracking-[0.5em] relative z-10 mix-blend-overlay">
                  {currentAct.title}
                </h2>
                <p className="text-orange-500/50 font-mono text-xs tracking-widest uppercase mt-4">
                  [VEO_3_RENDER_TARGET]
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Center Play Button Overlay */}
      {!isPlaying && (
        <button 
          onClick={togglePlay}
          className="absolute z-20 w-20 h-20 bg-orange-500/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-orange-500/50 hover:bg-orange-500/40 hover:scale-110 transition-all shadow-[0_0_30px_rgba(249,115,22,0.3)]"
        >
          <Play className="w-8 h-8 text-orange-500 ml-1" />
        </button>
      )}

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
        
        {/* Crowd Vibe Heatmap */}
        {showHeatmap && (
          <div className="w-full px-2 mb-2 animate-in fade-in slide-in-from-bottom-2">
            <CrowdVibeHeatmap progress={progress} actId={currentAct.id} />
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
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`transition-colors relative ${showHeatmap ? 'text-green-500' : 'hover:text-green-500'}`}
              title="Crowd Vibe Heatmap"
            >
              <Activity className="w-5 h-5" />
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
