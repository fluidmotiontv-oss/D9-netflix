// Procedural Web Audio and Speech Synthesis for Heckler Interruption & Crowd Reactions

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export type HeckleType = 
  | 'impatient'
  | 'babylonian'
  | 'pass_blunt'
  | 'ringtone'
  | 'tomato'
  | 'laser'
  | 'crickets'
  | 'drunk_woo'
  | 'boo';

export interface HeckleItem {
  id: HeckleType;
  label: string;
  category: 'audio' | 'projectile' | 'disruption' | 'crowd';
  phrase: string;
  description: string;
  icon: string;
  performerRoast: string;
  reactionAnimation: 'surprised' | 'dodge' | 'laser_track' | 'deadpan' | 'smoke_blast' | 'eyebrow_raise';
  comedyTheoryTakeaway: string;
  terpenePairingNote: string;
  xpAward: number;
}

export const HECKLE_PRESETS: HeckleItem[] = [
  {
    id: 'impatient',
    label: 'Get On With It!',
    category: 'audio',
    phrase: 'Get on with it mate! We have jobs tomorrow!',
    description: 'Impatient Kiwi audience member yelling from row 4.',
    icon: '🗣️',
    performerRoast: 'Mate, linear time is an illusion anyway. 焦るなよ、小僧 (Don\'t rush it, kid). Where are you rushing off to? Your microwave burrito? Super Puff is the bigger clock on this block. Times Up, Mother Fathers!',
    reactionAnimation: 'eyebrow_raise',
    comedyTheoryTakeaway: 'Rule of Status Inversion: Disarm audience anxiety by questioning the sanctity of their mundane routine.',
    terpenePairingNote: 'High Myrcene strain required to resist the impulse to speed up delivery.',
    xpAward: 45,
  },
  {
    id: 'tomato',
    label: 'Throw Flying Tomato',
    category: 'projectile',
    phrase: '*Splat!* Boo! Tell a better joke!',
    description: 'Heaves an overripe heirloom tomato directly at the dragon.',
    icon: '🍅',
    performerRoast: 'An heirloom tomato? In this economy? トマト投げる暇があったら笑え (If you have time to throw tomatoes, you should be laughing). Cheers for the botanical asset, legend. Super Puff weaves through gravity. Times Up, Mother Fathers!',
    reactionAnimation: 'dodge',
    comedyTheoryTakeaway: 'Physical Misdirection: Transform hostile projectile disruption into economic observational humor.',
    terpenePairingNote: 'Caryophyllene for rapid-twitch physical dodge reflexes and spicy retort delivery.',
    xpAward: 60,
  },
  {
    id: 'pass_blunt',
    label: 'Pass the Blunt!',
    category: 'audio',
    phrase: 'Oi! Pass that blunt down here dragon!',
    description: 'Greedy front-row spectator demanding a puff.',
    icon: '💨',
    performerRoast: 'Mate, this is 54-minute cured Quantum Diesel. お前にはまだ早すぎるぜ (Way too early for your lungs, champion). Your 3rd-dimensional lungs would collapse into an existential crisis before the punchline. Super Puff controls the flow. Times Up, Mother Fathers!',
    reactionAnimation: 'smoke_blast',
    comedyTheoryTakeaway: 'Connoisseur Gatekeeping: Elevate your prop into a mythical artifact to establish comedic authority.',
    terpenePairingNote: 'Quantum Diesel with high Terpinolene for electric crowd banter.',
    xpAward: 50,
  },
  {
    id: 'ringtone',
    label: 'Nokia Ringtone in Crowd',
    category: 'disruption',
    phrase: '*Loud Marimba / Nokia chime echoing in the theater*',
    description: 'Loud classic cell phone blast ruining the punchline setup.',
    icon: '📱',
    performerRoast: 'Is that your mum calling? 電話切れよ、マザーファザー (Hang up the phone, mother father). Tell her Super Puff is in session and linear schedules have been officially cancelled. Times Up, Mother Fathers!',
    reactionAnimation: 'deadpan',
    comedyTheoryTakeaway: 'Tension Absorption: Acknowledge external noise immediately so the audience does not split attention.',
    terpenePairingNote: 'Linalool calm keeps the heart rate steady when an audio spike interrupts the rhythm.',
    xpAward: 55,
  },
  {
    id: 'laser',
    label: 'Green Stage Laser Pointer',
    category: 'disruption',
    phrase: '*Buzz* *Green laser dot shines right in dragon eyes*',
    description: 'Annoying spectator pointing a bright tactical laser.',
    icon: '🔦',
    performerRoast: 'Who gave a 532nm diode to a bloke in cargo shorts? まぶしいんだよ、相棒 (That\'s blinding, partner). You are tracking the gaze of the bigger clock on the block. Times Up, Mother Fathers!',
    reactionAnimation: 'laser_track',
    comedyTheoryTakeaway: 'Visual Integration: Follow the laser with your eyes to turn the heckler into an unwitting co-performer.',
    terpenePairingNote: 'Pinene for hyper-dilated pupil focus and visual tracking precision.',
    xpAward: 65,
  },
  {
    id: 'babylonian',
    label: 'Babylonians Were Right!',
    category: 'audio',
    phrase: 'Babylonian 60-minutes is mathematically superior!',
    description: 'Pedantic time-nerd challenging the 54-minute hour.',
    icon: '📐',
    performerRoast: 'Ah, big shoutout to the knuckle-counters from 3000 BC. 過去に生きるな、今を見ろ (Don\'t live in the past, look at now). Gilgamesh was an open-mic hack compared to Super Puff. Times Up, Mother Fathers!',
    reactionAnimation: 'surprised',
    comedyTheoryTakeaway: 'Historical Deconstruction: Attack the foundational premise of ancient societal norms with deadpan mockery.',
    terpenePairingNote: 'Limonene for playful intellectual dissection without sounding bitter.',
    xpAward: 50,
  },
  {
    id: 'crickets',
    label: 'Awkward Silence & Crickets',
    category: 'crowd',
    phrase: '*Crickets chirping... dead quiet cough in back*',
    description: 'Total momentum kill where nobody laughs at the punchline.',
    icon: '🦗',
    performerRoast: 'Tough room, eh? 静かすぎるだろ (Too quiet in here). Even the crickets are checking their watches. Hedberg taught us: pregnant silence is just the warmup for the Super Puff drop. Times Up, Mother Fathers!',
    reactionAnimation: 'deadpan',
    comedyTheoryTakeaway: 'The Bomb Recovery Beat: Confess the silence immediately to convert awkwardness into an meta-laugh.',
    terpenePairingNote: 'Heavy Indica resin ring keeps the comedian unbothered by cold rooms.',
    xpAward: 40,
  },
  {
    id: 'drunk_woo',
    label: 'Overenthusiastic Drunk Woo',
    category: 'crowd',
    phrase: 'WOOOOOOO! YEAH DRAGON HIT THAT BONG!',
    description: 'Rowdy patron screaming at the wrong time.',
    icon: '🍻',
    performerRoast: 'Dave, settle down bro. テンション高すぎだろ (Energy is way too high, Dave). Someone get Dave a glass of water before he folds reality. Super Puff has the wheel now. Times Up, Mother Fathers!',
    reactionAnimation: 'eyebrow_raise',
    comedyTheoryTakeaway: 'Crowd Work Moderation: Channel excessive energy into a friendly reality-check without alienating the room.',
    terpenePairingNote: 'Balanced Hybrid for maintaining diplomatic politeness under loud chaos.',
    xpAward: 45,
  },
  {
    id: 'boo',
    label: 'Aggressive Crowd Boo',
    category: 'crowd',
    phrase: 'BOOOOO! You suck! Bring on the dancers!',
    description: 'Collective groan and hostile booing from the gallery.',
    icon: '👎',
    performerRoast: 'Your boos mean nothing to me; I have seen what makes your timeline cheer. ブーイングご苦労存 (Thanks for the boos, kids). Super Puff is the undisputed bigger clock on the block. 時間切れだぜ！ Times Up, Mother Fathers!',
    reactionAnimation: 'smoke_blast',
    comedyTheoryTakeaway: 'Unflinching Stoicism: Channel legendary anti-establishment defiance to win back audience respect.',
    terpenePairingNote: 'High Humulene prevents defensive anger, preserving effortless swagger.',
    xpAward: 70,
  },
];

