import { Clock, AudioWaveform, Activity, Aperture, Video, Layers, BookOpen, Flame, Sparkles, Award, Zap, Compass, Cannabis } from 'lucide-react';

export const CORE_PREMISE = {
  title: 'Core Premise & Character Lore',
  description:
    'Dragon 9 is not just an interdimensional stand-up performer; when he gets stoned, he ascends into "SUPER PUFF" — the bigger clock on the block. Radiating effortless swagger, cosmic confidence, and razor-sharp bilingual fluency in both dry Kiwi-English and sleek, punchy Japanese (日本語). He treats linear time as child\'s play, slicing through 60-minute illusions with his signature catchphrase: "Times Up, Mother Fathers!"',
  aspirations: {
    primaryGoal: '👑 Undisputed Greatest Comedian & Funniest Dragon in History (Super Puff Mode)',
    secondaryGoal: '🌿 Interdimensional Master Cannabis & Terpene Sommelier & Bilingual Wordplay Maestro',
    philosophy: 'Comedy is sacred geometry with punchlines; weed is the fuel that ascends you to Super Puff — the bigger clock on the block. 時間切れだぜ、マザーファザーズ (Times Up Mother Fathers).',
  }
};

export interface ComedyTheory {
  id: string;
  name: string;
  category: 'timing' | 'structure' | 'delivery' | 'psychology';
  description: string;
  dragonNote: string;
  masteryLevel: number; // 1-100
  iconName: string;
}

export const COMEDY_THEORY_MODULES: ComedyTheory[] = [
  {
    id: 'pregnant-pause',
    name: 'The Temporal Pregnant Pause',
    category: 'timing',
    description: 'Holding dead silence right before the punchline to let the audience’s brain fill in linear logic before shattering it.',
    dragonNote: 'Hold for 1.4 seconds minimum. Take a slow blunt pull right as the crowd leans forward. The silence does 60% of the heavy lifting, eh?',
    masteryLevel: 94,
    iconName: 'Clock',
  },
  {
    id: 'rule-of-threes',
    name: 'Subverted Rule of Threes',
    category: 'structure',
    description: 'Setting up a logical pattern of two familiar human customs, then annihilating the third with absurd draconic reality.',
    dragonNote: 'Pattern: Birth, School, Mortgages... BAM: 4,000 years of sleeping on gold hoards while ignoring phone calls. Unbeatable.',
    masteryLevel: 88,
    iconName: 'Zap',
  },
  {
    id: 'polite-roasting',
    name: 'Disarming Polite Roasting',
    category: 'psychology',
    description: 'Delivering scathing, soul-crushing truths wrapped in warm, gentle New Zealand conversational hospitality.',
    dragonNote: 'Always start with "Aw mate, look at you" or "Bless ya, legend." If you sound like you want to buy them a meat pie, they laugh before they realize they’ve been atomized.',
    masteryLevel: 96,
    iconName: 'Award',
  },
  {
    id: 'terpene-cadence',
    name: 'Terpene-Calibrated Cadence',
    category: 'delivery',
    description: 'Using high-Myrcene profiles to drop the vocal pitch into a sub-bass conversational frequency, inducing hypnotic laughter.',
    dragonNote: 'Keep the throat warm, exhale on the vowel sounds. If the sub-woofer rattles the front row, the punchline lands twice as hard.',
    masteryLevel: 91,
    iconName: 'Cannabis',
  },
  {
    id: 'origami-bonsai-pruning',
    name: 'Origami Creasing & Bonsai Pruning (折り紙・盆栽笑学)',
    category: 'structure',
    description: 'Treating joke setups like washi paper (folding dimensional logic into crisp creases) and pruning conversational fluff like a 200-year-old juniper bonsai.',
    dragonNote: '「盆栽のように無駄を削ぎ落とし、折り紙のように次元を畳む」 (Prune the fat like a bonsai, fold the premise like an origami crane). If a word doesn’t serve the punchline, snip it with bonsai shears, champion.',
    masteryLevel: 98,
    iconName: 'Compass',
  },
];

export interface StrainConnoisseurItem {
  id: string;
  name: string;
  type: 'Indica Dominant' | 'Sativa Dominant' | 'Cosmic Hybrid' | '54-Min Cured';
  thc: string;
  terpenes: { name: string; percentage: string; effect: string }[];
  flavorProfile: string;
  comedyEnhancement: string;
  burnRate: string;
  pairingAct: string;
}

