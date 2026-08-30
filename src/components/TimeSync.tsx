import { useState, useEffect } from 'react';

export default function TimeSync() {
  const [isDragonTime, setIsDragonTime] = useState(false);
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();
      const seconds = now.getSeconds();

      if (isDragonTime) {
        // Dragon time: 54 minute hours
        // Convert total current minutes today to 54-min scale
        const totalStandardMinutes = hours * 60 + minutes;
        const dragonHours = Math.floor(totalStandardMinutes / 54);
        const dragonMinutes = totalStandardMinutes % 54;
        
        hours = dragonHours;
        minutes = dragonMinutes;
      }

      const pad = (num: number) => num.toString().padStart(2, '0');
      setTimeStr(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [isDragonTime]);

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-md">
      <div className="flex justify-between items-center mb-4">
        <div className="text-[10px] font-mono text-white/50 uppercase tracking-[0.2em]">Temporal Alignment</div>
        <button 
          onClick={() => setIsDragonTime(!isDragonTime)}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${isDragonTime ? 'bg-orange-500' : 'bg-white/20'}`}
        >
          <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${isDragonTime ? 'translate-x-5' : 'translate-x-1'}`} />
        </button>
      </div>

      <div className="text-center">
        <div className={`text-4xl font-black tracking-widest font-mono transition-colors duration-500 ${isDragonTime ? 'text-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]' : 'text-white/80'}`}>
          {timeStr}
        </div>
        <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest mt-2">
          {isDragonTime ? 'DRAGON_9 FLUID CLOCK (54m/h)' : 'STANDARD HUMAN CLOCK (60m/h)'}
        </div>
      </div>
    </div>
  );
}
