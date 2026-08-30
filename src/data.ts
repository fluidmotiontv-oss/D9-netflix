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
    title: 'Main Avatar / Stage Setup (Midjourney v6)',
    prompt:
      'Stylized 2D/3D hybrid animated comedy special, a majestic humanoid dragon wearing a vintage oversized black hoodie smoking a blunt at a comedy club microphone, a large ornate glass bong on a stool next to him, thick stylized smoke framing the shot, neon rim lighting, dark void background with subtle floating geometric grid, Adult Swim animation aesthetic, cell-shaded, dynamic cinematic lighting --ar 16:9 --style raw --v 6.1',
    icon: Aperture,
  },
  {
    id: 'prompt-2',
    title: 'I2V Motion Directive (Runway Gen-3 / Kling 1.5)',
    prompt:
      'Medium shot of animated dragon avatar talking into a microphone holding a glowing blunt, taking a puff and exhaling thick stylized smoke, expressive facial comedy timing, subtle background neon light pulse, steady camera, 24fps cell-shaded animation',
    icon: Video,
  },
  {
    id: 'prompt-3',
    title: 'Key SFX Layering for NLE Timeline',
    prompt:
      'Punchlines: Sub-bass drop + vinyl crackle stop.\nCrowd Reactions: Reverb-drenched, slightly distorted synth laughter.\nStage Transitions: Glitch risers and metallic whip-pan whooshes.',
    icon: Layers,
  },
];