// Speak using SpeechSynthesis with custom voice characteristics
export function speakHeckle(text: string, isPerformer = false, isSuperPuff = true) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel(); // Stop any pending speech
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Choose voice if available
    const voices = window.speechSynthesis.getVoices();
    if (isPerformer) {
      // Deep, ultra-smooth, confident baritone for Super Puff Dragon comedian
      utterance.pitch = isSuperPuff ? 0.68 : 0.75;
      utterance.rate = isSuperPuff ? 0.90 : 0.95;
      utterance.volume = 1.0;
      
      // If text contains Japanese characters, try finding a Japanese voice or default to smooth male
      const hasJapanese = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/.test(text);
      if (hasJapanese) {
        const jaVoice = voices.find(v => v.lang.includes('ja') || v.lang.includes('ja-JP'));
        if (jaVoice) {
          utterance.voice = jaVoice;
          utterance.rate = 0.92;
        }
      } else {
        const enVoice = voices.find(v => v.lang.includes('en-NZ') || v.lang.includes('en-AU') || v.lang.includes('en-GB') || v.name.toLowerCase().includes('male'));
        if (enVoice) utterance.voice = enVoice;
      }
    } else {
      // Shrill / urgent heckler voice
      utterance.pitch = 1.35;
      utterance.rate = 1.15;
      utterance.volume = 0.9;
      const hecklerVoice = voices.find(v => v.name.toLowerCase().includes('david') || v.lang.includes('en-US') || v.lang.includes('en'));
      if (hecklerVoice) utterance.voice = hecklerVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis unavailable:', err);
  }
}