export const CANNABIS_CONNOISSEUR_VAULT: StrainConnoisseurItem[] = [
  {
    id: 'chrono-glaze',
    name: 'Chrono-Glaze (28.2% THC)',
    type: 'Cosmic Hybrid',
    thc: '28.2%',
    terpenes: [
      { name: 'β-Myrcene', percentage: '2.6%', effect: 'Elongates perceptual seconds by 2.4x under dense lighting' },
      { name: 'Terpinolene', percentage: '1.8%', effect: 'Razor-sharp pacing & effortless cadence' },
      { name: 'Limonene', percentage: '0.9%', effect: 'Golden iris glow & disarming swagger' },
    ],
    flavorProfile: 'Glazed citrus, glazed sweet lavender, ozone, toasted cedar.',
    comedyEnhancement: 'Establishes immediate authority through atmosphere. If you bend perception in the first 60 seconds, the room surrenders.',
    burnRate: 'Smooth iridescent ash, resin ring glowing violet.',
    pairingAct: 'act_01_threshold',
  },
  {
    id: 'resonance-haze',
    name: 'Resonance Haze (31.8% THC)',
    type: 'Sativa Dominant',
    thc: '31.8%',
    terpenes: [
      { name: 'α-Pinene', percentage: '2.4%', effect: 'Surgical joke pruning & rapid microwave time loops' },
      { name: 'β-Caryophyllene', percentage: '1.6%', effect: 'Chromatic pitch-shifted roast punchlines' },
      { name: 'Linalool', percentage: '1.3%', effect: 'Transcendent calm during 10-minute mental journeys' },
    ],
    flavorProfile: 'Crisp pine needle, sour juniper mist, liquid chrome vapor, crushed mint.',
    comedyEnhancement: 'Pushes observational comedy into temporal absurdism. Syncs physical audio with perceptual delay.',
    burnRate: 'Crisp, aromatic crackle, razor-thin cherry.',
    pairingAct: 'act_02_deep_tuning',
  },
  {
    id: 'cosmic-og',
    name: 'Cosmic OG (Batch #420-Alpha)',
    type: 'Indica Dominant',
    thc: '31.4%',
    terpenes: [
      { name: 'β-Myrcene', percentage: '2.8%', effect: 'Heavy body relaxation & deadpan timing control' },
      { name: 'Caryophyllene', percentage: '1.4%', effect: 'Sharp, spicy wit for quick roast retorts' },
      { name: 'Limonene', percentage: '0.9%', effect: 'Elevated mood & playful audience banter' },
    ],
    flavorProfile: 'Earthy pine, diesel exhaust, aged dragon scale cedar, hints of sweet nebula.',
    comedyEnhancement: 'Perfect for dry, slow-burn rants about Sumerian knuckles and daylight savings.',
    burnRate: 'Slow white-ash burn, dense resin ring.',
    pairingAct: 'act-1',
  },
  {
    id: 'quantum-diesel',
    name: 'Quantum Diesel (54-Minute Cure)',
    type: 'Sativa Dominant',
    thc: '28.9%',
    terpenes: [
      { name: 'Terpinolene', percentage: '2.1%', effect: 'Hyper-focused crowd work and rapid pattern recognition' },
      { name: 'Ocimene', percentage: '1.2%', effect: 'Smooth vocal fry & vocal cord lubrication' },
      { name: 'Pinene', percentage: '1.0%', effect: 'Laser-sharp memory recall for impromptu callbacks' },
    ],
    flavorProfile: 'Sour lemon zest, high-octane rocket fuel, crushed eucalyptus.',
    comedyEnhancement: 'Essential for slicing through hecklers and executing mid-air crowd roasts.',
    burnRate: 'Crisp, aromatic crackle, razor-thin cherry.',
    pairingAct: 'act-2',
  },
  {
    id: 'nebula-haze',
    name: '27° Nebula Haze',
    type: 'Cosmic Hybrid',
    thc: '33.2%',
    terpenes: [
      { name: 'Linalool', percentage: '1.8%', effect: 'Existential calm during complex conceptual premises' },
      { name: 'Humulene', percentage: '1.1%', effect: 'Suppresses giggles so the comedian stays deadpan' },
      { name: 'Myrcene', percentage: '1.6%', effect: 'Grounded physical stage presence' },
    ],
    flavorProfile: 'Wild blackberries, lavender vapor, damp rainforest soil, ozone.',
    comedyEnhancement: 'Powers the passionate, slightly awkward rant on temporal synchronization.',
    burnRate: 'Thick violet smoke clouds that linger like stage fog.',
    pairingAct: 'act-3',
  },
  {
    id: 'void-reserve',
    name: 'Temporal Void Grand Reserve',
    type: 'Indica Dominant',
    thc: '34.5%',
    terpenes: [
      { name: 'Bisabolol', percentage: '1.5%', effect: 'Deep philosophical closure & relaxed mic drop' },
      { name: 'Caryophyllene', percentage: '1.9%', effect: 'Final resonant punchline weight' },
      { name: 'Myrcene', percentage: '3.2%', effect: 'Total temporal detachment' },
    ],
    flavorProfile: 'Dark cocoa, roasted coffee beans, vintage hashish, cosmic dust.',
    comedyEnhancement: 'Enables the iconic smoke-out exit and effortless "Yeah nah, I\'m off" sign-off.',
    burnRate: 'Ultra-dense, velvety billows that swallow the entire frame.',
    pairingAct: 'outro',
  },
  {
    id: 'zen-bonsai-origami',
    name: 'Zen Bonsai & Origami Washi Reserve',
    type: 'Cosmic Hybrid',
    thc: '32.8%',
    terpenes: [
      { name: 'α-Pinene', percentage: '2.4%', effect: 'Razor-sharp focus for geometric wordplay & patience' },
      { name: 'β-Caryophyllene', percentage: '1.6%', effect: 'Surgical pruning of dead air and filler words' },
      { name: 'Linalool', percentage: '1.3%', effect: 'Transcendent calm for folding multidimensional premises' },
    ],
    flavorProfile: 'Fresh hinoki cypress, crisp washi paper, wild juniper berry, mountain mist.',
    comedyEnhancement: 'Unlocks Super Puff’s surgical joke-pruning and crane-folding cadence.',
    burnRate: 'Pure crystalline white ash, perfectly coiled resin cherry.',
    pairingAct: 'act-2',
  },
];

