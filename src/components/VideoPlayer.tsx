import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Maximize, Volume2, VolumeX, Settings } from 'lucide-react';

interface VideoPlayerProps {
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  currentAct: any;
}

export default function VideoPlayer({ isPlaying, setIsPlaying, currentAct }: VideoPlayerProps) {
  const [progress, setProgress] = useState(0);
  const [muted, setMuted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fake progress simulation
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) return 0;
          return p + 0.1;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <div ref={containerRef} className="w-full h-full relative bg-black group flex flex-col justify-center items-center">
      
      {/* Video Placeholder (Using the poster concept) */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
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

      {/* Center Play Button Overlay */}
      {!isPlaying && (
        <button 
          onClick={togglePlay}
          className="absolute z-20 w-20 h-20 bg-orange-500/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-orange-500/50 hover:bg-orange-500/40 hover:scale-110 transition-all shadow-[0_0_30px_rgba(249,115,22,0.3)]"
        >
          <Play className="w-8 h-8 text-orange-500 ml-1" />
        </button>
      )}

      {/* Custom Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
        
        {/* Progress Bar */}
        <div className="w-full h-1 bg-white/20 rounded-full mb-4 cursor-pointer relative overflow-hidden">
          <div 
            className="h-full bg-orange-500 shadow-[0_0_10px_#ea580c] relative"
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
          
          <div className="flex items-center space-x-4 text-white">
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