// Procedural Super Puff Audio Stinger ("Times Up Mother Fathers" + Heavy Sub-bass Drop + Gong)
export function playSuperPuffDropSfx() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // 1. Massive 808 Sub-Bass Impact (85Hz -> 28Hz)
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(85, now);
    subOsc.frequency.exponentialRampToValueAtTime(28, now + 1.2);
    subGain.gain.setValueAtTime(0.7, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);
    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 1.45);

    // 2. Resonant Zen Temple Bronze Gong Harmonic (220Hz, 330Hz, 550Hz)
    [220, 330, 550, 770].forEach((freq, i) => {
      const gongOsc = ctx.createOscillator();
      const gongGain = ctx.createGain();
      gongOsc.type = 'sine';
      gongOsc.frequency.setValueAtTime(freq, now);
      gongGain.gain.setValueAtTime(0.18 / (i + 1), now);
      gongGain.gain.exponentialRampToValueAtTime(0.001, now + 2.4);
      gongOsc.connect(gongGain);
      gongGain.connect(ctx.destination);
      gongOsc.start(now);
      gongOsc.stop(now + 2.5);
    });

    // 3. Smoke Ignition Air Whoosh
    const bufferSize = ctx.sampleRate * 0.5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.15));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, now);
    filter.frequency.exponentialRampToValueAtTime(150, now + 0.45);
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.4, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
  } catch (e) {
    console.warn(e);
  }
}