export const COMEDY_RANKS = [
  { level: 1, title: 'Apprentice Joke Hatchling', minXp: 0, description: 'Mastering basic punchline cadence & joint rolling.' },
  { level: 2, title: 'Open Mic Drake', minXp: 200, description: 'Surviving hostile room silence and tuning vocal fry.' },
  { level: 3, title: 'Club Regular Wyrm', minXp: 500, description: 'Consistent laughs, tight 15-minute set, polite crowd work.' },
  { level: 4, title: 'Timing Alchemist', minXp: 900, description: 'Mastery of the pregnant pause and precision heckler incineration.' },
  { level: 5, title: 'Grandmaster of the Callback', minXp: 1400, description: 'Weaving 4 acts into a single multi-dimensional punchline loop.' },
  { level: 6, title: '👑 GOAT Dragon Comedian in History', minXp: 2000, description: 'The absolute pinnacle of multiverse stand-up & terpene mastery.' },
];

export const ACTS = [
  {
    id: 'act-1',
    time: '0:00 – 12:00',
    title: 'Act I: The 60-Minute Lie (Sumerian Knuckle Deconstruction)',
    comedyTheory: 'Subverting Linear Dogma & Bilingual Swagger',
    strainPairing: 'Cosmic OG (31.4% THC | 2.8% Myrcene)',
    studyTakeaway: 'The Sumerian knuckle premise lands 40% harder when paired with a slow bong bubbling break before the reveal.',
    bit: '"You divided your life into 60s because some Sumerians looked at their knuckles 5,000 years ago? Yeah, nah." *takes a massive bong rip, eyes glowing golden Super Puff* "お前ら、時間を舐めてるだろ？ (You lot really take time for granted, huh?) Now you\'re sweating over a 9 AM zoom meeting. Listen closely: I am Super Puff, the bigger clock on the block. Times Up, Mother Fathers!"',
    gag: 'The dragon exhales a thick cloud of smoke that morphs into a giant, ticking analog clock with Japanese kanji dials (時・分・秒), which shatter as he declares "Times Up, Mother Fathers!" and shifts into 54-minute fluid geometry.',
    audio: 'Muted rimshots layered over heavy 808 sub-bass drops every time a punchline hits.',
    icon: Clock,
  },
  {
    id: 'act-2',
    time: '12:00 – 28:00',
    title: 'Act II: The Resonance Routine (Bilingual Tokyo Roasts)',
    comedyTheory: 'Crowdsource Misdirection & Supreme Swagger Status',
    strainPairing: 'Quantum Diesel (High Terpinolene for Speed)',
    studyTakeaway: 'When roasting Dave in the front row, maintain eye contact through the smoke ring. Disarm with empathy, destroy with geometry.',
    bit: 'Crowdsourcing jokes from the "void." He pauses awkward audience reactions in mid-air with his chrome blunt pointer. "Aw mate, look at your face. 顔見ろよ、完全にフリーズしてるぜ (Look at your face, totally frozen). You left the stove on in 2014, didn\'t ya? That\'s gutting, bro. When Super Puff drops the tempo, even your panic is in slow motion. 時間切れだぜ、マザーファザーズ (Times Up, Mother Fathers)!"',
    gag: 'The avatar uses a 3D liquid-chrome mic in one hand and a blunt in the other to literally slice through time frames. Neon Japanese typography floats across frozen smoke rings.',
    audio: 'Distorted echo delays mapped to crowd silences.',
    icon: AudioWaveform,
  },
  {
    id: 'act-3',
    time: '28:00 – 40:00',
    title: 'Act III: The 27° Pitch (The Bigger Clock on the Block)',
    comedyTheory: 'Existential Escalation & High-Energy Narrative Build',
    strainPairing: '27° Nebula Haze (Linalool + Humulene Balance)',
    studyTakeaway: 'Escalate the absurdity until the room has to choose between physics and laughing. Always conclude on "not ideal".',
    bit: 'Super Puff ascends into full hyper-confidence, gesturing with absolute swagger. "You\'re all walking around with wristwatches from 1950 thinking you own the day. 俺がこの街で一番デカい時計だ (I am the bigger clock on this block)! When you pitch a tent at a 27° tilt in hyperspace, standard gravity resigns. Not ideal for you, but legendary for me. Times Up, Mother Fathers!"',
    gag: 'Neon vector lines explode across the stage from the cherry of the blunt, forming animated cyberpunk Shibuya streetscapes, floating gold clocks, and shifting liquid geometry.',
    audio: 'BPM shifts matching the narrative urgency, synth risers on punchlines.',
    icon: Activity,
  },
  {
    id: 'outro',
    time: '40:00 – 45:00',
    title: 'Outro: Yeah Nah, I\'m Off (Jikan Gire)',
    comedyTheory: 'The Antidotal Mic Drop & Negative Space Exit',
    strainPairing: 'Temporal Void Grand Reserve (34.5% THC)',
    studyTakeaway: 'The greatest comedians leave the room wanting 5 more minutes. A massive cloud and a 5-word farewell is peak comedy elegance.',
    bit: 'Super Puff drops the liquid chrome mic, takes one last monstrous rip from the cosmic bong, smiles calmly at the cheering room. "じゃあな、良い夢見ろよ (See ya, have sweet dreams). Super Puff is out. Times Up, Mother Fathers." Snap back to reality.',
    gag: 'The entire animated set gets swallowed by a massive, screen-filling cloud of thick violet smoke, collapsing into a glowing liquid chrome emblem with kanji (超煙・超時) against a dark void.',
    audio: 'Low-pass reverb tail, bubbling bong water SFX, vinyl crackle fade.',
    icon: Aperture,
  },
];

