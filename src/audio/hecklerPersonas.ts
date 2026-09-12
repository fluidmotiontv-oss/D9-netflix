// Heckler Personas and Web Speech API Handler Engine
// Provides distinct audible voices and personalities for the AI Heckler Engine

export type HecklerPersonaId = 'the_heckler' | 'the_fan' | 'the_critic' | 'the_tech_bro' | 'the_drunk';

export interface HecklerPersonaSpeechConfig {
  pitch: number;        // 0.1 to 2.0 (Web Speech API pitch standard)
  rate: number;         // 0.1 to 2.0 (Web Speech API rate standard)
  volume: number;       // 0.0 to 1.0 (Web Speech API volume standard)
  voicePreferences: string[]; // Substring matches in voice name (case-insensitive)
  langPreferences: string[];  // Preferred IETF BCP 47 language codes
}

export interface HecklerPersonaConfig {
  id: HecklerPersonaId;
  name: string;
  tagline: string;
  description: string;
  avatar: string;
  imageUrl?: string;
  categoryTone: string;
  speechConfig: HecklerPersonaSpeechConfig;
  sampleLines: string[];
  color: string;
  badgeBg: string;
  borderColor: string;
}

// Ensure the paths match the generated pixel-art images
import hecklerImg from '../assets/images/persona_heckler_1789199191355.jpg';
import fanImg from '../assets/images/persona_fan_1789199213589.jpg';
import criticImg from '../assets/images/persona_critic_1789199230952.jpg';
import techBroImg from '../assets/images/persona_tech_bro_1789199247864.jpg';
import drunkImg from '../assets/images/persona_drunk_1789199264279.jpg';

export const HECKLER_PERSONAS: Record<HecklerPersonaId, HecklerPersonaConfig> = {
  the_heckler: {
    id: 'the_heckler',
    name: 'The Heckler',
    tagline: 'Rowdy Front-Row Comic Heckler',
    description: 'Sneering, impatient, high-energy comedy club troublemaker shouting insults and testing the comic\'s composure.',
    avatar: '🎙️',
    imageUrl: hecklerImg,
    categoryTone: 'Aggressive & Impatient',
    speechConfig: {
      pitch: 1.28,
      rate: 1.18,
      volume: 1.0,
      voicePreferences: ['david', 'alex', 'guy', 'male', 'mark', 'tom'],
      langPreferences: ['en-US', 'en-GB', 'en-AU', 'en-CA'],
    },
    sampleLines: [
      "Wrap it up mate! Tell an actual joke or get off the stage!",
      "We have jobs tomorrow! Where's the punchline?!",
      "I've seen louder comedy from a microwave burrito!",
      "BOOOOO! We want our cover charge back!",
    ],
    color: '#ef4444',
    badgeBg: 'bg-red-500/20 text-red-300 border-red-500/40',
    borderColor: 'border-red-500',
  },
  the_fan: {
    id: 'the_fan',
    name: 'The Fan',
    tagline: 'Over-Hyped Superfan & Stan',
    description: 'Breathless, starstruck, high-frequency enthusiast shouting unconditional love, memes, and screeching catchphrases mid-set.',
    avatar: '🤩',
    imageUrl: fanImg,
    categoryTone: 'Hyper-Enthusiastic & Breathless',
    speechConfig: {
      pitch: 1.48,
      rate: 1.24,
      volume: 0.95,
      voicePreferences: ['samantha', 'victoria', 'karen', 'zira', 'female', 'catherine', 'fiona'],
      langPreferences: ['en-AU', 'en-US', 'en-NZ', 'en-GB'],
    },
    sampleLines: [
      "WE LOVE YOU SUPER PUFF! YOU ARE AN INTERDIMENSIONAL GOD!",
      "Say 'Times Up Mother Fathers' again! Pleeeeease say it!",
      "Take all my money! Dragon 9 is the greatest alive!",
      "This 54-minute hour bit changed my entire life!",
    ],
    color: '#ec4899',
    badgeBg: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
    borderColor: 'border-pink-500',
  },
  the_critic: {
    id: 'the_critic',
    name: 'The Critic',
    tagline: 'Pretentious Comedy Theorist',
    description: 'Dry, snooty theater academic dissecting timing flaws, rhetorical structure, and metaphysical semiotics with cultured condescension.',
    avatar: '🧐',
    imageUrl: criticImg,
    categoryTone: 'Snobbish, Analytical & British',
    speechConfig: {
      pitch: 0.82,
      rate: 0.88,
      volume: 0.95,
      voicePreferences: ['daniel', 'oliver', 'george', 'hazel', 'uk', 'british', 'serena'],
      langPreferences: ['en-GB', 'en-IE', 'en-US'],
    },
    sampleLines: [
      "Your comedic syntax lacks internal cohesion. Where is the emotional vulnerability in act two?",
      "Derivative observational tropes. One expects higher semiotic rigor from a reptile.",
      "The comedic pacing is fundamentally uncalibrated for this room's acoustics.",
      "A trivial punchline masquerading as temporal existentialism. Highly unconvincing.",
    ],
    color: '#06b6d4',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    borderColor: 'border-cyan-500',
  },
  the_tech_bro: {
    id: 'the_tech_bro',
    name: 'The Tech Bro',
    tagline: 'Silicon Valley Term-Sheet Hustler',
    description: 'Fast-talking, caffeine-fueled angel investor demanding CAC-to-LTV metrics and pitch pivots to autonomous AI agents.',
    avatar: '🤖',
    imageUrl: techBroImg,
    categoryTone: 'Hyperactive Pitch & Buzzwords',
    speechConfig: {
      pitch: 1.15,
      rate: 1.34,
      volume: 0.95,
      voicePreferences: ['rishi', 'tom', 'google', 'alex', 'en-us'],
      langPreferences: ['en-US'],
    },
    sampleLines: [
      "What's your CAC to LTV ratio? Show us the unit economics or we walk!",
      "Pivot to autonomous AI agents right now or this term sheet is void!",
      "Where is the smart contract, lizard? Show us the liquidity pool!",
      "This routine doesn't scale! Have you considered tokenizing your punchlines?",
    ],
    color: '#10b981',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    borderColor: 'border-emerald-500',
  },
  the_drunk: {
    id: 'the_drunk',
    name: 'The Drunk',
    tagline: 'Last-Call VIP Table Swarm',
    description: 'Slurred, boisterous, laughing 4 seconds too late, shouting incoherently, and accidentally spilling craft beer into the stage footlights.',
    avatar: '🍺',
    imageUrl: drunkImg,
    categoryTone: 'Slurred, Deep & Unpredictable',
    speechConfig: {
      pitch: 0.68,
      rate: 0.78,
      volume: 1.0,
      voicePreferences: ['fred', 'bruce', 'male', 'david'],
      langPreferences: ['en-US', 'en-AU', 'en-GB'],
    },
    sampleLines: [
      "Woooooo! Wait... bro, what did he just say? Order another pitcher!",
      "Hey man, I love your scales! Can I pet the dragon?! Woooooo!",
      "My cousin has a dragon too! But his lives in an aquarium in Reno!",
      "*Hiccup* Keep going man, you're hilarious! Where are my keys?!",
    ],
    color: '#f59e0b',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    borderColor: 'border-amber-500',
  },
};

