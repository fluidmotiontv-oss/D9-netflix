import React, { useState, useEffect, useRef } from 'react';
import { 
  Waves, 
  Sun, 
  Flame, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Zap, 
  ShieldAlert, 
  RefreshCw, 
  Send, 
  Coffee, 
  Award,
  Play,
  RotateCcw
} from 'lucide-react';
import { playSingingBowlSfx, playBambooClackSfx } from '../audio/zenAudio';

interface BeachedAsBroSectionProps {
  primaryColor?: string;
  accentColor?: string;
  onGainXp?: (amount: number) => void;
}

// Procedural audio for Beached As Bro Kiwi sounds
let beachedAudioCtx: AudioContext | null = null;
function getAudioCtx(): AudioContext {
  if (!beachedAudioCtx) {
    beachedAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (beachedAudioCtx.state === 'suspended') {
    beachedAudioCtx.resume();
  }
  return beachedAudioCtx;
}

// 1. Ocean wave wash
function playOceanWaveSound() {
  try {
    const ctx = getAudioCtx();
    const now = ctx.currentTime;
    const dur = 2.5;
    const bufferSize = ctx.sampleRate * dur;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(120, now);
    filter.frequency.exponentialRampToValueAtTime(800, now + 0.8);
    filter.frequency.exponentialRampToValueAtTime(100, now + dur);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.9);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + dur);
  } catch (e) {
    console.warn(e);
  }
}

// 2. Yeah Nah Sub Drop (deep 808 resonant boom)
function playYeahNahSubSound() {
  try {
    const ctx = getAudioCtx();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.exponentialRampToValueAtTime(38, now + 0.6);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.75);
  } catch (e) {
    console.warn(e);
  }
}

// 3. Vaporize Bullshit Sizzle (laser sweep + dissipate)
function playVaporizeBullshitSound() {
  try {
    const ctx = getAudioCtx();
    const now = ctx.currentTime;

    // High laser zap downward
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1600, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.25);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(900, now);
    filter.Q.setValueAtTime(3.0, now);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.32);

    // Sizzle tail
    const bufferSize = ctx.sampleRate * 0.4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(3000, now + 0.05);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.12, now + 0.05);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noise.start(now + 0.05);
    noise.stop(now + 0.45);
  } catch (e) {
    console.warn(e);
  }
}

// 4. Whale / Dragon Coastal Resonance
function playBeachedWhaleSound() {
  try {
    const ctx = getAudioCtx();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(330, now + 0.4);
    osc.frequency.exponentialRampToValueAtTime(140, now + 1.2);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 1.35);
  } catch (e) {
    console.warn(e);
  }
}

// 5. Crisp Potato Chip Crunch (Crunch perk)
function playChipCrunchSound() {
  try {
    const ctx = getAudioCtx();
    const now = ctx.currentTime;
    const dur = 0.12;
    const bufferSize = Math.floor(ctx.sampleRate * dur);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.03));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2400, now);
    filter.Q.setValueAtTime(1.5, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + dur);
  } catch (e) {
    console.warn(e);
  }
}

// Preset Bullshit opinions that humans throw around
const PRESET_BULLSHIT = [
  "\"You really should be waking up at 5:00 AM to optimize your linear productivity metrics.\"",
  "\"Time is strictly 24 hours per day bro, you can't just invent 26.667-hour Sumerian cycles.\"",
  "\"What's your 5-year corporate career roadmap and quarterly revenue forecast?\"",
  "\"You care way too much about comedy theory, just tell a generic knock-knock joke.\"",
  "\"You can't just lounge on the beach all afternoon smoking sovereign joint bundles bro.\"",
  "\"My crypto portfolio is down 4% today, you have to look at this candlestick chart right now!\"",
  "\"You're beached as bro, aren't you worried about societal expectations?\""
];