// Procedural SFX for different heckle triggers
export function playHeckleSfx(type: HeckleType) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    switch (type) {
      case 'tomato': {
        // Whoosh + Splat sound
        // Whoosh (Noise buffer)
        const bufferSize = ctx.sampleRate * 0.4;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.1));
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, now);
        filter.frequency.exponentialRampToValueAtTime(300, now + 0.3);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start(now);

        // Splat impact at +0.35s
        setTimeout(() => {
          if (!audioCtx) return;
          const splatOsc = audioCtx.createOscillator();
          const splatGain = audioCtx.createGain();
          splatOsc.type = 'sawtooth';
          splatOsc.frequency.setValueAtTime(160, audioCtx.currentTime);
          splatOsc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.2);
          splatGain.gain.setValueAtTime(0.8, audioCtx.currentTime);
          splatGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
          splatOsc.connect(splatGain);
          splatGain.connect(audioCtx.destination);
          splatOsc.start();
          splatOsc.stop(audioCtx.currentTime + 0.25);
        }, 320);
        break;
      }

      case 'ringtone': {
        // Nokia tune classic 4-note cadence
        const notes = [659.25, 587.33, 369.99, 415.30, 554.37, 493.88, 293.66, 329.63];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, now + idx * 0.12);
          gain.gain.setValueAtTime(0, now + idx * 0.12);
          gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.12 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.11);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.12);
          osc.stop(now + idx * 0.12 + 0.12);
        });
        break;
      }

      case 'crickets': {
        // Crickets high-frequency chirp sequence
        for (let burst = 0; burst < 3; burst++) {
          const burstStart = now + burst * 0.45;
          for (let chirp = 0; chirp < 4; chirp++) {
            const time = burstStart + chirp * 0.04;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(4400, time);
            osc.frequency.linearRampToValueAtTime(4800, time + 0.02);
            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(0.25, time + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.03);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(time);
            osc.stop(time + 0.035);
          }
        }
        break;
      }

      case 'laser': {
        // Sci-fi high laser hum & zap
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(2200, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.25);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
        break;
      }

      case 'drunk_woo': {
        // Upward pitch bend "Wooo!"
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(650, now + 0.4);
        osc.frequency.linearRampToValueAtTime(580, now + 0.7);
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.35, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.75);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.75);
        break;
      }

      case 'boo': {
        // Low groaning crowd boo
        [110, 115, 122, 95].forEach(f => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(f, now);
          osc.frequency.linearRampToValueAtTime(f * 0.85, now + 1.2);
          gain.gain.setValueAtTime(0.05, now);
          gain.gain.linearRampToValueAtTime(0.2, now + 0.3);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 1.3);
        });
        break;
      }

      default: {
        // Mic bump / vocal blip
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.18);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
        break;
      }
    }
  } catch (err) {
    console.warn('Audio playback error:', err);
  }
}

// Crowd laughter burst SFX on great roast comeback
export function playCrowdLaughterSfx() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    // Multi-voice harmonic chuckle & applause burst
    [240, 310, 390, 480, 560].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq + (Math.random() * 30 - 15), now);
      // Warble
      for (let j = 0; j < 8; j++) {
        osc.frequency.linearRampToValueAtTime(freq + (j % 2 === 0 ? 40 : -30), now + 0.1 + j * 0.12);
      }
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.2 + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.45);
    });
  } catch (e) {
    console.warn(e);
  }
}

// Chime SFX when marking jokes Mastered vs Needs Practice
export function playMasteryChimeSfx(type: 'mastered' | 'practice' | 'punchline') {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    if (type === 'mastered') {
      // Golden ascending achievement arpeggio: C5 -> E5 -> G5 -> C6
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.08 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.36);
      });
    } else if (type === 'practice') {
      // Thoughtful tuning dual-tone: A4 -> F#4
      const notes = [440.0, 369.99];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gain.gain.setValueAtTime(0, now + idx * 0.1);
        gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.1 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.3);
      });
    } else {
      // Punchline rimshot effect (Ba-dum tsss)
      // Ba
      const osc1 = ctx.createOscillator();
      const g1 = ctx.createGain();
      osc1.frequency.setValueAtTime(140, now);
      osc1.frequency.exponentialRampToValueAtTime(45, now + 0.08);
      g1.gain.setValueAtTime(0.35, now);
      g1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc1.connect(g1);
      g1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.09);

      // Dum
      const osc2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      osc2.frequency.setValueAtTime(120, now + 0.12);
      osc2.frequency.exponentialRampToValueAtTime(40, now + 0.2);
      g2.gain.setValueAtTime(0.4, now + 0.12);
      g2.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc2.connect(g2);
      g2.connect(ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.21);

      // Tsss (Cymbal sizzle)
      const bufferSize = ctx.sampleRate * 0.45;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.12));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(5000, now + 0.22);
      const cymGain = ctx.createGain();
      cymGain.gain.setValueAtTime(0.25, now + 0.22);
      cymGain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
      noise.connect(filter);
      filter.connect(cymGain);
      cymGain.connect(ctx.destination);
      noise.start(now + 0.22);
    }
  } catch (e) {
    console.warn(e);
  }
}