export const HECKLER_PERSONA_LIST = Object.values(HECKLER_PERSONAS);

export function getHecklerPersona(id: HecklerPersonaId = 'the_heckler'): HecklerPersonaConfig {
  return HECKLER_PERSONAS[id] || HECKLER_PERSONAS.the_heckler;
}

// Browser Speech Synthesis Cache & Voice Discovery
let cachedVoices: SpeechSynthesisVoice[] = [];
let voicesLoaded = false;

export function loadBrowserVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve([]);
      return;
    }

    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        cachedVoices = voices;
        voicesLoaded = true;
        resolve(voices);
      }
    };

    const current = window.speechSynthesis.getVoices();
    if (current.length > 0) {
      cachedVoices = current;
      voicesLoaded = true;
      resolve(current);
      return;
    }

    // Modern browsers fire 'onvoiceschanged' when voice list is populated asynchronously
    window.speechSynthesis.onvoiceschanged = () => {
      updateVoices();
    };

    // Fallback timer if event doesn't fire
    setTimeout(() => {
      updateVoices();
      resolve(cachedVoices);
    }, 400);
  });
}

export function getLoadedVoices(): SpeechSynthesisVoice[] {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    const list = window.speechSynthesis.getVoices();
    if (list.length > 0) {
      cachedVoices = list;
    }
  }
  return cachedVoices;
}

/**
 * Intelligent voice matching for a heckler persona
 */
