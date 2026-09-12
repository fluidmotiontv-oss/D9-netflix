// Video Export Utility Engine for Dragon 9 Synchronized Time AI Studio
// Segments the 18-minute performance special into 1-minute and 3-minute highlight clips
// with synchronized procedural audio & speech synthesis, utilizing timing markers [pause: X.Xs]
// to keep pacing and comedic cadence intact across EN and localized versions (DE, ES, FR, JA).

import { ScriptCue } from './scriptTimedCues';
import { 
  SupportedLanguage, 
  parseTimingMarkers, 
  STANDUP_LOCALIZATION_DATASET,
  TimingBlock 
} from './localizationData';

export interface PerformanceHighlightClip {
  id: string;
  clipType: '1-minute' | '3-minute' | '15s-teaser';
  targetDurationSeconds: number;
  actId: string;
  actTitle: string;
  actTimecodeRange: string;
  highlightTheme: string;
  strainPairing: string;
  primaryEnergy: 'system-shock' | 'absurdist-escalation' | 'apex-climax' | 'crowd-roast';
  cues: ScriptCue[];
  suggestedAspectRatio: '9:16' | '16:9';
  viralityHook: string;
  socialPlatforms: string[];
}

export interface HighlightSegmentPreset {
  id: string;
  title: string;
  duration: 60 | 180;
  actSource: 'act_01_threshold' | 'act_02_deep_tuning' | 'act_03_jikan_gire' | 'full_special';
  description: string;
  punchlineTimestamp: number;
  tags: string[];
}

// Pre-configured highlight segments for the 18-Minute Apex Special
export const HIGHLIGHT_PRESETS: HighlightSegmentPreset[] = [
  {
    id: 'highlight-act1-1m',
    title: 'Act I: The Sumerian Knuckle Deconstruction',
    duration: 60,
    actSource: 'act_01_threshold',
    description: 'System shock hook breaking down the 5,000-year knuckle origin of 60-minute linear dogma.',
    punchlineTimestamp: 54,
    tags: ['Hook', 'System Shock', 'Sumerian Knuckles', '60s Short']
  },
  {
    id: 'highlight-act2-1m',
    title: 'Act II: The 45-Second Microwave Portal',
    duration: 60,
    actSource: 'act_02_deep_tuning',
    description: 'Cosmic detour into kitchen microwaves, 40 light-year mental trips, and Dragon 9 negative space.',
    punchlineTimestamp: 53,
    tags: ['Microwave', 'Cosmic Trip', 'Dragon 9 Protocol', '60s Viral']
  },
  {
    id: 'highlight-act3-1m',
    title: 'Act III: The Apex Mic Drop (Times Up)',
    duration: 60,
    actSource: 'act_03_jikan_gire',
    description: 'The definitive 60s closer: 27° hyperspace pitch, golden iris flare, and the liquid mercury mic drop.',
    punchlineTimestamp: 52,
    tags: ['Mic Drop', 'Bigger Clock', 'Climax', '60s Reel']
  },
  {
    id: 'highlight-act1-3m',
    title: 'Act I (Full Master): The Threshold & Baseline',
    duration: 180,
    actSource: 'act_01_threshold',
    description: 'Full 3-minute broadcast cut: CRT static tear, supermarket conveyor belt parable, and corporate traffic panic.',
    punchlineTimestamp: 168,
    tags: ['Full Cut', 'Theatrical', 'Broadcast', 'YouTube Showcase']
  },
  {
    id: 'highlight-act2-3m',
    title: 'Act II (Full Master): The Deep Tuning & 54-Min Harmonic',
    duration: 180,
    actSource: 'act_02_deep_tuning',
    description: 'Extended 3-minute exploration of temporal distortion, Tokyo crowd roasts, and 26.66-hour harmonics.',
    punchlineTimestamp: 170,
    tags: ['Harmonic', 'Stand-up Craft', 'Deep Tuning', '3-Min Master']
  },
  {
    id: 'highlight-act3-3m',
    title: 'Act III (Full Master): Jikan Gire & The Antidotal Exit',
    duration: 180,
    actSource: 'act_03_jikan_gire',
    description: 'Full 3-minute grand finale: 18-minute Apex special summary, 34.5% THC haze, and violet smoke-out.',
    punchlineTimestamp: 172,
    tags: ['Grand Finale', 'Apex Mark', 'Smoke-Out', '180s Theatrical']
  }
];

