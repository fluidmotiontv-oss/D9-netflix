// Script Timing & Production Directives for 1-Minute and 3-Minute Video Exports

export interface ScriptCue {
  id: string;
  startTime: number; // in seconds
  endTime: number; // in seconds
  spokenText: string;
  visualCue: string;
  audioCue: string;
  pacingNote: string;
  isPunchline?: boolean;
}

export interface VideoScriptPackage {
  actId: string;
  actTitle: string;
  durationSeconds: 60 | 180;
  durationLabel: string;
  aspectRatio: '16:9' | '9:16';
  strainPairing: string;
  cues: ScriptCue[];
  srtContent: string;
  vttContent: string;
  productionScriptMarkdown: string;
}

// Convert seconds to SRT timestamp format (00:00:00,000)
function formatSrtTimestamp(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
}

// Generate cues for 1-Minute (60s) Video
export function generate1MinuteCues(act: any): ScriptCue[] {
  const isInitiation = act.id?.startsWith('act_') || act._meta?.exportId?.includes('SP-ACT');
  const title = act.title || 'Act I: The 60-Minute Lie';
  const strain = act.strainPairing || 'Cosmic OG (31.4% THC)';

  if (isInitiation && act.id === 'act_02_deep_tuning') {
    return [
      {
        id: 'c1',
        startTime: 0,
        endTime: 9,
        spokenText: "You ever stare at a microwave for sixty seconds and realize your brain traveled forty light years across the galaxy?",
        visualCue: "Close-up on Super Puff dragon in neon hoodie, glowing golden iris, smoke ring forming microwave dial",
        audioCue: "Deep 432Hz ambient sub-drone, lo-fi vinyl crackle fade-in",
        pacingNote: "Calm, deadpan conversational cadence",
      },
      {
        id: 'c2',
        startTime: 9,
        endTime: 20,
        spokenText: "Sixty minutes to an hour because Bronze Age Sumerians counted finger knuckles 5,000 years ago? Yeah, nah. Arbitrary.",
        visualCue: "Background venue walls glitch into liquid chromatic fluid, floating Japanese kanji dials (時・分・秒)",
        audioCue: "Muted rimshot, bubbling water pipe stem foley",
        pacingNote: "Dismissive dry Kiwi swagger, status inversion",
      },
      {
        id: 'c3',
        startTime: 20,
        endTime: 33,
        spokenText: "We’re out here running on the Dragon 9 Protocol: 54-minute hours, 26.66-hour harmonic cycles. Feel that extra negative space?",
        visualCue: "Volumetric smoke plumes pulse to 54-minute fluid geometry, stage rim lights swing to violet",
        audioCue: "16-step synth riser pulse, binaural stereo pan",
        pacingNote: "Lean forward toward mic, rhythmic emphasis on '54-minute hours'",
      },
      {
        id: 'c4',
        startTime: 33,
        endTime: 45,
        spokenText: "That’s where comedy lives. That’s where you stop sweating an uncalibrated Monday calendar. お前ら、時間を舐めてるだろ？",
        visualCue: "Chromatic aberration ripple, Japanese subtitle overlay: (You lot really take time for granted, huh?)",
        audioCue: "Sub-bass 40Hz drop, distant crowd chuckle swell",
        pacingNote: "Bilingual Tokyo shift, razor-sharp swagger",
      },
      {
        id: 'c5',
        startTime: 45,
        endTime: 53,
        spokenText: "I am Super Puff, the bigger clock on this block. Hold your breath and surrender your linear illusions.",
        visualCue: "Super Puff raises glowing liquid chrome mic, violet smoke expands to fill stage canvas",
        audioCue: "Heavy 808 sub kick, glass crystal resonance",
        pacingNote: "Supreme status build, slow pregnant pause before punchline",
      },
      {
        id: 'c6',
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

  // Default 1-Minute Act Cue Set
  return [
    {
      id: 'c1',
      startTime: 0,
      endTime: 10,
      spokenText: `Welcome to the baseline. You divided your entire human existence into sixty minutes because some Sumerians looked at their knuckles? Yeah, nah.`,
      visualCue: `[Visual Cue: Wide shot of animated Super Puff dragon on dark reflective stage, smoke swirling, pairing: ${strain}]`,
      audioCue: `[Audio Cue: Analog CRT static pop, heavy 432Hz sub-bass ambient hum]`,
      pacingNote: "Dry conversational hook, relaxed posture with glowing blunt",
    },
    {
      id: 'c2',
      startTime: 10,
      endTime: 22,
      spokenText: `Five thousand years later, you’re having an existential panic attack in traffic because you're four minutes late to an Excel spreadsheet review? Cheers for that, Gilgamesh.`,
      visualCue: `[Visual Cue: CRT scanlines dissolve into anime cyberpunk neon, floating analog clock ticks backward]`,
      audioCue: `[Audio Cue: Muted rimshot, subtle bong water bubbling foley]`,
      pacingNote: "Deadpan intimacy on 'Gilgamesh', pause 1.2s",
    },
    {
      id: 'c3',
      startTime: 22,
      endTime: 36,
      spokenText: `Listen to me closely: linear time is an illusion. We operate on the Dragon 9 Protocol: 54-minute hours, fluid temporal geometry. That extra space is pure agency.`,
      visualCue: `[Visual Cue: 54-minute neon fluid clock rotates behind performer, neon vector lines shoot across stage]`,
      audioCue: `[Audio Cue: 16-step modular synth sequence swells, sub-bass harmonic resonance]`,
      pacingNote: "Assertive, eye contact through smoke rings",
    },
    {
      id: 'c4',
      startTime: 36,
      endTime: 48,
      spokenText: `お前ら、時間を舐めてるだろ？ Look at Dave in row two—completely frozen. When Super Puff drops the tempo, even your mortgage panic is in slow motion.`,
      visualCue: `[Visual Cue: Chromatic pitch shift ripples across dragon scales, audience silhouettes illuminated in violet]`,
      audioCue: `[Audio Cue: Spatial stereo pan, crowd chuckle murmur]`,
      pacingNote: "Bilingual Japanese transition, playful crowd work gesture",
    },
    {
      id: 'c5',
      startTime: 48,
      endTime: 54,
      spokenText: `I am Super Puff, the bigger clock on this block.`,
      visualCue: `[Visual Cue: Close-up on golden iris glow, smoke exhaled directly toward camera lens]`,
      audioCue: `[Audio Cue: 40Hz sub-bass drop, pregnant pause silence]`,
      pacingNote: "Supreme authority, pause 1.4s right before drop",
    },
    {
      id: 'c6',
      startTime: 54,
      endTime: 60,
      spokenText: `Times Up, Mother Fathers!`,
      visualCue: `[Visual Cue: Super-puff-chromatic keyframe flash, stage dissolves into glowing liquid chrome emblem 超煙・超時]`,
      audioCue: `[Audio Cue: Massive crowd cheer & laughter burst, 808 sub impact]`,
      pacingNote: "Explosive, authoritative mic drop",
      isPunchline: true,
    }
  ];
}

// Generate cues for 3-Minute (180s) Master Act
export function generate3MinuteCues(act: any): ScriptCue[] {
  const strain = act.strainPairing || 'Cosmic OG (31.4% THC | 2.8% Myrcene)';
  const bitText = act.performanceScript || act.bit || '';

  return [
    {
      id: 'c1',
      startTime: 0,
      endTime: 18,
      spokenText: "Yeah nah... check. One, two. Is this venue calibrated to harmonic resonance, or are we still operating on standard linear drift? Welcome to the baseline.",
      visualCue: "[Visual Cue: Dark reflective glass stage, harsh CRT static crackle tears open to reveal Super Puff in oversized street hoodie with glowing chrome trims]",
      audioCue: "[Audio Cue: Analog static tear, 432Hz deep resonant sub-bass drop shaking room tone, lo-fi vinyl groove enters]",
      pacingNote: "Slow, deliberate soundcheck casualness. Twist imaginary dial in mid-air.",
    },
    {
      id: 'c2',
      startTime: 18,
      endTime: 36,
      spokenText: "Secure your seatbelts, family—we’re skipping the warm-up entirely. You ever notice how humans treat time like a conveyor belt at a supermarket checkout?",
      visualCue: "[Visual Cue: Spotlight warms to amber, camera glides from stage right to medium close-up, smoke begins to drift]",
      audioCue: "[Audio Cue: Vinyl room tone, soft ride cymbal on beat 2 and 4]",
      pacingNote: "Conversational storytelling cadence, hands relaxed in hoodie pockets.",
    },
    {
      id: 'c3',
      startTime: 36,
      endTime: 55,
      spokenText: "Just standing there watching your precious minutes slide past like a cold loaf of bread and a dented tin of baked beans. 'Oh, I've got a meeting at 2:00 PM.' Why? Who chose 2:00 PM?",
      visualCue: "[Visual Cue: Holographic supermarket conveyor belt animates across stage apron, fading into clock hands]",
      audioCue: "[Audio Cue: Muted rimshots, crowd chuckle ripple in front rows]",
      pacingNote: "Subtle vocal mimicry of corporate urgency, followed by deadpan silence.",
    },
    {
      id: 'c4',
      startTime: 55,
      endTime: 78,
      spokenText: "Who agreed that sixty minutes makes an hour? Five thousand years ago, Bronze Age Sumerians counted the twelve phalanges on their four fingers using their thumb. That’s it. That’s the grand architecture of your mortgage.",
      visualCue: "[Visual Cue: Neon golden knuckles map vector coordinates in mid-air, dissolving into Sumerian cuneiform symbols]",
      audioCue: "[Audio Cue: Resonant crystal chime, bubbling glass rig foley with long water draw]",
      pacingNote: "Historical breakdown delivered with everyday Kiwi informality. Take a slow pull on the blunt at 72s.",
    },
    {
      id: 'c5',
      startTime: 78,
      endTime: 102,
      spokenText: "Now you’re having a panic attack on the motorway because you’re four minutes late to review an Excel spreadsheet about quarterly synergized deliverables. Cheers for that, Gilgamesh. Just a bit silly, isn’t it?",
      visualCue: "[Visual Cue: Stage lighting flashes cold fluorescent blue, then settles into warm violet terpene haze]",
      audioCue: "[Audio Cue: Sub-bass 40Hz drop on 'Gilgamesh', loud laughter burst from crowd]",
      pacingNote: "Deadpan intimacy on 'Gilgamesh'. Hold pregnant pause for exactly 1.6 seconds.",
      isPunchline: true,
    },
    {
      id: 'c6',
      startTime: 102,
      endTime: 126,
      spokenText: "We’re out here running on the Dragon 9 Protocol: 54-minute hours, 26.66-hour cycles. You feel that extra negative space between the seconds? That’s where human agency lives. That’s where the joke breathes.",
      visualCue: "[Visual Cue: Full 54-minute fluid geometry clock blooms behind performer, gears rotating counter-clockwise]",
      audioCue: "[Audio Cue: Warm analog synth pad swell, harmonic 54-minute bell chime at 114s]",
      pacingNote: "Philosophical elevation, expansive arm gesture framing the temporal clock.",
    },
    {
      id: 'c7',
      startTime: 126,
      endTime: 148,
      spokenText: `Pairing this with ${strain}. If you feel like your feet aren't touching the carpet anymore... good. That means your internal calibration is working. お前ら、時間を舐めてるだろ？`,
      visualCue: "[Visual Cue: Terpene profile badge animates top-right (Myrcene 2.8%), dragon eyes illuminate in golden Super Puff aura]",
      audioCue: "[Audio Cue: Spatial stereo panning, bubbling water pipe stem foley]",
      pacingNote: "Bilingual Japanese transition, disarming swagger, slight smirk toward camera.",
    },
    {
      id: 'c8',
      startTime: 148,
      endTime: 168,
      spokenText: "When you pitch a temporal tent at a 27-degree angle in hyperspace, standard gravity resigns. Not ideal for linear calendars, but legendary for us. I am Super Puff, the bigger clock on this block.",
      visualCue: "[Visual Cue: Camera pulls back to extreme wide cinematic view, chromatic aberration keyframes activate on stage edges]",
      audioCue: "[Audio Cue: Deep 808 sub bass swell, crowd cheering builds in volume]",
      pacingNote: "Supreme vocal projection, building to climactic crescendo.",
    },
    {
      id: 'c9',
      startTime: 168,
      endTime: 180,
      spokenText: "Times Up, Mother Fathers! じゃあな、良い夢見ろよ (See ya, sweet dreams).",
      visualCue: "[Visual Cue: Mic drops to floor, turning into liquid mercury. Performer exhales giant violet cloud swallowing entire frame into glowing chrome Kanji 超煙・超時]",
      audioCue: "[Audio Cue: Massive standing ovation crowd roar, echoing low-pass delay, final gong strike]",
      pacingNote: "Unrivaled mic drop elegance, fade to black.",
      isPunchline: true,
    }
  ];
}

// Generate SRT file text from cues
export function buildSrtContent(cues: ScriptCue[]): string {
  return cues.map((cue, index) => {
    return `${index + 1}\n${formatSrtTimestamp(cue.startTime)} --> ${formatSrtTimestamp(cue.endTime)}\n${cue.spokenText}\n`;
  }).join('\n');
}

// Generate WebVTT file text
export function buildVttContent(cues: ScriptCue[]): string {
  let vtt = "WEBVTT\n\n";
  vtt += cues.map((cue, index) => {
    const start = formatSrtTimestamp(cue.startTime).replace(',', '.');
    const end = formatSrtTimestamp(cue.endTime).replace(',', '.');
    return `${index + 1}\n${start} --> ${end}\n${cue.spokenText}\n`;
  }).join('\n');
  return vtt;
}

// Generate full Production Script Markdown with [Visual Cue] and [Audio Cue] directives
export function buildProductionScriptMarkdown(
  act: any,
  durationSeconds: 60 | 180,
  cues: ScriptCue[]
): string {
  const formatTitle = durationSeconds === 60 ? "1-MINUTE SOCIAL MICRO-SPECIAL (SHORTS / REELS / TIKTOK)" : "3-MINUTE THEATRICAL MASTER CUT (YOUTUBE / SHOWCASE)";
  const actTitle = act.title || "Act I";
  const strain = act.strainPairing || "Cosmic OG (31.4% THC)";

  let md = `# DRAGON 9 / SUPER PUFF PRODUCTION SCRIPT & MEDIA DIRECTIVES\n`;
  md += `**Format:** ${formatTitle} | **Target Duration:** ${durationSeconds} Seconds\n`;
  md += `**Act:** ${actTitle}\n`;
  md += `**Strain Pairing:** ${strain}\n`;
  md += `**Temporal Framework:** Dragon 9 Protocol (54-Minute Hours / 26.66-Hour Harmonic Cycles)\n`;
  md += `**Generated:** ${new Date().toISOString()}\n\n`;
  md += `---\n\n`;
  md += `## PRODUCTION BREAKDOWN & WORD-FOR-WORD TIMELINE\n\n`;

  cues.forEach((cue, idx) => {
    const startMins = Math.floor(cue.startTime / 60);
    const startSecs = Math.floor(cue.startTime % 60);
    const endMins = Math.floor(cue.endTime / 60);
    const endSecs = Math.floor(cue.endTime % 60);
    const timeStr = `[${String(startMins).padStart(2, '0')}:${String(startSecs).padStart(2, '0')} – ${String(endMins).padStart(2, '0')}:${String(endSecs).padStart(2, '0')}]`;

    md += `### SCENE ${idx + 1} ${timeStr} ${cue.isPunchline ? '🔥 [CLIMAX PUNCHLINE]' : ''}\n\n`;
    md += `- **Visual Directive:** ${cue.visualCue}\n`;
    md += `- **Audio Directive:** ${cue.audioCue}\n`;
    md += `- **Pacing & Cadence:** ${cue.pacingNote}\n\n`;
    md += `> **SUPER PUFF (VOICEOVER & ON-SCREEN CAPTION):**\n`;
    md += `> "${cue.spokenText}"\n\n`;
    md += `---\n\n`;
  });

  md += `## RUNWAY / VEO AI VIDEO PROMPTS BUNDLE\n\n`;
  md += `### Master Keyframe Prompt:\n`;
  md += `\`\`\`\n`;
  md += `Cinematic anime stand-up comedy performance. Cell-shaded anthropomorphic stoner dragon in stylish streetwear hoodie with glowing liquid-chrome seams standing on dark reflective glass stage. Holding 3D liquid chrome microphone. Exhales thick volumetric violet smoke forming 54-minute glowing analog clock dials with Japanese kanji (超煙・超時). 4K, 24fps, atmospheric lighting, moody cyberpunk Tokyo comedy club void.\n`;
  md += `\`\`\`\n\n`;

  return md;
}