// Theatrical Mode Transition SFX (Stage Spotlight vs Green Room Workshop)
export function playTheatricalModeTransitionSfx(mode: 'stage' | 'workshop') {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    if (mode === 'stage') {
      // Dual microphone tap ("thump-thump") + spotlight hum
      [0.0, 0.14].forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(110, now + delay);
        osc.frequency.exponentialRampToValueAtTime(30, now + delay + 0.07);
        gain.gain.setValueAtTime(0.3, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + delay);
        osc.stop(now + delay + 0.09);
      });

      // Warm spotlight power hum
      const humOsc = ctx.createOscillator();
      const humGain = ctx.createGain();
      humOsc.type = 'sine';
      humOsc.frequency.setValueAtTime(60, now);
      humOsc.frequency.linearRampToValueAtTime(120, now + 0.35);
      humGain.gain.setValueAtTime(0.01, now);
      humGain.gain.linearRampToValueAtTime(0.12, now + 0.15);
      humGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      humOsc.connect(humGain);
      humGain.connect(ctx.destination);
      humOsc.start(now);
      humOsc.stop(now + 0.46);
    } else {
      // Workshop mode: Lighter flick spark + cozy chime
      const sparkBuffer = ctx.sampleRate * 0.08;
      const buffer = ctx.createBuffer(1, sparkBuffer, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < sparkBuffer; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.02));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3200, now);
      const sparkGain = ctx.createGain();
      sparkGain.gain.setValueAtTime(0.2, now);
      sparkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      noise.connect(filter);
      filter.connect(sparkGain);
      sparkGain.connect(ctx.destination);
      noise.start(now);

      // Cozy green room chime: E5 -> B5
      [659.25, 987.77].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + 0.06 + idx * 0.1);
        gain.gain.setValueAtTime(0, now + 0.06 + idx * 0.1);
        gain.gain.linearRampToValueAtTime(0.15, now + 0.06 + idx * 0.1 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06 + idx * 0.1 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + 0.06 + idx * 0.1);
        osc.stop(now + 0.06 + idx * 0.1 + 0.42);
      });
    }
  } catch (e) {
    console.warn(e);
  }
}

/**
 * Dreamy Harmonic Shimmer & Sub-Bass Resonance when Super Puff's comedic timing peaks
 * Lush purple-orange psychoacoustic timbre: Eb Major 9 chord + warm analog filter sweep
 */
export function playSuperPuffPeakChime(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Master filter with warm analog resonance
    const masterFilter = ctx.createBiquadFilter();
    masterFilter.type = 'lowpass';
    masterFilter.frequency.setValueAtTime(450, now);
    masterFilter.frequency.exponentialRampToValueAtTime(3200, now + 0.7);
    masterFilter.frequency.exponentialRampToValueAtTime(600, now + 2.8);
    masterFilter.Q.setValueAtTime(3.5, now);

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.35, now);
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + 3.2);

    masterFilter.connect(masterGain);
    masterGain.connect(ctx.destination);

    // Warm deep sub-bass fundamental (43.65 Hz / F1)
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(43.65, now);
    subGain.gain.setValueAtTime(0.4, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 2.6);
    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 2.7);

    // Dreamy Ebmaj9 / F# chord tones (Hz): 311.13 (Eb4), 392.00 (G4), 466.16 (Bb4), 587.33 (D5), 739.99 (F#5)
    const chordFrequencies = [311.13, 392.00, 466.16, 587.33, 739.99, 932.33];
    chordFrequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      // Slight detune for lush purple-orange analog shimmer
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);
      osc.detune.setValueAtTime((Math.random() - 0.5) * 12, now);

      gain.gain.setValueAtTime(0, now + idx * 0.04);
      gain.gain.linearRampToValueAtTime(0.18 / (idx + 1), now + idx * 0.04 + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.2 + idx * 0.15);

      osc.connect(gain);
      gain.connect(masterFilter);

      osc.start(now + idx * 0.04);
      osc.stop(now + 2.5 + idx * 0.15);
    });
  } catch (e) {
    console.warn(e);
  }
}