// Generates 1-Minute Highlight Cues with strict pacing markers
export function build1MinuteHighlightCues(
  actId: string, 
  language: SupportedLanguage | 'EN' = 'EN'
): ScriptCue[] {
  // If a localized language is chosen, pull from our verified dataset with embedded [pause: X.Xs] timing
  if (language !== 'EN') {
    return buildLocalizedHighlightCues(actId, 60, language);
  }

  if (actId === 'act_02_deep_tuning' || actId === 'highlight-act2-1m') {
    return [
      {
        id: 'h1',
        startTime: 0,
        endTime: 10,
        spokenText: "You ever stare at a microwave for sixty seconds and realize your brain traveled forty light years across the galaxy?",
        visualCue: "Close-up on Super Puff dragon in neon cyber-hoodie, golden iris glowing, smoke ring forming microwave dial",
        audioCue: "Deep 432Hz ambient sub-drone with lo-fi vinyl crackle fade-in",
        pacingNote: "Deadpan conversational hook. Twist imaginary knob at 4s.",
      },
      {
        id: 'h2',
        startTime: 10,
        endTime: 22,
        spokenText: "Forty-five seconds on a kitchen plate feels longer than a four-year university degree. You evaluate your primary school choices and review your 2018 tax return.",
        visualCue: "Stage walls melt into fluid chromatic metal vibrating in sync with voice pitch",
        audioCue: "Muted rimshot, bubbling water pipe stem foley",
        pacingNote: "Rapid observational build, deadpan stare at audience [pause: 0.6s]",
      },
      {
        id: 'h3',
        startTime: 22,
        endTime: 34,
        spokenText: "We’re out here running on the Dragon 9 Protocol: 54-minute hours, 26.66-hour cycles. You feel that extra negative space between the seconds?",
        visualCue: "54-minute glowing fluid clock rotates behind performer, neon vector lines shoot across stage",
        audioCue: "16-step modular synth sequence swells, sub-bass harmonic resonance",
        pacingNote: "Lean forward toward mic, rhythmic emphasis on '54-minute hours'",
      },
      {
        id: 'h4',
        startTime: 34,
        endTime: 46,
        spokenText: "That’s where comedy lives. That’s where you stop sweating an uncalibrated Monday calendar. お前ら、時間を舐めてるだろ？",
        visualCue: "Chromatic aberration ripple, Japanese subtitle overlay: (You lot really take time for granted, huh?)",
        audioCue: "Sub-bass 40Hz drop, distant crowd chuckle swell",
        pacingNote: "Bilingual Tokyo shift, razor-sharp swagger [pause: 0.8s]",
      },
      {
        id: 'h5',
        startTime: 46,
        endTime: 53,
        spokenText: "I am Super Puff, the bigger clock on this block. Hold your breath and surrender your linear illusions.",
        visualCue: "Super Puff raises glowing liquid chrome mic, violet smoke expands to fill stage canvas",
        audioCue: "Heavy 808 sub kick, glass crystal resonance",
        pacingNote: "Supreme status build, slow pregnant pause before punchline [pause: 1.2s]",
      },
      {
        id: 'h6',
        startTime: 53,
        endTime: 60,
        spokenText: "Times Up, Mother Fathers! Snap back to reality.",
        visualCue: "Explosive chromatic drift flash, mic drops into liquid mercury, glowing Kanji emblem (超煙・超時)",
        audioCue: "Thunderous crowd roar and laughter eruption, low-pass reverb tail",
        pacingNote: "Signature explosive punchline delivery, mic drop",
        isPunchline: true,
      }
    ];
  }

  if (actId === 'act_03_jikan_gire' || actId === 'highlight-act3-1m') {
    return [
      {
        id: 'h1',
        startTime: 0,
        endTime: 11,
        spokenText: "Time flies when you’re bending the continuum. Look at the clock—18 minutes right on the Apex mark. Zero wasted energy.",
        visualCue: "Wide cinematic stage, volumetric violet light beams piercing through pitch-black void",
        audioCue: "Resonant 432Hz ambient sub-bass drone, warm vinyl surface crackle",
        pacingNote: "Relaxed status, calm breath with cosmic rig in hand",
      },
      {
        id: 'h2',
        startTime: 11,
        endTime: 23,
        spokenText: "When you pitch a temporal tent at a twenty-seven degree tilt in hyperspace, standard gravity resigns. Not ideal for calendars, but legendary for us.",
        visualCue: "Stage floor transforms into reflective dark glass displaying floating kanji coordinates",
        audioCue: "Muted 808 hi-hat shuffle, distant crowd murmur",
        pacingNote: "Supreme comedic confidence, disarming half-smile [pause: 0.7s]",
      },
      {
        id: 'h3',
        startTime: 23,
        endTime: 36,
        spokenText: "You’ve spent your entire life running on Bronze Age Sumerian knuckle math. Aren't you tired of apologizing to your microwave?",
        visualCue: "Holographic Sumerian knuckles crumble into glittering cosmic ash",
        audioCue: "Crystal harmonic chime, long bubbling water pipe foley",
        pacingNote: "Intimate rhetorical challenge to audience",
      },
      {
        id: 'h4',
        startTime: 36,
        endTime: 46,
        spokenText: "We take the extra six minutes and turn it into negative space. That’s where the punchline lands.",
        visualCue: "Super Puff raises glowing liquid chrome microphone, smoke coils around body",
        audioCue: "Low-frequency sub swell building toward drop",
        pacingNote: "Measured, deliberate cadence [pause: 1.0s]",
      },
      {
        id: 'h5',
        startTime: 46,
        endTime: 53,
        spokenText: "I am Super Puff, the bigger clock on this block. じゃあな、良い夢見ろよ (See ya, have sweet dreams).",
        visualCue: "Performer takes monstrous final rip from cosmic rig, violet smoke engulfs stage apron",
        audioCue: "40Hz sub impact, vinyl low-pass filter sweeps down",
        pacingNote: "Pre-punchline pregnant pause [pause: 1.4s]",
      },
      {
        id: 'h6',
        startTime: 53,
        endTime: 60,
        spokenText: "Times Up, Mother Fathers!",
        visualCue: "Mic drops to floor, turning into liquid mercury. Cloud collapses into glowing chrome kanji 超煙・超時",
        audioCue: "Thunderous standing ovation, crowd cheer, bass explosion",
        pacingNote: "Explosive climactic mic drop",
        isPunchline: true,
      }
    ];
  }

  // Default: Act I (Sumerian Knuckle Deconstruction)
  return [
    {
      id: 'h1',
      startTime: 0,
      endTime: 10,
      spokenText: "Welcome to the baseline. You divided your entire human existence into sixty minutes because some Sumerians looked at their knuckles? Yeah, nah.",
      visualCue: "Wide shot of animated Super Puff dragon on dark reflective stage, smoke swirling in neon aqua",
      audioCue: "Analog CRT static pop, heavy 432Hz sub-bass ambient hum",
      pacingNote: "Dry conversational hook, relaxed posture with glowing blunt",
    },
    {
      id: 'h2',
      startTime: 10,
      endTime: 22,
      spokenText: "Five thousand years later, you’re having an existential panic attack in traffic because you're four minutes late to an Excel spreadsheet review? Cheers for that, Gilgamesh.",
      visualCue: "CRT scanlines dissolve into anime cyberpunk neon, floating analog clock ticks backward",
      audioCue: "Muted rimshot, subtle bong water bubbling foley",
      pacingNote: "Deadpan intimacy on 'Gilgamesh', hold pause [pause: 1.2s]",
    },
    {
      id: 'h3',
      startTime: 22,
      endTime: 35,
      spokenText: "Listen to me closely: linear time is an illusion. We operate on the Dragon 9 Protocol: 54-minute hours, fluid temporal geometry. That extra space is pure agency.",
      visualCue: "54-minute neon fluid clock rotates behind performer, neon vector lines shoot across stage",
      audioCue: "16-step modular synth sequence swells, sub-bass harmonic resonance",
      pacingNote: "Assertive eye contact through smoke rings",
    },
    {
      id: 'h4',
      startTime: 35,
      endTime: 47,
      spokenText: "お前ら、時間を舐めてるだろ？ Look at Dave in row two—completely frozen. When Super Puff drops the tempo, even your mortgage panic is in slow motion.",
      visualCue: "Chromatic pitch shift ripples across dragon scales, audience silhouettes illuminated in violet",
      audioCue: "Spatial stereo pan, crowd chuckle murmur",
      pacingNote: "Bilingual Japanese transition, playful crowd work gesture [pause: 0.9s]",
    },
    {
      id: 'h5',
      startTime: 47,
      endTime: 53,
      spokenText: "I am Super Puff, the bigger clock on this block.",
      visualCue: "Close-up on golden iris glow, smoke exhaled directly toward camera lens",
      audioCue: "40Hz sub-bass drop, pregnant pause silence [pause: 1.4s]",
      pacingNote: "Supreme authority, pause right before drop",
    },
    {
      id: 'h6',
      startTime: 53,
      endTime: 60,
      spokenText: "Times Up, Mother Fathers!",
      visualCue: "Super-puff-chromatic keyframe flash, stage dissolves into glowing liquid chrome emblem 超煙・超時",
      audioCue: "Massive crowd cheer & laughter burst, 808 sub impact",
      pacingNote: "Explosive, authoritative mic drop",
      isPunchline: true,
    }
  ];
}