export function findBestVoiceForPersona(
  persona: HecklerPersonaConfig,
  voices: SpeechSynthesisVoice[] = getLoadedVoices(),
  preferredVoiceUri?: string
): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;

  // 1. If explicit user preference provided and exists in available voices
  if (preferredVoiceUri) {
    const matched = voices.find(v => v.voiceURI === preferredVoiceUri || v.name === preferredVoiceUri);
    if (matched) return matched;
  }

  const { voicePreferences, langPreferences } = persona.speechConfig;

  // 2. Try to match preferred voice names within preferred languages
  for (const namePref of voicePreferences) {
    const found = voices.find(v => {
      const nameMatch = v.name.toLowerCase().includes(namePref.toLowerCase());
      const langMatch = langPreferences.some(l => v.lang.toLowerCase().startsWith(l.toLowerCase()));
      return nameMatch && langMatch;
    });
    if (found) return found;
  }

  // 3. Match any voice by name preference regardless of language
  for (const namePref of voicePreferences) {
    const found = voices.find(v => v.name.toLowerCase().includes(namePref.toLowerCase()));
    if (found) return found;
  }

  // 4. Match any voice by preferred language
  for (const langPref of langPreferences) {
    const found = voices.find(v => v.lang.toLowerCase().startsWith(langPref.toLowerCase()));
    if (found) return found;
  }

  // 5. Match any English voice
  const anyEnglish = voices.find(v => v.lang.toLowerCase().startsWith('en'));
  if (anyEnglish) return anyEnglish;

  // 6. Default fallback
  return voices[0] || null;
}

/**
 * Pre-cleans text for natural speech synthesis
 * Removes asterisks (e.g. *CRASH!*, *Whoosh*), formatting quotes, and cleans stage directions
 */
export function cleanHeckleTextForSpeech(text: string): string {
  if (!text) return '';
  
  // Remove markdown quotes and outer quotes
  let cleaned = text.replace(/^["'`]|["'`]$/g, '').trim();

  // If text is pure stage direction like "*CRASH! A pint glass shatters*", strip asterisks but speak words
  cleaned = cleaned.replace(/\*+/g, ' ').trim();

  // Condense spaces
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  return cleaned;
}

export interface SpeakPersonaOptions {
  pitchMultiplier?: number;
  rateMultiplier?: number;
  volume?: number;
  preferredVoiceUri?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

/**
 * Primary Web Speech API handler: Speaks text in the distinct audible voice of the chosen persona
 */
export function speakHeckleWithPersona(
  text: string,
  personaId: HecklerPersonaId = 'the_heckler',
  options: SpeakPersonaOptions = {}
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('[Heckler Voice] Web Speech API not supported in this environment.');
    return false;
  }

  const persona = getHecklerPersona(personaId);
  const speechText = cleanHeckleTextForSpeech(text);
  if (!speechText) return false;

  try {
    // Cancel any active / pending speech for immediate responsive interruption
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(speechText);
    
    // Calculate pitch, rate, volume based on persona baseline + optional user multipliers
    const pitchMult = options.pitchMultiplier ?? 1.0;
    const rateMult = options.rateMultiplier ?? 1.0;
    const volumeVal = options.volume ?? persona.speechConfig.volume;

    utterance.pitch = Math.max(0.1, Math.min(2.0, persona.speechConfig.pitch * pitchMult));
    utterance.rate = Math.max(0.1, Math.min(2.0, persona.speechConfig.rate * rateMult));
    utterance.volume = Math.max(0.0, Math.min(1.0, volumeVal));

    const voices = getLoadedVoices();
    const targetVoice = findBestVoiceForPersona(persona, voices, options.preferredVoiceUri);
    if (targetVoice) {
      utterance.voice = targetVoice;
    }

    if (options.onStart) utterance.onstart = () => options.onStart!();
    if (options.onEnd) utterance.onend = () => options.onEnd!();
    if (options.onError) utterance.onerror = (e) => options.onError!(e);

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.warn('[Heckler Voice] SpeechSynthesis execution failed:', err);
    if (options.onError) options.onError(err);
    return false;
  }
}

/**
 * Audition / Preview a Heckler Persona's distinct voice
 */
export function auditionPersonaVoice(
  personaId: HecklerPersonaId,
  customPhrase?: string,
  options: SpeakPersonaOptions = {}
): boolean {
  const persona = getHecklerPersona(personaId);
  const samplePhrase = customPhrase || 
    persona.sampleLines[Math.floor(Math.random() * persona.sampleLines.length)];

  return speakHeckleWithPersona(samplePhrase, personaId, options);
}

/**
 * Stop any active audible speech immediately (Silence Shield / Mute)
 */
export function stopAllSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      // Ignore
    }
  }
}
