/**
 * Crowd Audio Synthesis Engine (Web Audio API)
 * Procedural crowd responses: Laughter, Applause, Booing, Cheers, Gasps, Crickets, and Foot Stomping.
 */

let sharedAudioContext: AudioContext | null = null;

export function getAudioContext(): AudioContext {
  if (!sharedAudioContext) {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    sharedAudioContext = new AudioCtx();
  }
  if (sharedAudioContext.state === 'suspended') {
    sharedAudioContext.resume().catch(() => {});
  }
  return sharedAudioContext;
}

export type CrowdReactionType = 
  | 'laugh_burst' 
  | 'laugh_giggle' 
  | 'laugh_roar'
  | 'applause_light' 
  | 'applause_roar' 
  | 'applause_standing'
  | 'boo_groan' 
  | 'boo_harsh'
  | 'cheer_whistle' 
  | 'cheer_stadium'
  | 'gasp_shock' 
  | 'gasp_awe'
  | 'crickets_awkward' 
  | 'foot_stomp';

export interface CrowdReactionItem {
  id: CrowdReactionType;
  label: string;
  category: 'laughter' | 'applause' | 'boo' | 'cheer' | 'gasp' | 'silence';
  emoji: string;
  description: string;
  hotkey: string;
  intensity: 'low' | 'medium' | 'high' | 'epic';
  color: string;
  composureDelta: number;
}

export const CROWD_REACTIONS: CrowdReactionItem[] = [
  {
    id: 'laugh_burst',
    label: 'Punchline Laugh',
    category: 'laughter',
    emoji: '😂',
    description: 'Instant synchronized room laughter on a solid joke punchline',
    hotkey: '1',
    intensity: 'medium',
    color: '#f59e0b',
    composureDelta: 10,
  },
  {
    id: 'laugh_roar',
    label: 'Roaring Belly Laugh',
    category: 'laughter',
    emoji: '🤣',
    description: 'Deafening, rolling room laughter that shakes the green room',
    hotkey: 'Shift+1',
    intensity: 'high',
    color: '#ea580c',
    composureDelta: 20,
  },
  {
    id: 'laugh_giggle',
    label: 'Stifled Snickers',
    category: 'laughter',
    emoji: '🤭',
    description: 'Subtle, contagious front-row giggles and snorting',
    hotkey: 'Alt+1',
    intensity: 'low',
    color: '#fbbf24',
    composureDelta: 5,
  },
  {
    id: 'applause_roar',
    label: 'Enthusiastic Applause',
    category: 'applause',
    emoji: '👏',
    description: 'Rousing two-handed room applause across the whole venue',
    hotkey: '2',
    intensity: 'medium',
    color: '#10b981',
    composureDelta: 15,
  },
  {
    id: 'applause_standing',
    label: 'Standing Ovation',
    category: 'applause',
    emoji: '🙌',
    description: 'Massive standing ovation with whistles and cheers',
    hotkey: 'Shift+2',
    intensity: 'epic',
    color: '#059669',
    composureDelta: 25,
  },
  {
    id: 'applause_light',
    label: 'Polite Golf Clap',
    category: 'applause',
    emoji: '👏',
    description: 'Mild, hesitant polite clapping from the back corner',
    hotkey: 'Alt+2',
    intensity: 'low',
    color: '#34d399',
    composureDelta: 2,
  },
  {
    id: 'boo_groan',
    label: 'Crowd Groan & Boo',
    category: 'boo',
    emoji: '👎',
    description: 'Deep collective groan / "Booo!" for a terrible pun or pitch line',
    hotkey: '3',
    intensity: 'medium',
    color: '#ef4444',
    composureDelta: -12,
  },
  {
    id: 'boo_harsh',
    label: 'Hostile Jeers',
    category: 'boo',
    emoji: '😡',
    description: 'Intense front-row heckling groans and jeers',
    hotkey: 'Shift+3',
    intensity: 'high',
    color: '#b91c1c',
    composureDelta: -20,
  },
  {
    id: 'cheer_whistle',
    label: 'Whistles & "WOOO!"',
    category: 'cheer',
    emoji: '🥳',
    description: 'High-pitch party whistles and enthusiastic crowd whoops',
    hotkey: '4',
    intensity: 'medium',
    color: '#8b5cf6',
    composureDelta: 14,
  },
  {
    id: 'cheer_stadium',
    label: 'Stadium Hype Cheer',
    category: 'cheer',
    emoji: '🔥',
    description: 'Full-room thunderous roar of excitement and approval',
    hotkey: 'Shift+4',
    intensity: 'epic',
    color: '#7c3aed',
    composureDelta: 22,
  },
  {
    id: 'gasp_shock',
    label: 'Shocked Inhale Gasp',
    category: 'gasp',
    emoji: '😱',
    description: 'Collective sharp intake of breath at an edgy taboo line',
    hotkey: '5',
    intensity: 'medium',
    color: '#06b6d4',
    composureDelta: -4,
  },
  {
    id: 'gasp_awe',
    label: 'Mind-Blown "Oooooh"',
    category: 'gasp',
    emoji: '🤯',
    description: 'Harmonic awe and impressed murmuring from the audience',
    hotkey: 'Shift+5',
    intensity: 'high',
    color: '#3b82f6',
    composureDelta: 18,
  },
  {
    id: 'crickets_awkward',
    label: 'Awkward Crickets',
    category: 'silence',
    emoji: '🦗',
    description: 'Dead silence punctuated by chirping crickets and air hum',
    hotkey: '6',
    intensity: 'low',
    color: '#64748b',
    composureDelta: -15,
  },
  {
    id: 'foot_stomp',
    label: 'Stadium Foot Stomps',
    category: 'cheer',
    emoji: '🥁',
    description: 'Rhythmic floor stomping chanting for an encore',
    hotkey: 'Shift+6',
    intensity: 'high',
    color: '#d97706',
    composureDelta: 16,
  },
];