// Generates 3-Minute Master Highlight Cues
export function build3MinuteHighlightCues(
  actId: string,
  language: SupportedLanguage | 'EN' = 'EN'
): ScriptCue[] {
  if (language !== 'EN') {
    return buildLocalizedHighlightCues(actId, 180, language);
  }

  return [
    {
      id: 'c1',
      startTime: 0,
      endTime: 18,
      spokenText: "Yeah nah... check. One, two. Is this venue calibrated to harmonic resonance, or are we still operating on standard linear drift? Welcome to the baseline.",
      visualCue: "Dark reflective glass stage, harsh CRT static crackle tears open to reveal Super Puff in oversized street hoodie with glowing chrome trims",
      audioCue: "Analog static tear, 432Hz deep resonant sub-bass drop shaking room tone, lo-fi vinyl groove enters",
      pacingNote: "Slow, deliberate soundcheck casualness. Twist imaginary dial in mid-air.",
    },
    {
      id: 'c2',
      startTime: 18,
      endTime: 36,
      spokenText: "Secure your seatbelts, family—we’re skipping the warm-up entirely. You ever notice how humans treat time like a conveyor belt at a supermarket checkout?",
      visualCue: "Spotlight warms to amber, camera glides from stage right to medium close-up, smoke begins to drift",
      audioCue: "Vinyl room tone, soft ride cymbal on beat 2 and 4",
      pacingNote: "Conversational storytelling cadence, hands relaxed in hoodie pockets.",
    },
    {
      id: 'c3',
      startTime: 36,
      endTime: 55,
      spokenText: "Just standing there watching your precious minutes slide past like a cold loaf of bread and a dented tin of baked beans. 'Oh, I've got a meeting at 2:00 PM.' Why? Who chose 2:00 PM?",
      visualCue: "Holographic supermarket conveyor belt animates across stage apron, fading into clock hands",
      audioCue: "Muted rimshots, crowd chuckle ripple in front rows",
      pacingNote: "Subtle vocal mimicry of corporate urgency, followed by deadpan silence [pause: 0.8s].",
    },
    {
      id: 'c4',
      startTime: 55,
      endTime: 78,
      spokenText: "Who agreed that sixty minutes makes an hour? Five thousand years ago, Bronze Age Sumerians counted the twelve phalanges on their four fingers using their thumb. That’s it. That’s the grand architecture of your mortgage.",
      visualCue: "Neon golden knuckles map vector coordinates in mid-air, dissolving into Sumerian cuneiform symbols",
      audioCue: "Resonant crystal chime, bubbling glass rig foley with long water draw",
      pacingNote: "Historical breakdown delivered with everyday Kiwi informality. Take a slow pull on the blunt at 72s.",
    },
    {
      id: 'c5',
      startTime: 78,
      endTime: 102,
      spokenText: "Now you’re having a panic attack on the motorway because you’re four minutes late to review an Excel spreadsheet about quarterly synergized deliverables. Cheers for that, Gilgamesh. Just a bit silly, isn’t it?",
      visualCue: "Stage lighting flashes cold fluorescent blue, then settles into warm violet terpene haze",
      audioCue: "Sub-bass 40Hz drop on 'Gilgamesh', loud laughter burst from crowd",
      pacingNote: "Deadpan intimacy on 'Gilgamesh'. Hold pregnant pause for exactly 1.6 seconds [pause: 1.6s].",
      isPunchline: true,
    },
    {
      id: 'c6',
      startTime: 102,
      endTime: 126,
      spokenText: "We’re out here running on the Dragon 9 Protocol: 54-minute hours, 26.66-hour cycles. You feel that extra negative space between the seconds? That’s where human agency lives. That’s where the joke breathes.",
      visualCue: "Full 54-minute fluid geometry clock blooms behind performer, gears rotating counter-clockwise",
      audioCue: "Warm analog synth pad swell, harmonic 54-minute bell chime at 114s",
      pacingNote: "Philosophical elevation, expansive arm gesture framing the temporal clock.",
    },
    {
      id: 'c7',
      startTime: 126,
      endTime: 148,
      spokenText: "Pairing this with Cosmic OG. If you feel like your feet aren't touching the carpet anymore... good. That means your internal calibration is working. お前ら、時間を舐めてるだろ？",
      visualCue: "Terpene profile badge animates top-right (Myrcene 2.8%), dragon eyes illuminate in golden Super Puff aura",
      audioCue: "Spatial stereo panning, bubbling water pipe stem foley",
      pacingNote: "Bilingual Japanese transition, disarming swagger, slight smirk toward camera [pause: 0.9s].",
    },
    {
      id: 'c8',
      startTime: 148,
      endTime: 168,
      spokenText: "When you pitch a temporal tent at a 27-degree angle in hyperspace, standard gravity resigns. Not ideal for linear calendars, but legendary for us. I am Super Puff, the bigger clock on this block.",
      visualCue: "Camera pulls back to extreme wide cinematic view, chromatic aberration keyframes activate on stage edges",
      audioCue: "Deep 808 sub bass swell, crowd cheering builds in volume",
      pacingNote: "Supreme vocal projection, building to climactic crescendo [pause: 1.2s].",
    },
    {
      id: 'c9',
      startTime: 168,
      endTime: 180,
      spokenText: "Times Up, Mother Fathers! じゃあな、良い夢見ろよ (See ya, sweet dreams).",
      visualCue: "Mic drops to floor, turning into liquid mercury. Performer exhales giant violet cloud swallowing entire frame into glowing chrome Kanji 超煙・超時",
      audioCue: "Massive standing ovation crowd roar, echoing low-pass delay, final gong strike",
      pacingNote: "Unrivaled mic drop elegance, fade to black.",
      isPunchline: true,
    }
  ];
}

