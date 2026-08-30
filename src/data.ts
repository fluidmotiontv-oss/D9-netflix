import { Clock, AudioWaveform, Activity, Aperture, Video, Layers } from 'lucide-react';

export const CORE_PREMISE = {
  title: 'Core Premise & Worldbuilding',
  description:
    'Instead of a standard brick-wall comedy club, the special takes place inside a shifting 3D temporal void. The "comedian"—an avatar of a hyper-conscious, surprisingly polite dragon—stands at a glowing mic stand, alternating between taking hits from a massive glass bong and casually puffing a blunt. He\'s breaking down the absurdities of linear human existence and social conditioning, laying down deep stoner logic with a dry, Kiwi-accented moan about daylight savings.',
};

export const ACTS = [
  {
    id: 'act-1',
    time: '0:00 – 12:00',
    title: 'Act I: The 60-Minute Lie, Eh?',
    bit: '"You divided your life into 60s because some Sumerians looked at their knuckles 5,000 years ago? Yeah, nah." *takes a massive bong rip* "Now you\'re stressing over being five minutes late to a job you don\'t even like. Cheers for that, Gilgamesh. Just a bit silly, isn\'t it?"',
    gag: 'The dragon exhales a thick cloud of smoke that morphs into a giant, ticking analog clock, which slowly warps into a 54-minute fluid geometry loop.',
    audio: 'Muted rimshots layered over heavy 808 sub-bass drops every time a punchline hits.',
    icon: Clock,
  },
  {
    id: 'act-2',
    time: '12:00 – 28:00',
    title: 'Act II: The Resonance Routine (Polite Roasts)',
    bit: 'Crowdsourcing jokes from the "void." He pauses awkward audience reactions in mid-air, using his blunt as a pointer to roast them politely. "Aw mate, look at your face. You left the stove on in 2014, didn\'t ya? That\'s gutting."',
    gag: 'The avatar uses a 3D liquid-chrome mic in one hand and a blunt in the other to literally slice through time frames. Smoke rings freeze in mid-air around the audience.',
    audio: 'Distorted echo delays mapped to crowd silences.',
    icon: AudioWaveform,
  },
  {
    id: 'act-3',
    time: '28:00 – 40:00',
    title: 'Act III: The 27° Pitch (Not Ideal)',
    bit: 'Transitioning to a passionate but slightly awkward rant about temporal alignment. "You\'re all using an un-synchronized framework, which is... you know, it\'s just not ideal, eh?" *gestures wildly with the blunt* "It\'s like trying to pitch a temporal tent in the dark."',
    gag: 'Neon vector lines explode across the stage from the cherry of the blunt, forming animated backdrops of cyberpunk streetscapes, vintage-washed streetwear models, and shifting liquid geometry.',
    audio: 'BPM shifts matching the narrative urgency, synth risers on punchlines.',
    icon: Activity,
  },
  {
    id: 'outro',
    time: '40:00 – 45:00',
    title: 'Outro: Yeah, Nah, I\'m Off',
    bit: 'The avatar drops the mic, takes one last huge rip from the bong, and exhales. "Right, have a good one." A sudden snap back to reality.',
    gag: 'The entire animated set gets swallowed by a massive, screen-filling cloud of thick smoke, collapsing into a single floating liquid chrome emblem against a dark void.',
    audio: 'Low-pass reverb tail, bubbling bong water SFX, vinyl crackle fade.',
    icon: Aperture,
  },
];

export const PROMPTS = [
  {
    id: 'prompt-1',
    title: 'Act 1: Veo 3.1 Fast Motion Directive',
    prompt:
      'Medium shot of animated dragon puffing a blunt, exhaling a thick cloud of stylized smoke that warps into a 54-minute fluid clock loop. 24fps cell-shaded animation, dark cyberpunk void.',
    icon: Video,
  },
  {
    id: 'prompt-2',
    title: 'Act 2: Veo 3 Motion Directive',
    prompt:
      'Dragon using a glowing blunt to slice through liquid-chrome time frames, freezing smoke rings in mid-air around an audience in a dark void. Vibrant neon rim lighting.',
    icon: Video,
  },
  {
    id: 'prompt-3',
    title: 'Audio TTS Synthesis Directives',
    prompt:
      'Voice Profile: Male New Zealand (en-NZ) neural voice. Low pitch, relaxed vocal fry on sentence endings.\nKey phrase delivery: "not ideal, eh?" (Slow cadence, dry tone).',
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