/**
 * Procedural Audio Synthesizers for Crowd Reactions
 */
export function playCrowdReaction(type: CrowdReactionType, volume: number = 0.8): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(Math.max(0.1, Math.min(1.5, volume)), now);
    masterGain.connect(ctx.destination);

    switch (type) {
      case 'laugh_burst':
      case 'laugh_roar':
      case 'laugh_giggle': {
        const isRoar = type === 'laugh_roar';
        const isGiggle = type === 'laugh_giggle';
        const chuckleCount = isRoar ? 14 : isGiggle ? 5 : 8;
        const baseDuration = isRoar ? 2.8 : isGiggle ? 1.2 : 1.8;

        // Multiple voice layers (male, female, deep harmonics)
        const voicePitches = isRoar 
          ? [180, 220, 260, 310, 420, 520, 640] 
          : isGiggle 
          ? [450, 520, 680, 780] 
          : [210, 270, 340, 480, 580];

        voicePitches.forEach((basePitch, vIdx) => {
          const stereoPan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
          if (stereoPan) {
            stereoPan.pan.setValueAtTime((vIdx / (voicePitches.length - 1)) * 1.6 - 0.8, now);
            stereoPan.connect(masterGain);
          }

          for (let i = 0; i < chuckleCount; i++) {
            const chuckleDelay = i * (isGiggle ? 0.08 : 0.12) + (Math.random() * 0.04);
            const startTime = now + chuckleDelay;
            const chuckleDuration = isGiggle ? 0.07 : 0.11;

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = isRoar ? 'sawtooth' : 'triangle';
            
            // "Ha ha ha" formant frequency pitch dip
            const freq = basePitch * (1 + (Math.random() * 0.2 - 0.1));
            osc.frequency.setValueAtTime(freq * 1.2, startTime);
            osc.frequency.exponentialRampToValueAtTime(freq * 0.85, startTime + chuckleDuration);

            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(freq * 2.2, startTime);
            filter.Q.setValueAtTime(2.5, startTime);

            // Envelope decay across the laugh
            const overallDecay = Math.max(0.1, 1 - (i / chuckleCount) * 0.7);
            const chuckleVol = (isRoar ? 0.22 : isGiggle ? 0.12 : 0.18) * overallDecay;

            gain.gain.setValueAtTime(0.001, startTime);
            gain.gain.linearRampToValueAtTime(chuckleVol, startTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + chuckleDuration);

            osc.connect(filter);
            filter.connect(gain);
            if (stereoPan) {
              gain.connect(stereoPan);
            } else {
              gain.connect(masterGain);
            }

            osc.start(startTime);
            osc.stop(startTime + chuckleDuration + 0.01);
          }
        });
        break;
      }

      case 'applause_light':
      case 'applause_roar':
      case 'applause_standing': {
        const isStanding = type === 'applause_standing';
        const isLight = type === 'applause_light';
        const duration = isStanding ? 4.5 : isLight ? 1.8 : 3.0;

        // Noise buffer for continuous collective crowd clapping texture
        const bufferSize = Math.floor(ctx.sampleRate * duration);
        const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
        const leftData = buffer.getChannelData(0);
        const rightData = buffer.getChannelData(1);

        for (let i = 0; i < bufferSize; i++) {
          const t = i / ctx.sampleRate;
          // Clapping pulse density modulation
          const clapDensity = (Math.sin(t * 14 * Math.PI) + 1) * 0.5;
          const randomPulse = Math.random() < (isLight ? 0.15 : isStanding ? 0.45 : 0.3) ? (Math.random() * 2 - 1) : 0;
          const baseNoise = (Math.random() * 2 - 1) * 0.25;
          
          // Attack - Sustain - Decay envelope
          let env = 1;
          if (t < 0.4) env = t / 0.4;
          else if (t > duration - 0.8) env = (duration - t) / 0.8;

          leftData[i] = (baseNoise + randomPulse * clapDensity) * env * (isStanding ? 0.7 : isLight ? 0.3 : 0.5);
          rightData[i] = ((Math.random() * 2 - 1) * 0.25 + randomPulse * clapDensity) * env * (isStanding ? 0.7 : isLight ? 0.3 : 0.5);
        }

        const noiseNode = ctx.createBufferSource();
        noiseNode.buffer = buffer;

        // Bandpass filter to model hands slapping together acoustically
        const bandpass = ctx.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.frequency.setValueAtTime(isLight ? 1600 : 1250, now);
        bandpass.Q.setValueAtTime(1.8, now);

        const applauseGain = ctx.createGain();
        applauseGain.gain.setValueAtTime(0.8, now);
        applauseGain.gain.exponentialRampToValueAtTime(0.01, now + duration);

        noiseNode.connect(bandpass);
        bandpass.connect(applauseGain);
        applauseGain.connect(masterGain);

        noiseNode.start(now);
        noiseNode.stop(now + duration + 0.1);

        // If standing ovation, add energetic crowd cheering whistles
        if (isStanding) {
          [0.3, 0.8, 1.4, 2.1].forEach((delay, idx) => {
            const whistleOsc = ctx.createOscillator();
            const whistleGain = ctx.createGain();
            whistleOsc.type = 'sine';
            const wStart = now + delay;
            const wDur = 0.6;
            const startFreq = 2200 + idx * 400;
            whistleOsc.frequency.setValueAtTime(startFreq, wStart);
            whistleOsc.frequency.linearRampToValueAtTime(startFreq + 600, wStart + 0.2);
            whistleOsc.frequency.exponentialRampToValueAtTime(startFreq - 300, wStart + wDur);

            whistleGain.gain.setValueAtTime(0.001, wStart);
            whistleGain.gain.linearRampToValueAtTime(0.18, wStart + 0.1);
            whistleGain.gain.exponentialRampToValueAtTime(0.001, wStart + wDur);

            whistleOsc.connect(whistleGain);
            whistleGain.connect(masterGain);
            whistleOsc.start(wStart);
            whistleOsc.stop(wStart + wDur + 0.05);
          });
        }
        break;
      }

      case 'boo_groan':
      case 'boo_harsh': {
        const isHarsh = type === 'boo_harsh';
        const duration = isHarsh ? 2.6 : 2.0;
        const groanFrequencies = isHarsh 
          ? [82, 98, 110, 123, 146, 164] 
          : [92, 110, 118, 130];

        groanFrequencies.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          osc.type = isHarsh ? 'sawtooth' : 'triangle';
          // Boo downward groaning pitch slide
          osc.frequency.setValueAtTime(freq, now + idx * 0.04);
          osc.frequency.linearRampToValueAtTime(freq * 0.78, now + duration);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(450, now);
          filter.frequency.linearRampToValueAtTime(280, now + duration);

          gain.gain.setValueAtTime(0.01, now);
          gain.gain.linearRampToValueAtTime(isHarsh ? 0.25 : 0.16, now + 0.4);
          gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(masterGain);

          osc.start(now + idx * 0.04);
          osc.stop(now + duration + 0.05);
        });
        break;
      }

      case 'cheer_whistle':
      case 'cheer_stadium': {
        const isStadium = type === 'cheer_stadium';
        const duration = isStadium ? 3.5 : 2.2;

        // Roaring crowd frequency wash
        [240, 320, 480, 620, 780, 940].forEach((f, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(f, now + idx * 0.05);
          osc.frequency.linearRampToValueAtTime(f * 1.35, now + 0.6);
          osc.frequency.linearRampToValueAtTime(f * 0.9, now + duration);

          const filter = ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(f * 1.8, now);

          gain.gain.setValueAtTime(0.01, now);
          gain.gain.linearRampToValueAtTime(isStadium ? 0.15 : 0.1, now + 0.4);
          gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(masterGain);

          osc.start(now + idx * 0.05);
          osc.stop(now + duration);
        });

        // Sharp party whistles
        [0.1, 0.5, 1.1].forEach((delay, idx) => {
          const wOsc = ctx.createOscillator();
          const wGain = ctx.createGain();
          wOsc.type = 'sine';
          const start = now + delay;
          const freq = 2600 + idx * 350;
          wOsc.frequency.setValueAtTime(freq, start);
          wOsc.frequency.linearRampToValueAtTime(freq + 700, start + 0.25);
          wOsc.frequency.exponentialRampToValueAtTime(freq - 400, start + 0.7);

          wGain.gain.setValueAtTime(0.001, start);
          wGain.gain.linearRampToValueAtTime(0.2, start + 0.1);
          wGain.gain.exponentialRampToValueAtTime(0.001, start + 0.7);

          wOsc.connect(wGain);
          wGain.connect(masterGain);
          wOsc.start(start);
          wOsc.stop(start + 0.72);
        });
        break;
      }

      case 'gasp_shock':
      case 'gasp_awe': {
        const isShock = type === 'gasp_shock';
        const duration = isShock ? 0.8 : 1.6;

        if (isShock) {
          // Sharp collective inhaled noise gasp
          const bufferSize = Math.floor(ctx.sampleRate * duration);
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
          }
          const noise = ctx.createBufferSource();
          noise.buffer = buffer;

          const filter = ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(800, now);
          filter.frequency.linearRampToValueAtTime(2200, now + 0.3); // Upward pitch shift

          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0.01, now);
          gain.gain.linearRampToValueAtTime(0.35, now + 0.15);
          gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

          noise.connect(filter);
          filter.connect(gain);
          gain.connect(masterGain);
          noise.start(now);
        } else {
          // Awe "Oooooh" choral resonance
          [220, 277.18, 329.63, 440].forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);
            osc.frequency.linearRampToValueAtTime(freq * 1.08, now + 0.4);
            osc.frequency.exponentialRampToValueAtTime(freq * 0.95, now + duration);

            gain.gain.setValueAtTime(0.01, now);
            gain.gain.linearRampToValueAtTime(0.14, now + 0.3);
            gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(now);
            osc.stop(now + duration + 0.05);
          });
        }
        break;
      }

      case 'crickets_awkward': {
        // High frequency chirps (4.8kHz to 5.2kHz rhythm)
        const chirpCount = 6;
        for (let i = 0; i < chirpCount; i++) {
          const chirpTime = now + i * 0.32;
          for (let sub = 0; sub < 3; sub++) {
            const subTime = chirpTime + sub * 0.04;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(4900, subTime);
            osc.frequency.setValueAtTime(5300, subTime + 0.015);
            gain.gain.setValueAtTime(0.12, subTime);
            gain.gain.exponentialRampToValueAtTime(0.001, subTime + 0.035);

            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(subTime);
            osc.stop(subTime + 0.04);
          }
        }
        break;
      }

      case 'foot_stomp': {
        // Low thunderous stadium thuds (55Hz - 85Hz with fast decay)
        const stompCount = 4;
        for (let i = 0; i < stompCount; i++) {
          const sTime = now + i * 0.55;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(95, sTime);
          osc.frequency.exponentialRampToValueAtTime(42, sTime + 0.25);

          gain.gain.setValueAtTime(0.45, sTime);
          gain.gain.exponentialRampToValueAtTime(0.001, sTime + 0.35);

          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(sTime);
          osc.stop(sTime + 0.36);
        }
        break;
      }

      default:
        break;
    }
  } catch (e) {
    console.warn("Crowd audio synthesis note:", e);
  }
}