// Localized highlight generator utilizing timing markers [pause: X.Xs]
function buildLocalizedHighlightCues(
  actId: string,
  targetDuration: 60 | 180,
  lang: SupportedLanguage
): ScriptCue[] {
  const items = STANDUP_LOCALIZATION_DATASET.filter(d => d.target_language === lang);

  if (targetDuration === 60) {
    const slotDuration = 10;
    return items.slice(0, 6).map((item, index) => {
      const startTime = index * slotDuration;
      const endTime = startTime + slotDuration;
      const isClimax = index === 5 || item.segment_id === '005';

      return {
        id: `loc-h-${item.segment_id}-${index}`,
        startTime,
        endTime,
        spokenText: item.localized_text,
        visualCue: isClimax 
          ? `[Climax Flash]: Liquid chrome emblem collapses in smoke, Kanjo/Glow badge for ${lang}`
          : `[Stage Atmosphere]: Dragon gestures with glowing hoodie trims, timing marker sync for ${lang}`,
        audioCue: isClimax
          ? `[Audio Drop]: 40Hz sub drop, crowd roar for localized punchline '${item.operative_punchline_word}'`
          : `[Audio Foley]: 432Hz ambient drone, subtle room resonance`,
        pacingNote: `${item.timing_markers} | [Rule: ${item.humor_technique || 'Equivalence of Humor'}]`,
        isPunchline: isClimax,
      };
    });
  }

  // 3-Minute Localized Set (180s)
  const slotDuration = Math.floor(180 / Math.max(1, items.length));
  return items.map((item, index) => {
    const startTime = index * slotDuration;
    const endTime = Math.min(180, startTime + slotDuration);
    const isClimax = index === items.length - 1;

    return {
      id: `loc-3m-${item.segment_id}-${index}`,
      startTime,
      endTime,
      spokenText: item.localized_text,
      visualCue: `[Visual]: Performer synchronizes with ${lang} cadence. Cultural swap: ${item.cultural_swaps?.[0]?.adapted || 'Regional touchpoint'}.`,
      audioCue: isClimax ? `Massive crowd standing ovation, 808 sub impact` : `432Hz harmonic drone, vinyl crackle`,
      pacingNote: `${item.timing_markers} | [Cadence: ${item.adaptation_notes}]`,
      isPunchline: isClimax,
    };
  });
}

// Helper: Calculate total duration & cue count
export function getClipMetadata(cues: ScriptCue[]) {
  if (cues.length === 0) return { totalDuration: 0, punchlineCount: 0 };
  const totalDuration = cues[cues.length - 1].endTime;
  const punchlineCount = cues.filter(c => c.isPunchline).length;
  return { totalDuration, punchlineCount };
}