export const SUPER_PUFF_INITIATION_SPECIAL = {
  project: "Super Puff: The Initiation",
  specialFormat: "18-Minute Apex Special",
  temporalFramework: "Dragon 9 Protocol (54-Min Hours / 26.66-Hr Cycles)",
  version: "1.0.0-APEX",
  acts: [
    {
      id: "act_01_threshold",
      time: "00:00 – 06:00",
      title: "Act I: The Threshold",
      comedyTheory: "The Jarring Realization & System Shock",
      strainPairing: "Chrono-Glaze (28.2% THC)",
      studyTakeaway: "Establish immediate authority through atmosphere. If you bend perception in the first 60 seconds, the audience surrenders to the pace.",
      bit: "Super Puff materializes through analog CRT static, reaching into mid-air to twist an invisible dial that drops the venue's room tone into a heavy 432Hz sub-bass hum. 'Welcome to the baseline. Secure your seatbelts, we're skipping the warm-up.'",
      gag: "The venue walls glitch and dissolve outward, revealing a boundless starry void while the mic stand floats in mid-air.",
      audio: "Analog static tear, deep 808 sub-drop (432Hz resonance), transition into lo-fi vinyl groove.",
      visuals: "CRT scanlines peeling back to 4K anime styling, neon aqua highlights, glassmorphism overlays.",
      stageDirections: "(SFX: Harsh CRT static crackle tears across the speakers. Dark screen. A glowing neon aqua line appears horizontally, snapping open to reveal Super Puff standing on a dark, glass-like reflective stage. He wears an oversized street-wear hoodie with glowing liquid chrome trims.)",
      performanceScript: `(Reaches out into thin air, grabbing an invisible knob and twisting it counter-clockwise. SFX: Massive 808 sub-bass drop at 432Hz shakes the floor, dissolving the room noise into a deep, warm hum.)

"Yeah nah... check. One, two. Is this thing calibrated, or are we still operating on standard linear drift?

(Looks around room, raising an eyebrow)

Welcome to the baseline. Secure your seatbelts, family—we’re skipping the warm-up entirely. You ever notice how humans treat time like a conveyor belt at a supermarket? Just standing there watching your minutes slide past like a cold loaf of bread and a tin of baked beans. 'Oh, I've got a meeting at 2:00 PM.' Why? Who chose 2:00 PM? Who agreed that sixty minutes makes an hour? It’s arbitrary. It’s clunky. We’re out here running on 54-minute hours, 26.66-hour cycles. You feel that extra space? That’s where the magic lives.

(Takes a smooth pull from a glowing glass rig. SFX: Crisp bubbling water. Exhales a light blue haze that turns into glowing geometric shapes in mid-air.)

Chrono-Glaze sitting at twenty-eight point two percent. Clean frequency. If you feel like your feet aren't touching the carpet anymore... good. That means the system calibration is working."`,
      icon: Clock,
      _meta: {
        supportedWithJoints: true,
        exportId: "SP-ACT1-CG28"
      }
    },
    {
      id: "act_02_deep_tuning",
      time: "06:00 – 12:00",
      title: "Act II: The Deep Tuning",
      comedyTheory: "Hyperbolic Escalation & The Cosmic Detour",
      strainPairing: "Resonance Haze (31.8% THC)",
      studyTakeaway: "Push observational comedy into temporal absurdism. Use reactive visual ripples to sync physical audio with perceptual delay.",
      bit: "Super Puff breaks down the sheer absurdity of linear 60-minute time and everyday corporate schedules, demonstrating how a single thought can expand into an entire 10-minute mental journey while staring at a microwave counter.",
      gag: "Background stage elements melt and morph into chromatic fluid, vibrating in sync with voice pitch shifts and spatial audio delays.",
      audio: "Binaural spatial audio shifts, 16-step synth pulses, pitch-shifted reverb echoes.",
      visuals: "Chromatic aberration ripples, liquid metal surfaces, responsive spectrum analyzer waves.",
      stageDirections: "(Visuals: The background venue walls dissolve entirely into fluid chromatic metal. The stage floats over a dark grid. Audio shifts to spatial stereo, panning left and right.)",
      performanceScript: `(Pacing the floating stage, gesturing with liquid chrome-trimmed sleeves)

"Let’s talk about the microwave trap. You know the one. You put a slice of pizza in for forty-five seconds. You hit start.

(Glares directly at the audience with wide eyes)

Tell me why forty-five seconds inside a kitchen feels longer than a four-year university degree? You stand there staring at that spinning plate, and suddenly your brain launches a whole three-part documentary series. You start reflecting on your primary school choices. You evaluate your 2018 tax return. You draft three entire business plans in your head.

(SFX: Audio pitches down into an ultra-low reverb tail as background visuals warp in chromatic ripples)

And then you look back at the timer... and TWO SECONDS HAVE PASSED. Two! That’s not physics, bro. That’s temporal distortion. The microwave is a portal. We’re out here living in three dimensions while our thoughts are vibrating across nine. That’s why we built this space—to tune into the real frequency while everyone else is stressing over 9-to-5 schedules."`,
      icon: AudioWaveform,
      _meta: {
        supportedWithJoints: true,
        exportId: "SP-ACT2-RH31"
      }
    },
    {
      id: "act_03_jikan_gire",
      time: "12:00 – 18:00",
      title: "Act III: Jikan Gire (Outro)",
      comedyTheory: "The Antidotal Mic Drop & Negative Space Exit",
      strainPairing: "Temporal Void Grand Reserve (34.5% THC)",
      studyTakeaway: "The greatest comedians leave the room wanting 5 more minutes. A massive cloud and a 5-word farewell is peak comedy elegance.",
      bit: "Super Puff drops the liquid chrome mic, takes one last monstrous rip from the cosmic bong, smiles calmly at the cheering room. 'じゃあな、良い夢見ろよ (See ya, have sweet dreams). Super Puff is out. Times Up, Mother Fathers.' Snap back to reality.",
      gag: "The entire animated set gets swallowed by a massive, screen-filling cloud of thick violet smoke, collapsing into a glowing liquid chrome emblem with kanji (超煙・超時) against a dark void.",
      audio: "Low-pass reverb tail, bubbling bong water SFX, vinyl crackle fade out.",
      visuals: "Volumetric violet smoke, liquid chrome physics collapse, glowing neon kanji dissipation.",
      stageDirections: "(Visuals: The chromatic environment darkens. Volumetric violet light beams pierce through the void from above. The strain status board shifts to 'Temporal Void Grand Reserve - 34.5% THC'.)",
      performanceScript: `(Smiles calmly, taking a long, monstrous final rip from the cosmic rig. Dense, thick violet smoke fills his chest. He holds it for three seconds while the room goes dead silent except for a low-pass vinyl crackle.)

"Time flies when you’re bending the continuum. Look at the clock—18 minutes, right on the Apex mark. Zero wasted energy.

(Drops the liquid chrome microphone. SFX: Heavy metallic impact sound echoing into infinite reverb as the mic turns into liquid mercury upon hitting the glass floor.)

Exhale..."

(Exhales a massive, screen-filling cloud of thick violet smoke that completely engulfs the camera and stage.)

SUPER PUFF (V.O.):

"じゃあな、良い夢見ろよ. (See ya, have sweet dreams.) Super Puff is out. Times Up, Mother Fathers."

(SFX: Bubbling bong water fade, deep low-pass sub tail. The violet smoke cloud condenses into a single central glowing liquid chrome emblem with kanji: 超煙・超時 before snapping to black.)`,
      icon: Aperture,
      _meta: {
        supportedWithJoints: true,
        exportId: "SP-ACT3-TV34"
      }
    }
  ]
};