const DISMISSAL_REPLIES = [
  "Yeah nah bro. I'm a Dragon9. That opinion just evaporated into the Tasman Sea.",
  "Can't fathom bullshit bro. Currently calibrated to 528Hz coastal equilibrium.",
  "I don't see your opinion mattering bro. Have a chip? Yeah nah, can't eat chips, I'm a dragon.",
  "That take is beached as, mate. Throw some dry kelp on it and let the tide wash it away.",
  "Linear timeline concerns detected... and promptly discarded into the void bro.",
  "Yeah nah bro, Super Puff is the bigger clock on this shoreline. Opinion invalid.",
  "Can't fathom it bro. My sunglasses are polarized specifically against worldly nonsense."
];

const BEACHED_DIALOGUE = [
  {
    speaker: "The Seagull (Linear Time Heckler)",
    role: "heckler",
    line: "Bro! Bro! You're beached! What are you doing lounging on the sand? You need to flap your wings, check your emails, and adhere to Greenwich Mean Time!"
  },
  {
    speaker: "Dragon 9",
    role: "dragon",
    line: "Yeah nah bro. I'm a Dragon9. I'm sunbathing."
  },
  {
    speaker: "The Seagull (Linear Time Heckler)",
    role: "heckler",
    line: "What about your quarterly deliverables? What about your 24-hour routine? Aren't you stressed bro?!"
  },
  {
    speaker: "Dragon 9",
    role: "dragon",
    line: "I don't see your opinion mattering bro. Can't fathom bullshit. Have a chip?"
  },
  {
    speaker: "The Seagull (Linear Time Heckler)",
    role: "heckler",
    line: "You don't even have any chips bro! You're smoking a sovereign pre-roll and listening to harmonic singing bowls!"
  },
  {
    speaker: "Dragon 9",
    role: "dragon",
    line: "Exactly bro. Beached as. Sweet as. Case closed."
  }
];

