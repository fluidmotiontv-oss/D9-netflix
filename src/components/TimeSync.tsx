import { useState, useEffect } from 'react';
import { Clock, Zap, Info, Sparkles, Radio, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TimeSyncProps {
  isDragonTime: boolean;
  setIsDragonTime: (v: boolean) => void;
  currentActId?: string;
  isPlaying?: boolean;
}

export default function TimeSync({ 
  isDragonTime, 
  setIsDragonTime,
  currentActId = 'act-1',
  isPlaying = false
}: TimeSyncProps) {
  const [timeStr, setTimeStr] = useState('');
  const [dragonTimeStr, setDragonTimeStr] = useState('');
  const [showMathExplainer, setShowMathExplainer] = useState(false);
  
  // Rolling show simulation clock: 45 min broadcast = 54 min dragon set
  const [rollingSeconds, setRollingSeconds] = useState(742); // starts around 12:22 in show

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      const pad = (num: number) => num.toString().padStart(2, '0');
      setTimeStr(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);

      // Dragon time: 54 minute hours (Sumerian knuckle base)
      const totalStandardMinutes = hours * 60 + minutes;
      const dragonHours = Math.floor(totalStandardMinutes / 54);
      const dragonMinutes = totalStandardMinutes % 54;
      setDragonTimeStr(`${pad(dragonHours)}:${pad(dragonMinutes)}:${pad(seconds)}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Rolling show run tracker
  useEffect(() => {
    const showTimer = setInterval(() => {
      setRollingSeconds(prev => (prev + 1) % (45 * 60)); // Loops 45 min broadcast (2700 sec)
    }, 1000);
    return () => clearInterval(showTimer);
  }, []);

  // Compute 45m human broadcast runtime vs 54m dragon show runtime
  const humanElapsedMinutes = Math.floor(rollingSeconds / 60);
  const humanElapsedSeconds = rollingSeconds % 60;
  const humanTimeFormatted = `${humanElapsedMinutes.toString().padStart(2, '0')}:${humanElapsedSeconds.toString().padStart(2, '0')}`;

  // 54 min dragon scale is scaled by 54/45 = 1.2x
  const dragonElapsedTotalSec = Math.floor(rollingSeconds * 1.2);
  const dragonElapsedMinutes = Math.floor(dragonElapsedTotalSec / 60);
  const dragonElapsedSeconds = dragonElapsedTotalSec % 60;
  const dragonShowFormatted = `${dragonElapsedMinutes.toString().padStart(2, '0')}:${dragonElapsedSeconds.toString().padStart(2, '0')}`;

  const humanPercent = (rollingSeconds / (45 * 60)) * 100;
  const dragonPercent = (dragonElapsedTotalSec / (54 * 60)) * 100;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-md relative overflow-hidden transition-all">
      
      {/* Background Subtle Wave */}
      <div className="absolute -top-10 -right-10 w-36 h-36 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Alignment Switch */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-orange-500/20 text-orange-400">
            <Timer className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-white/70 uppercase tracking-[0.2em] font-bold">
              Temporal Alignment
            </div>
            <div className="text-[8px] font-mono text-orange-400/80">
              54m Rolling Show • 45m Reality
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMathExplainer(p => !p)}
            className="text-white/40 hover:text-orange-400 transition-colors p-1"
            title="How 54m Show translates to 45m Broadcast"
          >
            <Info className="w-3.5 h-3.5" />
          </button>

          <button 
            onClick={() => setIsDragonTime(!isDragonTime)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${isDragonTime ? 'bg-orange-500' : 'bg-white/20'}`}
            title="Toggle 54-min Dragon Hour Clock"
          >
            <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${isDragonTime ? 'translate-x-5' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      {/* Main Clock Face */}
      <div className="text-center py-2 px-3 rounded-xl bg-black/40 border border-white/5 mb-4">
        <div className={`text-3xl sm:text-4xl font-black tracking-widest font-mono transition-colors duration-500 ${isDragonTime ? 'text-orange-500 drop-shadow-[0_0_12px_rgba(249,115,22,0.7)]' : 'text-white/90'}`}>
          {isDragonTime ? dragonTimeStr : timeStr}
        </div>
        <div className="text-[9px] font-mono text-white/40 uppercase tracking-widest mt-1 flex items-center justify-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${isDragonTime ? 'bg-orange-500 animate-pulse' : 'bg-white/40'}`} />
          <span>{isDragonTime ? 'DRAGON_9 FLUID CLOCK (54m/h SCALE)' : 'STANDARD HUMAN CLOCK (60m/h SCALE)'}</span>
        </div>
      </div>

      {/* Dual Show Timeline: Rolling 54-Min Show vs 45-Min Human Reality */}
      <div className="space-y-3 pt-1 border-t border-white/10">
        
        {/* Dragon 54-Min Comedy Special Set */}
        <div>
          <div className="flex justify-between items-center text-[10px] font-mono mb-1">
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>54-MIN ROLLING SHOW</span>
            </span>
            <span className="text-amber-300 font-black">{dragonShowFormatted} / 54:00</span>
          </div>
          
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden relative">
            <motion.div 
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]"
              style={{ width: `${dragonPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[8px] font-mono text-white/30 mt-0.5">
            <span>Act 1 (0-14m)</span>
            <span>Act 2 (14-34m)</span>
            <span>Act 3 (34-48m)</span>
            <span>Outro (48-54m)</span>
          </div>
        </div>

        {/* 45-Min Human Reality Broadcast */}
        <div>
          <div className="flex justify-between items-center text-[10px] font-mono mb-1">
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <Radio className="w-3 h-3 text-emerald-400" />
              <span>45-MIN BROADCAST REALITY</span>
            </span>
            <span className="text-emerald-300 font-black">{humanTimeFormatted} / 45:00</span>
          </div>
          
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden relative">
            <motion.div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
              style={{ width: `${humanPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[8px] font-mono text-white/30 mt-0.5">
            <span>0:00</span>
            <span>12:00 (A1)</span>
            <span>28:00 (A2)</span>
            <span>40:00 (A3)</span>
            <span>45:00</span>
          </div>
        </div>
      </div>

      {/* Expandable Mathematical Dilation Explainer */}
      <AnimatePresence>
        {showMathExplainer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-3 pt-3 border-t border-white/10 text-left text-xs font-mono text-white/80 space-y-2 overflow-hidden"
          >
            <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-[10px] leading-relaxed">
              <p className="font-bold text-orange-300 mb-1 flex items-center gap-1">
                <Zap className="w-3 h-3 text-orange-400" />
                <span>The 54m Show vs 45m Reality Ratio (1.20x)</span>
              </p>
              <p className="text-white/70 font-light">
                In Dragon 9's temporal geometry, a complete comedy special consists of <strong>54 fluid minutes</strong>. Under standard 60-minute Earth physics and broadcast television constraints, this collapses into a tight, laser-focused <strong>45-minute broadcast special</strong>.
              </p>
              <div className="mt-2 text-amber-300 font-mono text-[9px] bg-black/50 p-1.5 rounded border border-white/10">
                54 Dragon Minutes × (5/6) = 45 Human Reality Minutes
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