export const VEO_KEYFRAME_PROMPTS = [
  {
    id: 'veo-act-1',
    actTitle: 'Act I: The Threshold',
    modelTarget: 'Veo 3.1 / Midjourney v6 / Runway Gen-3',
    aspectRatio: '16:9',
    timecode: '00:00 – 06:00',
    prompt: 'Cinematic 4K 16:9 shot, 2D/3D hybrid anime style. A chill sci-fi host wearing an oversized streetwear hoodie with glowing liquid chrome trims stands on a pitch-black reflective glass floor. He twists an invisible dial in mid-air as a massive cyan 432Hz energy wave pulses outward. CRT scanline textures peeling away into hyper-clear volumetric neon lighting. Atmospheric camera push-in, 24fps film grain, ultra-detailed.',
    resolution: '4K HDR',
    fps: 24,
    lightingPalette: 'Cyan 432Hz Energy / CRT Scanline Textures',
  },
  {
    id: 'veo-act-2',
    actTitle: 'Act II: The Deep Tuning',
    modelTarget: 'Veo 3.1 / Midjourney v6 / Runway Gen-3',
    aspectRatio: '16:9',
    timecode: '06:00 – 12:00',
    prompt: 'Surreal 3D anime cinematic sequence. The background stage walls melt into liquid metallic chrome and fluid gold ripples. Abstract geometric shapes vibrate and float in mid-air around a mic stand. Chromatic aberration lens effect, dynamic spatial lighting shifting between magenta and gold, high contrast reflections, ultra-fluid motion physics, 8k resolution.',
    resolution: '8K Ultra-Fluid',
    fps: 24,
    lightingPalette: 'Magenta & Fluid Gold / Chromatic Aberration',
  },
  {
    id: 'veo-act-3',
    actTitle: 'Act III: Jikan Gire / Outro',
    modelTarget: 'Veo 3.1 / Midjourney v6 / Runway Gen-3',
    aspectRatio: '16:9',
    timecode: '12:00 – 18:00',
    prompt: 'Extreme wide cinematic climax. An animated character takes a monstrous pull from a glowing glass rig and exhales a dense, screen-filling cloud of thick volumetric violet smoke. The mic drops, turning into liquid mercury upon hitting the dark reflective floor. The entire stage dissolves into violet smoke, collapsing into a central glowing liquid chrome Kanji emblem (超煙・超時) against a pitch-black void. Volumetric depth of field, 24fps, epic macro animation.',
    resolution: '4K Macro Climax',
    fps: 24,
    lightingPalette: 'Volumetric Violet Smoke / Liquid Chrome Kanji',
  },
];

export const PROMPTS = [
  {
    id: 'prompt-1',
    title: 'Act 1: Veo 3.1 Fast Motion Directive',
    prompt:
      'Medium shot of animated dragon puffing a blunt, studying his pocket joke grimoire, exhaling a thick cloud of stylized smoke that warps into a 54-minute fluid clock loop. 24fps cell-shaded animation, dark cyberpunk void.',
    icon: Video,
  },
  {
    id: 'prompt-2',
    title: 'Act 2: Veo 3 Motion Directive',
    prompt:
      'Dragon comedy scholar using a glowing blunt to slice through liquid-chrome time frames, analyzing crowd reaction frequencies and freezing smoke rings in mid-air in a dark void. Vibrant neon rim lighting.',
    icon: Video,
  },
  {
    id: 'prompt-3',
    title: 'Audio TTS Synthesis Directives',
    prompt:
      'Voice Profile: Male New Zealand (en-NZ) neural voice. Low pitch, relaxed vocal fry on sentence endings, cadence of a comedy theorist who knows exactly when to drop the punchline.\nKey phrase delivery: "not ideal, eh?" (Slow cadence, dry tone).',
    icon: AudioWaveform,
  },
  {
    id: 'prompt-4',
    title: 'SFX & Foley Layering',
    prompt:
      '40Hz sub-bass drops on punchlines.\nBong water bubbling (isolated stem).\nVinyl crackle fade out for transitions.',
    icon: Layers,
  },
];

