import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Flame, Sliders, ShieldAlert, Sparkles } from 'lucide-react';
import { getAudioContext } from '../audio/crowdAudio';

interface AmbientBackgroundPlayerProps {
  isBrutalMode: boolean;
  primaryColor?: string;
  accentColor?: string;
}

export default function AmbientBackgroundPlayer({
  isBrutalMode,
  primaryColor = '#3b82f6',
  accentColor = '#60a5fa',
}: AmbientBackgroundPlayerProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.4);
  const [muffleFreq, setMuffleFreq] = useState<number>(380);
  const [clinkCount, setClinkCount] = useState<number>(0);

  // Audio nodes refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const chatterSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const chatterGainRef = useRef<GainNode | null>(null);
  const muffleFilterRef = useRef<BiquadFilterNode | null>(null);
  const rumbleOsc1Ref = useRef<OscillatorNode | null>(null);
  const rumbleOsc2Ref = useRef<OscillatorNode | null>(null);
  const rumbleGainRef = useRef<GainNode | null>(null);
  const tensionDroneRef = useRef<OscillatorNode | null>(null);
  const tensionGainRef = useRef<GainNode | null>(null);

  // Clink timer ref
  const clinkTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize and build Web Audio Graph
  const startAmbience = () => {
    try {
      const ctx = getAudioContext();
      audioCtxRef.current = ctx;

      // Resume context if suspended
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      const now = ctx.currentTime;

      // 1. Master Volume Control for Ambient Loop
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume, now);
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      // 2. Muffle/Lowpass Filter (controls cozy muffled feeling vs raw cellar exposure)
      const muffleFilter = ctx.createBiquadFilter();
      muffleFilter.type = 'lowpass';
      muffleFilter.frequency.setValueAtTime(isBrutalMode ? 950 : 380, now);
      muffleFilter.Q.setValueAtTime(1.2, now);
      muffleFilter.connect(masterGain);
      muffleFilterRef.current = muffleFilter;

      // 3. Create Procedural White Noise Buffer for Crowd Chatter
      const bufferSize = ctx.sampleRate * 2; // 2 seconds
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const chatterSource = ctx.createBufferSource();
      chatterSource.buffer = buffer;
      chatterSource.loop = true;

      // Filter noise into warm vocal range (bandpass resonant at 550Hz)
      const vocalFilter = ctx.createBiquadFilter();
      vocalFilter.type = 'bandpass';
      vocalFilter.frequency.setValueAtTime(550, now);
      vocalFilter.Q.setValueAtTime(1.8, now);

      const chatterGain = ctx.createGain();
      // Lower volume in standard, louder in brutal mode
      chatterGain.gain.setValueAtTime(isBrutalMode ? 0.22 : 0.08, now);

      chatterSource.connect(vocalFilter);
      vocalFilter.connect(chatterGain);
      chatterGain.connect(muffleFilter);

      chatterSource.start(0);
      chatterSourceRef.current = chatterSource;
      chatterGainRef.current = chatterGain;

      // 4. Low Frequency Room Rumble / Crowd Body Hum
      // Beating frequencies (45Hz & 49Hz) simulate crowd resonance and breathing
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = 'triangle';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(45, now);
      osc2.frequency.setValueAtTime(49, now);

      const rumbleGain = ctx.createGain();
      rumbleGain.gain.setValueAtTime(isBrutalMode ? 0.35 : 0.18, now);

      osc1.connect(rumbleGain);
      osc2.connect(rumbleGain);
      rumbleGain.connect(muffleFilter);

      osc1.start(0);
      osc2.start(0);
      rumbleOsc1Ref.current = osc1;
      rumbleOsc2Ref.current = osc2;
      rumbleGainRef.current = rumbleGain;

      // 5. Tension Drone Node (Ring modulation or high-pitch cellar feedback)
      // Only gets active/audible when in Brutal Mode
      const tensionDrone = ctx.createOscillator();
      tensionDrone.type = 'sine';
      tensionDrone.frequency.setValueAtTime(3200, now);

      const tensionGain = ctx.createGain();
      tensionGain.gain.setValueAtTime(isBrutalMode ? 0.004 : 0.0, now);

      tensionDrone.connect(tensionGain);
      tensionGain.connect(masterGain); // Direct to master to avoid muffle filter!
      tensionDrone.start(0);

      tensionDroneRef.current = tensionDrone;
      tensionGainRef.current = tensionGain;

      setIsPlaying(true);
      setMuffleFreq(isBrutalMode ? 950 : 380);

      // Start the Glass Clinker scheduler loop
      scheduleNextGlassClink(ctx, masterGain);

    } catch (err) {
      console.error('Failed to initiate procedural ambience:', err);
    }
  };

  // Stop/Disconnect Audio Graph
  const stopAmbience = () => {
    if (clinkTimeoutRef.current) {
      clearTimeout(clinkTimeoutRef.current);
    }

    try {
      chatterSourceRef.current?.stop();
      chatterSourceRef.current?.disconnect();
      rumbleOsc1Ref.current?.stop();
      rumbleOsc1Ref.current?.disconnect();
      rumbleOsc2Ref.current?.stop();
      rumbleOsc2Ref.current?.disconnect();
      tensionDroneRef.current?.stop();
      tensionDroneRef.current?.disconnect();

      chatterGainRef.current?.disconnect();
      rumbleGainRef.current?.disconnect();
      tensionGainRef.current?.disconnect();
      muffleFilterRef.current?.disconnect();
      masterGainRef.current?.disconnect();
    } catch (e) {
      // Ignored for safety during shutdown
    }

    chatterSourceRef.current = null;
    rumbleOsc1Ref.current = null;
    rumbleOsc2Ref.current = null;
    tensionDroneRef.current = null;
    masterGainRef.current = null;
    setIsPlaying(false);
  };

  // Synthesize a high quality procedural glass clink
  const triggerSingleGlassClink = (ctx: AudioContext, destination: AudioNode) => {
    if (!isPlaying || !destination) return;

    try {
      const now = ctx.currentTime;
      const baseFreq = isBrutalMode 
        ? 1500 + Math.random() * 800 
        : 2600 + Math.random() * 1200;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const clinkGain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(baseFreq, now);
      osc2.frequency.setValueAtTime(baseFreq * 1.54 + 8, now);

      clinkGain.gain.setValueAtTime(0.001, now);
      clinkGain.gain.linearRampToValueAtTime(isBrutalMode ? 0.12 : 0.06, now + 0.003);
      clinkGain.gain.exponentialRampToValueAtTime(0.001, now + (isBrutalMode ? 0.28 : 0.15));

      osc1.connect(clinkGain);
      osc2.connect(clinkGain);
      
      clinkGain.connect(destination);

      osc1.start(now);
      osc2.start(now);
      
      osc1.stop(now + 0.35);
      osc2.stop(now + 0.35);

      setClinkCount((prev) => prev + 1);
    } catch (e) {
      // Silence fails
    }
  };

  // Scheduler logic for scheduling random jazz club glass clinking
  const scheduleNextGlassClink = (ctx: AudioContext, destination: AudioNode) => {
    if (clinkTimeoutRef.current) {
      clearTimeout(clinkTimeoutRef.current);
    }

    const delay = isBrutalMode 
      ? 2200 + Math.random() * 2800 
      : 7000 + Math.random() * 8000;

    clinkTimeoutRef.current = setTimeout(() => {
      if (audioCtxRef.current && masterGainRef.current) {
        triggerSingleGlassClink(audioCtxRef.current, muffleFilterRef.current || masterGainRef.current);
        scheduleNextGlassClink(audioCtxRef.current, masterGainRef.current);
      }
    }, delay);
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopAmbience();
    } else {
      startAmbience();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVol = parseFloat(e.target.value);
    setVolume(nextVol);
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.linearRampToValueAtTime(nextVol, audioCtxRef.current.currentTime + 0.15);
    }
  };

  useEffect(() => {
    if (!isPlaying || !audioCtxRef.current) return;

    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;
    const transitionTime = 1.8;

    if (muffleFilterRef.current) {
      const targetCutoff = isBrutalMode ? 950 : 380;
      muffleFilterRef.current.frequency.cancelScheduledValues(now);
      muffleFilterRef.current.frequency.setValueAtTime(muffleFilterRef.current.frequency.value, now);
      muffleFilterRef.current.frequency.exponentialRampToValueAtTime(targetCutoff, now + transitionTime);
      setMuffleFreq(targetCutoff);
    }

    if (chatterGainRef.current) {
      const targetChatter = isBrutalMode ? 0.22 : 0.08;
      chatterGainRef.current.gain.cancelScheduledValues(now);
      chatterGainRef.current.gain.setValueAtTime(chatterGainRef.current.gain.value, now);
      chatterGainRef.current.gain.linearRampToValueAtTime(targetChatter, now + transitionTime);
    }

    if (rumbleGainRef.current) {
      const targetRumble = isBrutalMode ? 0.35 : 0.18;
      rumbleGainRef.current.gain.cancelScheduledValues(now);
      rumbleGainRef.current.gain.setValueAtTime(rumbleGainRef.current.gain.value, now);
      rumbleGainRef.current.gain.linearRampToValueAtTime(targetRumble, now + transitionTime);
    }

    if (tensionGainRef.current) {
      const targetTension = isBrutalMode ? 0.004 : 0.0;
      tensionGainRef.current.gain.cancelScheduledValues(now);
      tensionGainRef.current.gain.setValueAtTime(tensionGainRef.current.gain.value, now);
      tensionGainRef.current.gain.linearRampToValueAtTime(targetTension, now + transitionTime);
    }

    if (masterGainRef.current) {
      scheduleNextGlassClink(ctx, masterGainRef.current);
    }

  }, [isBrutalMode]);

  useEffect(() => {
    return () => {
      stopAmbience();
    };
  }, []);

  return (
    <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-md p-3.5 space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div 
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                isPlaying 
                  ? isBrutalMode 
                    ? 'bg-red-500/20 text-red-400 border border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.3)]' 
                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/40' 
                  : 'bg-white/5 text-white/40 border border-white/5'
              }`}
            >
              <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-bounce' : ''}`} />
            </div>
            {isPlaying && (
              <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${isBrutalMode ? 'bg-red-500' : 'bg-green-500'} animate-ping`} />
            )}
          </div>
          <div>
            <h4 className="text-xs font-bold font-mono text-white/90 uppercase tracking-wider">
              Ambient Club Acoustic Engine
            </h4>
            <p className="text-[10px] font-mono text-white/45">
              Procedural crowd murmur, room rumbling & glass clinking
            </p>
          </div>
        </div>

        <button
          onClick={handleTogglePlay}
          className={`px-3 py-1 text-[10px] font-mono font-bold tracking-wider uppercase rounded-lg border transition-all ${
            isPlaying
              ? 'bg-red-500/15 hover:bg-red-500/25 border-red-500/40 text-red-400'
              : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/80'
          }`}
        >
          {isPlaying ? 'Disable' : 'Enable Loop'}
        </button>
      </div>

      {isPlaying ? (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2 p-2 rounded-lg bg-black/50 border border-white/5">
            <div className="text-center">
              <span className="block text-[8px] font-mono text-white/35 uppercase">Acoustic Cutoff</span>
              <span className={`text-[10px] font-mono font-bold ${isBrutalMode ? 'text-red-400' : 'text-blue-400'}`}>
                {muffleFreq} Hz
              </span>
            </div>
            <div className="text-center">
              <span className="block text-[8px] font-mono text-white/35 uppercase">Vibe Status</span>
              <span className="text-[10px] font-mono font-bold text-emerald-400 flex items-center justify-center gap-0.5">
                {isBrutalMode ? (
                  <>
                    <ShieldAlert className="w-2.5 h-2.5 text-red-500" />
                    <span className="text-red-400 text-[9px]">HARSH CELLAR</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-2.5 h-2.5 text-blue-400" />
                    <span className="text-blue-400 text-[9px]">COZY LOUNGE</span>
                  </>
                )}
              </span>
            </div>
            <div className="text-center">
              <span className="block text-[8px] font-mono text-white/35 uppercase">Glasses Clinked</span>
              <span className="text-[10px] font-mono font-bold text-amber-400">
                {clinkCount}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-[9px] font-mono text-white/50">
              <span className="flex items-center gap-1">
                <Sliders className="w-3 h-3 text-white/40" />
                <span>Ambient Volume: {Math.round(volume * 100)}%</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <VolumeX className="w-3.5 h-3.5 text-white/40" />
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500 transition-all hover:bg-white/20"
              />
              <Volume2 className="w-3.5 h-3.5 text-white/40" />
            </div>
          </div>

          <div className="h-6 flex items-end justify-between gap-0.5 px-1 bg-black/30 rounded-md border border-white/5 overflow-hidden">
            {[...Array(24)].map((_, idx) => (
              <div
                key={idx}
                className={`w-full rounded-t-sm transition-all duration-300 ${
                  isBrutalMode ? 'bg-red-500/70' : 'bg-blue-500/60'
                }`}
                style={{
                  height: isPlaying 
                    ? `${10 + Math.sin(Date.now() / 200 + idx * 0.4) * (isBrutalMode ? 40 : 15) + Math.random() * 25}%`
                    : '15%'
                }}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="p-3 text-center bg-black/40 rounded-lg border border-white/5 border-dashed">
          <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
            🔈 Ambience Standby. Click "Enable Loop" to immerse in crowd soundscape.
          </p>
        </div>
      )}
    </div>
  );
}