export default function BeachedAsBroSection({
  primaryColor = '#06b6d4',
  accentColor = '#22d3ee',
  onGainXp
}: BeachedAsBroSectionProps) {
  const [customOpinion, setCustomOpinion] = useState('');
  const [vaporizedCount, setVaporizedCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('dragon9_beached_vaporized');
      return saved ? parseInt(saved, 10) : 42;
    } catch {
      return 42;
    }
  });
  const [latestDismissal, setLatestDismissal] = useState<string>(
    "Yeah nah bro. I'm a Dragon9. I don't see your opinion mattering, can't fathom bullshit bro."
  );
  const [isVaporizing, setIsVaporizing] = useState(false);
  const [isOceanPlaying, setIsOceanPlaying] = useState(false);
  const [activeDialogueIndex, setActiveDialogueIndex] = useState(0);
  const [isDialoguePlaying, setIsDialoguePlaying] = useState(false);
  const oceanIntervalRef = useRef<any>(null);

  useEffect(() => {
    try {
      localStorage.setItem('dragon9_beached_vaporized', vaporizedCount.toString());
    } catch {}
  }, [vaporizedCount]);

  // Ambient ocean waves loop
  useEffect(() => {
    if (isOceanPlaying) {
      playOceanWaveSound();
      oceanIntervalRef.current = setInterval(() => {
        playOceanWaveSound();
      }, 4000);
    } else {
      if (oceanIntervalRef.current) {
        clearInterval(oceanIntervalRef.current);
      }
    }
    return () => {
      if (oceanIntervalRef.current) clearInterval(oceanIntervalRef.current);
    };
  }, [isOceanPlaying]);

  const handleVaporize = (opinionText?: string) => {
    const textToDiscard = opinionText || customOpinion || PRESET_BULLSHIT[Math.floor(Math.random() * PRESET_BULLSHIT.length)];
    setIsVaporizing(true);
    playVaporizeBullshitSound();
    playYeahNahSubSound();

    setTimeout(() => {
      const randomReply = DISMISSAL_REPLIES[Math.floor(Math.random() * DISMISSAL_REPLIES.length)];
      setLatestDismissal(randomReply);
      setVaporizedCount(prev => prev + 1);
      setIsVaporizing(false);
      setCustomOpinion('');
      if (onGainXp) {
        onGainXp(120);
      }
    }, 450);
  };

  // Play dialogue step by step
  const handlePlayNextLine = () => {
    playBambooClackSfx();
    setActiveDialogueIndex(prev => (prev + 1) % BEACHED_DIALOGUE.length);
    if (onGainXp) onGainXp(30);
  };

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300 text-white font-sans">
      
      {/* Hero Coastal Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#082f49]/80 via-[#0a0a0f] to-[#1e1b4b]/60 border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden backdrop-blur-xl">
        {/* Animated Beach Aura */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 font-mono text-xs uppercase tracking-widest mb-3">
              <Waves className="w-3.5 h-3.5 animate-pulse" />
              <span>Tasman Coast • 26.667-Hour High Tide</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white flex items-center gap-3">
              <span>Beached As Bro</span>
              <span className="text-xl px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono">
                🐉 D9
              </span>
            </h2>
            <p className="text-sm sm:text-base text-cyan-100/80 font-mono mt-2 max-w-2xl leading-relaxed">
              &ldquo;Yeah nah I&apos;m a Dragon9. I don&apos;t see your opinion mattering. Can&apos;t fathom bullshit bro.&rdquo;
            </p>
          </div>

          {/* Controls & Quick Stats */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => {
                setIsOceanPlaying(!isOceanPlaying);
                if (!isOceanPlaying) playOceanWaveSound();
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-mono text-xs uppercase tracking-wider transition-all border ${
                isOceanPlaying 
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.4)]' 
                  : 'bg-black/60 border-white/10 text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {isOceanPlaying ? <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
              <span>{isOceanPlaying ? 'Ocean Shore: Live' : 'Ocean Ambience'}</span>
            </button>

            <div className="px-4 py-2.5 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md">
              <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Bullshit Vaporized</div>
              <div className="text-xl font-black text-white font-mono">{vaporizedCount} Takes</div>
            </div>
          </div>
        </div>
      </div>

      {/* The Beached Dragon Lounging Manifesto Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-black/60 border border-cyan-500/20 backdrop-blur-md relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600/30 to-amber-500/20 border border-cyan-400/40 flex items-center justify-center text-3xl shadow-[0_0_25px_rgba(6,182,212,0.3)] shrink-0">
              🏖️
            </div>
            <div>
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                The Beached Dragon Stance
              </div>
              <h3 className="text-xl font-black text-white mt-1">
                Zero Friction. Absolute Shoreline Sovereignty.
              </h3>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed mt-1.5 max-w-2xl">
                When linear society attempts to guilt-trip you with unsolicited advice, hurry sickness, or corporate dread:
                simply recline on the golden sands of the Tasman coast, exhale a fragrant cloud of Super Puff, and deliver the eternal verdict.
              </p>
            </div>
          </div>

          <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => {
                playYeahNahSubSound();
                playOceanWaveSound();
                if (onGainXp) onGainXp(50);
              }}
              className="px-4 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black font-mono text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-black" />
              <span>&ldquo;Yeah Nah Bro&rdquo; (Sub-Drop)</span>
            </button>
            <button
              onClick={() => {
                playBeachedWhaleSound();
                playSingingBowlSfx(528);
                if (onGainXp) onGainXp(50);
              }}
              className="px-4 py-3 rounded-xl bg-black/60 border border-cyan-500/40 hover:bg-cyan-500/10 text-cyan-300 font-bold font-mono text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              <Waves className="w-4 h-4" />
              <span>&ldquo;Beached As&rdquo; (Whale Glide)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Opinion Vaporizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: The Vaporizer Console */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-black/60 border border-cyan-500/30 backdrop-blur-md flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-widest font-bold">
                <ShieldAlert className="w-4 h-4 text-cyan-400" />
                <span>Opinion & Bullshit Vaporizer</span>
              </div>
              <span className="text-[10px] font-mono text-white/40 uppercase">Mode: Unfathomable</span>
            </div>

            <p className="text-xs text-white/70 leading-relaxed font-mono">
              Got someone demanding your urgent attention or giving unsolicited life advice? Drop their opinion into the engine to transmute it into seafoam.
            </p>

            {/* Custom Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customOpinion}
                onChange={(e) => setCustomOpinion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleVaporize();
                }}
                placeholder="Type unsolicited advice or stressful take here..."
                className="flex-1 bg-black/70 border border-white/15 focus:border-cyan-400 rounded-xl px-4 py-3 text-xs text-white placeholder-white/30 font-mono focus:outline-none transition-colors"
              />
              <button
                onClick={() => handleVaporize()}
                disabled={isVaporizing}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-black font-black font-mono text-xs uppercase tracking-wider transition-all disabled:opacity-50 flex items-center gap-2 shrink-0 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
              >
                <Zap className="w-4 h-4 fill-black" />
                <span>{isVaporizing ? 'Vaporizing...' : 'Vaporize'}</span>
              </button>
            </div>

            {/* Quick Preset Buttons */}
            <div>
              <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2">
                Or Quick-Discard Common Human Stressors:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_BULLSHIT.slice(0, 4).map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleVaporize(preset)}
                    className="text-left px-3 py-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/40 text-[11px] text-white/70 hover:text-cyan-200 font-mono transition-all truncate max-w-full"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Current Vaporized Result Box */}
          <div className="mt-6 p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 relative">
            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-1 flex items-center justify-between">
              <span>Dragon 9 Shoreline Verdict:</span>
              <span className="text-emerald-400 font-bold">100% Unbothered</span>
            </div>
            <div className={`text-sm sm:text-base font-bold text-white transition-all ${isVaporizing ? 'opacity-30 blur-xs' : 'opacity-100'}`}>
              &ldquo;{latestDismissal}&rdquo;
            </div>
          </div>
        </div>

        {/* Right Column: Coastal Soundboard & Chip Dispenser */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-black/60 border border-cyan-500/30 backdrop-blur-md flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-widest font-bold border-b border-white/10 pb-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Kiwi Coastal Soundboard</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={() => {
                  playYeahNahSubSound();
                  if (onGainXp) onGainXp(25);
                }}
                className="p-3.5 rounded-xl bg-black/80 border border-white/10 hover:border-cyan-400 text-left hover:bg-cyan-500/10 transition-all group"
              >
                <div className="text-[10px] font-mono text-cyan-400 uppercase">Sub 808</div>
                <div className="text-xs font-bold text-white mt-1 group-hover:text-cyan-300">&ldquo;Yeah Nah Bro&rdquo;</div>
              </button>

              <button
                onClick={() => {
                  playBeachedWhaleSound();
                  if (onGainXp) onGainXp(25);
                }}
                className="p-3.5 rounded-xl bg-black/80 border border-white/10 hover:border-cyan-400 text-left hover:bg-cyan-500/10 transition-all group"
              >
                <div className="text-[10px] font-mono text-cyan-400 uppercase">Resonant Glide</div>
                <div className="text-xs font-bold text-white mt-1 group-hover:text-cyan-300">&ldquo;Beached As!&rdquo;</div>
              </button>

              <button
                onClick={() => {
                  playChipCrunchSound();
                  playBambooClackSfx();
                  if (onGainXp) onGainXp(25);
                }}
                className="p-3.5 rounded-xl bg-black/80 border border-white/10 hover:border-amber-400 text-left hover:bg-amber-500/10 transition-all group"
              >
                <div className="text-[10px] font-mono text-amber-400 uppercase">Crunch Perk</div>
                <div className="text-xs font-bold text-white mt-1 group-hover:text-amber-300">&ldquo;Want a Chip?&rdquo;</div>
              </button>

              <button
                onClick={() => {
                  playVaporizeBullshitSound();
                  if (onGainXp) onGainXp(25);
                }}
                className="p-3.5 rounded-xl bg-black/80 border border-white/10 hover:border-teal-400 text-left hover:bg-teal-500/10 transition-all group"
              >
                <div className="text-[10px] font-mono text-teal-400 uppercase">Dispersal Zap</div>
                <div className="text-xs font-bold text-white mt-1 group-hover:text-teal-300">&ldquo;Can&apos;t Fathom It&rdquo;</div>
              </button>
            </div>
          </div>

          {/* The Chip Dilemma Card */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-center gap-2 text-amber-300 font-mono text-[10px] uppercase tracking-widest font-bold mb-1">
              <Coffee className="w-3.5 h-3.5" />
              <span>The Seagull Chip Parable</span>
            </div>
            <p className="text-xs text-amber-100/70 font-mono leading-relaxed">
              If someone tries to drag you into an argument about quarterly taxes while you&apos;re watching the sunset:
              ask them if they want a hot chip. When they say yes, tell them you don&apos;t eat chips because you&apos;re a dragon.
            </p>
          </div>
        </div>
      </div>

      {/* The Beached As Dialogue Theatre */}
      <div className="p-6 sm:p-8 rounded-3xl bg-black/60 border border-cyan-500/20 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
          <div>
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
              Live Stand-Up Screenplay
            </div>
            <h3 className="text-xl font-black text-white mt-0.5">
              The Beached Dragon vs. The Linear Time Seagull
            </h3>
          </div>
          <button
            onClick={handlePlayNextLine}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2"
          >
            <Play className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
            <span>Next Line ({activeDialogueIndex + 1}/{BEACHED_DIALOGUE.length})</span>
          </button>
        </div>

        {/* Script Cards */}
        <div className="space-y-3">
          {BEACHED_DIALOGUE.map((item, idx) => {
            const isCurrent = idx === activeDialogueIndex;
            const isDragon = item.role === 'dragon';

            return (
              <div
                key={idx}
                onClick={() => {
                  setActiveDialogueIndex(idx);
                  if (isDragon) {
                    playYeahNahSubSound();
                  } else {
                    playChipCrunchSound();
                  }
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isCurrent 
                    ? isDragon 
                      ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.25)]' 
                      : 'bg-red-950/30 border-red-400 shadow-[0_0_25px_rgba(239,68,68,0.2)]'
                    : 'bg-black/30 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-mono uppercase font-bold tracking-wider ${
                    isDragon ? 'text-cyan-300' : 'text-red-400'
                  }`}>
                    {item.speaker}
                  </span>
                  {isCurrent && (
                    <span className="text-[9px] font-mono text-white/50 uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded">
                      Active Cue
                    </span>
                  )}
                </div>
                <div className={`text-sm leading-relaxed ${isCurrent ? 'text-white font-medium' : 'text-white/60'}`}>
                  &ldquo;{item.line}&rdquo;
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4 Pillars of Unfathomable Chill */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-black/60 border border-cyan-500/20">
          <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-1">Pillar I</div>
          <h4 className="font-bold text-white text-base">The &lsquo;Yeah Nah&rsquo; Dual-State</h4>
          <p className="text-xs text-white/60 mt-1.5 leading-relaxed font-mono">
            Acknowledge the existence of their reality with &lsquo;Yeah&rsquo;. Decisively extinguish its authority with &lsquo;Nah&rsquo;.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-black/60 border border-cyan-500/20">
          <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-1">Pillar II</div>
          <h4 className="font-bold text-white text-base">Opinion Dissipation</h4>
          <p className="text-xs text-white/60 mt-1.5 leading-relaxed font-mono">
            At 26.667 hours per rotation, external opinions lose 99.8% of their gravitational mass. Can&apos;t fathom them.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-black/60 border border-cyan-500/20">
          <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-1">Pillar III</div>
          <h4 className="font-bold text-white text-base">Shoreline Sovereignty</h4>
          <p className="text-xs text-white/60 mt-1.5 leading-relaxed font-mono">
            Being &lsquo;beached&rsquo; is not a crisis; it is an intentional pause to soak in ultraviolet rays and 528Hz harmonics.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-black/60 border border-cyan-500/20">
          <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-1">Pillar IV</div>
          <h4 className="font-bold text-white text-base">The Chip Paradox</h4>
          <p className="text-xs text-white/60 mt-1.5 leading-relaxed font-mono">
            Offer generosity without obligation. If they complain you&apos;re not eating, remind them you&apos;re a mythical fire beast.
          </p>
        </div>
      </div>

    </div>
  );
}