export interface ComedyArchiveItem {
  id: string;
  title: string;
  category: 'bits' | 'timing' | 'crowd_work' | 'philosophy' | 'heckler_roasts' | 'props';
  categoryLabel: string;
  premise: string;
  punchline: string;
  craftTechnique: string;
  dragonReflection: string;
  recommendedStrain: string;
  deliveryCue: string;
  masteryStatus: 'mastered' | 'needs_practice';
  practiceNotes?: string;
  rehearsalCount: number;
  lastWorkshopped: string;
  funninessScore: number; // 1-100
  xpValue: number;
}

export const INITIAL_COMEDY_ARCHIVES: ComedyArchiveItem[] = [
  {
    id: 'arch-1',
    title: 'The Sumerian Knuckle Conspiracy',
    category: 'bits',
    categoryLabel: 'Stand-Up Bit',
    premise: 'Dividing modern human life into 60-minute units because Bronze Age Sumerians counted on their finger phalanges 5,000 years ago.',
    punchline: '"Now you’re having a panic attack in traffic because you’re 4 minutes late to an Excel spreadsheet review. Cheers for that, Gilgamesh. Just a bit silly, isn’t it?"',
    craftTechnique: 'Historical Absurdism & The Delayed Premise',
    dragonReflection: 'The key is delivering the word "Gilgamesh" with absolute deadpan intimacy, like you just saw him at the pub yesterday.',
    recommendedStrain: 'Cosmic OG (31.4% THC | High Myrcene)',
    deliveryCue: 'Take a long bong bubbling pull right after "Excel spreadsheet", let the room sit in the silence for 1.8 seconds.',
    masteryStatus: 'mastered',
    practiceNotes: 'Tested in Act 1. Crowd hit 98% laughter resonance on the word "Gilgamesh". Keep vocal fry low.',
    rehearsalCount: 42,
    lastWorkshopped: 'Act I Live Set',
    funninessScore: 96,
    xpValue: 85,
  },
  {
    id: 'arch-2',
    title: 'Dave’s 2014 Stove Burn',
    category: 'crowd_work',
    categoryLabel: 'Crowd Work & Banter',
    premise: 'Spotting an audience member with glazed, anxious eyes in row 2 and diagnosing their exact interdimensional stressor.',
    punchline: '"Aw mate, look at your face. You left the stove on in 2014, didn’t ya? That’s gutting. Don’t worry, your house in that dimension is thoroughly caramelized by now."',
    craftTechnique: 'Disarming Polite Roasting & Status Inversion',
    dragonReflection: 'Never sound aggressive. Wrap the soul-shattering roast in warm Kiwi empathy so they laugh before they feel the burn.',
    recommendedStrain: 'Quantum Diesel (High Terpinolene for rapid crowd read)',
    deliveryCue: 'Point gently with the cherry of the blunt, tilt head 15 degrees, maintain gentle eye contact.',
    masteryStatus: 'mastered',
    practiceNotes: 'Works 100% of the time on anyone sitting with folded arms.',
    rehearsalCount: 28,
    lastWorkshopped: 'Act II Crowd Routine',
    funninessScore: 92,
    xpValue: 70,
  },
  {
    id: 'arch-3',
    title: 'The 1.4-Second Blunt Inhale Pause',
    category: 'timing',
    categoryLabel: 'Timing & Delivery',
    premise: 'The psychological tension created when an 8-foot interdimensional dragon goes completely silent mid-sentence to take a slow smoke pull.',
    punchline: 'The punchline is the silence itself. The audience’s nervous system rushes to fill the void, making the eventual 4-word resolution detonate.',
    craftTechnique: 'The Temporal Pregnant Pause (Geometric Subversion)',
    dragonReflection: 'Silence is 60% of the joke. Amateur comics rush because they fear silence. Masters marinate in it.',
    recommendedStrain: 'Cosmic OG (Batch #420-Alpha)',
    deliveryCue: 'Zero facial movement. Count 1 Mississippi, 2 Mississippi internally. Exhale smoke on the first syllable.',
    masteryStatus: 'mastered',
    practiceNotes: 'Extended pause from 1.0s to 1.4s. Laugh volume increased by 38%.',
    rehearsalCount: 65,
    lastWorkshopped: 'Theory Grimoire Workshop',
    funninessScore: 98,
    xpValue: 110,
  },
  {
    id: 'arch-4',
    title: 'The 27° Temporal Angle Pitch',
    category: 'philosophy',
    categoryLabel: 'Philosophical Premise',
    premise: 'Explaining that the universe is misaligned by a 27-degree temporal tilt, causing universal awkwardness and misplaced keys.',
    punchline: '"You’re all operating on an unsynchronised grid, which is... you know, it’s just not ideal, eh? It’s like trying to pitch a temporal tent in the dark while your mate steals your lighter."',
    craftTechnique: 'Existential Escalation & High-Energy Narrative Build',
    dragonReflection: 'Needs more grounded relatable examples before the interdimensional physics leap. The transition feels slightly too abstract on first listen.',
    recommendedStrain: '27° Nebula Haze (Linalool + Humulene)',
    deliveryCue: 'Wild hand gesture with the glowing blunt tip mapping vector coordinates in mid-air.',
    masteryStatus: 'needs_practice',
    practiceNotes: 'Work on simplifying the "temporal tensor" jargon into common Kiwi analogies like a wobbly camping table.',
    rehearsalCount: 14,
    lastWorkshopped: 'Green Room Rehearsal',
    funninessScore: 78,
    xpValue: 60,
  },
  {
    id: 'arch-5',
    title: 'Heirloom Tomato Economic Deflection',
    category: 'heckler_roasts',
    categoryLabel: 'Heckler Counter-Attack',
    premise: 'A hostile audience member heaves a ripe projectile tomato onto the stage.',
    punchline: '"An heirloom tomato? In this economy? Cheers for the botanical asset, legend. I’m tossing this in a pan with some garlic later."',
    craftTechnique: 'Physical Misdirection & Economic Reality Inversion',
    dragonReflection: 'Carlin rule: Acknowledge the physical item immediately, value it above the heckler’s opinion, and thank them warmly.',
    recommendedStrain: 'Quantum Diesel (Caryophyllene for reflex recovery)',
    deliveryCue: 'Catch or inspect the splat with genuine culinary interest. Do not look angry.',
    masteryStatus: 'mastered',
    practiceNotes: 'Flawless execution during Act 2 tomato incident. Composure meter stayed at 95%.',
    rehearsalCount: 19,
    lastWorkshopped: 'Heckler Lab Run #4',
    funninessScore: 94,
    xpValue: 80,
  },
  {
    id: 'arch-6',
    title: 'The 4,000-Year Dragon Mortgage Analogy',
    category: 'philosophy',
    categoryLabel: 'Philosophical Premise',
    premise: 'Comparing a 30-year human bank mortgage to a 4,000-year dragon hoard sleep cycle.',
    punchline: '"You signed a 30-year fixed rate contract to live in a drywall box under an airport flight path? Mate, I fell asleep on a pile of gold in the Bronze Age and woke up with three missed calls from the bank."',
    craftTechnique: 'Subverted Rule of Threes & Scale Disparity',
    dragonReflection: 'The premise is gold, but the middle beat drags. Need a punchier line about HOA fees for dragons.',
    recommendedStrain: 'Temporal Void Grand Reserve',
    deliveryCue: 'Lower voice into 40Hz sub-harmonic register. Chuckle quietly into the collar mic.',
    masteryStatus: 'needs_practice',
    practiceNotes: 'Try adding a line about dragon insurance adjusters denying fire claims due to pre-existing scales.',
    rehearsalCount: 9,
    lastWorkshopped: 'Freestyle Green Room',
    funninessScore: 81,
    xpValue: 65,
  },
  {
    id: 'arch-7',
    title: 'Tactical Laser Pointer Existential Cat Roast',
    category: 'heckler_roasts',
    categoryLabel: 'Heckler Counter-Attack',
    premise: 'A heckler shines a bright green 532nm laser diode into the performer’s eyes.',
    punchline: '"Who gave a 532nm diode to a bloke in cargo shorts? You think I’m an interdimensional cat, do ya? I’m a dragon, mate. I don’t pounce on dots, I incinerate solar systems. But good hustle."',
    craftTechnique: 'Cat vs Dragon Status Reclamation',
    dragonReflection: 'Track the dot with one eye while keeping the rest of the body statuesque. The visual contrast creates the comedy.',
    recommendedStrain: 'Quantum Diesel (Pinene for ocular focus)',
    deliveryCue: 'Slowly follow the dot on the floor, squint, then look straight at the shooter.',
    masteryStatus: 'mastered',
    practiceNotes: 'Laser tracking routine is dialed in. Great audience reaction when mentioning cargo shorts.',
    rehearsalCount: 22,
    lastWorkshopped: 'Heckler Lab Run #7',
    funninessScore: 91,
    xpValue: 75,
  },
  {
    id: 'arch-8',
    title: 'Sub-Bass 40Hz Throat Exhale Drop',
    category: 'props',
    categoryLabel: 'Physical & Voice FX',
    premise: 'Using low-frequency dragon vocal resonance to physically vibrate the audience seats during the punchline landing.',
    punchline: 'Delivering the word "Unfortunate" at 42Hz so hard that the front row thinks an earthquake started.',
    craftTechnique: 'Terpene-Calibrated Cadence & Somatic Audio Punch',
    dragonReflection: 'Needs calibration with stage subwoofers. If the microphone clips, it loses the clean bass warmth.',
    recommendedStrain: 'Cosmic OG (High Myrcene for vocal relaxation)',
    deliveryCue: 'Bring the mic 1cm from snout, relax lower jaw, speak on the bottom 10% of lungs.',
    masteryStatus: 'needs_practice',
    practiceNotes: 'Sound engineer says we rattled the beer taps. Dial down 60Hz shelf by -2dB.',
    rehearsalCount: 16,
    lastWorkshopped: 'Soundcheck Session',
    funninessScore: 84,
    xpValue: 70,
  },
  {
    id: 'arch-9',
    title: 'The Liquid Chrome Mic Drop & Smoke Screen',
    category: 'props',
    categoryLabel: 'Physical & Voice FX',
    premise: 'Ending the stand-up set abruptly with a massive cloud of dense terpene vapor that leaves the stage completely empty.',
    punchline: '"Right, have a good one." *Snap back to reality. Stage is empty; only floating chrome icon remains.*',
    craftTechnique: 'The Antidotal Mic Drop & Negative Space Exit',
    dragonReflection: 'The greatest comedians leave 5 minutes early. Never linger after the room explodes.',
    recommendedStrain: 'Temporal Void Grand Reserve (34.5% THC)',
    deliveryCue: 'Drop mic cleanly on the stand, 1 giant exhale filling 100% of the camera frame, immediate fade to black.',
    masteryStatus: 'mastered',
    practiceNotes: 'The definitive outro. Leaves the audience clapping at an empty smoke cloud.',
    rehearsalCount: 50,
    lastWorkshopped: 'Special Finale Record',
    funninessScore: 99,
    xpValue: 120,
  },
  {
    id: 'arch-10',
    title: 'The Meat Pie Disarmament',
    category: 'crowd_work',
    categoryLabel: 'Crowd Work & Banter',
    premise: 'Diffusing hostile hecklers by offering them a hypothetical warm New Zealand mince & cheese pie.',
    punchline: '"Mate, you’re yelling because your blood sugar is low. If I had a hot mince & cheese pie right now, I’d pass it to you in row 3 and we’d be best mates in 40 seconds. Deep breaths, legend."',
    craftTechnique: 'Culinary Hospitality as Conflict Defusal',
    dragonReflection: 'Nobody can maintain anger when you offer them warm flaky pastry in a soothing baritone voice.',
    recommendedStrain: '27° Nebula Haze',
    deliveryCue: 'Gentle hand over heart, soft smile, slight nod.',
    masteryStatus: 'mastered',
    practiceNotes: 'Tested against the "Get on with it" heckler. Immediate room chuckle.',
    rehearsalCount: 25,
    lastWorkshopped: 'Improv Green Room',
    funninessScore: 90,
    xpValue: 75,
  },
  {
    id: 'arch-11',
    title: 'The Linear Calendar Guilt Engine',
    category: 'bits',
    categoryLabel: 'Stand-Up Bit',
    premise: 'How humans invented calendars just to feel bad about what they didn’t accomplish on a Tuesday.',
    punchline: '"Tuesday is just a word made up by guys in leather sandals who didn’t have Wi-Fi. Why are you letting a fictional Tuesday ruin your self-esteem, mate?"',
    craftTechnique: 'Temporal Deconstruction & Relatable Anxiety',
    dragonReflection: 'Needs a tighter bridge connecting Tuesday to modern notification anxiety. The punchline is almost there.',
    recommendedStrain: 'Quantum Diesel',
    deliveryCue: 'Ponderous shrug, looking up at imaginary calendar grid in the sky.',
    masteryStatus: 'needs_practice',
    practiceNotes: 'Workshop with freestyle dialogue to discover a stronger tag on smartwatch reminders.',
    rehearsalCount: 11,
    lastWorkshopped: 'Writers Room Session',
    funninessScore: 76,
    xpValue: 65,
  },
  {
    id: 'arch-12',
    title: 'The "Yeah Nah, She’ll Be Right" Multiverse Inversion',
    category: 'philosophy',
    categoryLabel: 'Philosophical Premise',
    premise: 'Applying the ultimate Kiwi philosophical paradox ("Yeah, nah") to quantum multiverse branching.',
    punchline: '"In 40 million parallel dimensions, your life went completely off the rails. But in this one? Yeah nah, she’ll be right, mate. Have a puff and relax."',
    craftTechnique: 'Cultural Dialect as Cosmological Truth',
    dragonReflection: 'A profound closer premise that combines Kiwi linguistics with multiversal physics.',
    recommendedStrain: 'Cosmic OG + Nebula Haze Blend',
    deliveryCue: 'Soft wink, slow nod, exhale small smoke vortex.',
    masteryStatus: 'needs_practice',
    practiceNotes: 'Test different variations of the pause between "Yeah" and "Nah".',
    rehearsalCount: 15,
    lastWorkshopped: 'Freestyle Green Room',
    funninessScore: 86,
    xpValue: 80,
  },
  {
    id: 'arch-13',
    title: 'The Zen Bonsai & Origami Crane Routine (折り紙・盆栽の極意)',
    category: 'philosophy',
    categoryLabel: 'Philosophical Premise',
    premise: 'Super Puff breaks down how comedy is identical to bonsai cultivation and origami paper folding — folding 4-dimensional space like washi paper and pruning punchline fat with bonsai shears.',
    punchline: '"You lot write a 3-page setup for a one-line dad joke. 盆栽を見ろ、無駄な枝を切れ (Look at the bonsai, prune the useless branches!). I take a 4-dimensional crisis, fold it three times like an origami crane, and hand you an existential punchline. Times Up, Mother Fathers!"',
    craftTechnique: 'Zen Botanical Geometry & Surgical Word-Pruning (折り紙・盆栽笑学)',
    dragonReflection: 'Bonsai taught me patience; origami taught me how to fold dimensional spacetime into a pocket-sized joke. When you prune every useless syllable, the punchline hits with 100% pure velocity.',
    recommendedStrain: 'Zen Bonsai & Origami Washi Reserve (32.8% THC)',
    deliveryCue: 'Mime delicate bonsai shears with two claws snip-snipping the air, then fold a smoke cloud into an origami crane with a smooth smile.',
    masteryStatus: 'mastered',
    practiceNotes: 'Huge resonance when transitioning from dry Kiwi cadence into rapid punchy Japanese: "盆栽を見ろ！" (Look at the bonsai!).',
    rehearsalCount: 33,
    lastWorkshopped: 'Tokyo / Auckland Improv Lab',
    funninessScore: 97,
    xpValue: 105,
  },
];


