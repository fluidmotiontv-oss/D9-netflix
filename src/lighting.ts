export interface LightingMood {
  id: string;
  name: string;
  tone: string;
  description: string;
  primary: string;
  secondary: string;
  ambient: string;
  accent: string;
  pulseSpeed: string;
  pattern: 'breathing' | 'resonance' | 'cyber-strobe' | 'aurora-fade' | 'rainbow-cycle';
}

export const LIGHTING_MOODS: Record<string, LightingMood> = {
  'act-1': {
    id: 'cosmic-amber',
    name: 'Cosmic Amber',
    tone: 'Stoner Skepticism & Sumerian Time',
    description: 'Warm undulating amber tones evoking ancient campfire smoke and relaxed skepticism.',
    primary: '#f97316',
    secondary: '#eab308',
    ambient: 'rgba(249, 115, 22, 0.35)',
    accent: '#fdba74',
    pulseSpeed: '4.2s',
    pattern: 'breathing',
  },
  'act-2': {
    id: 'liquid-resonance',
    name: 'Liquid Resonance',
    tone: 'Liquid Chrome & Polite Roasts',
    description: 'Electric cyan and deep indigo time-slicing aura with crisp harmonic pulses.',
    primary: '#06b6d4',
    secondary: '#6366f1',
    ambient: 'rgba(6, 182, 212, 0.35)',
    accent: '#67e8f9',
    pulseSpeed: '2.6s',
    pattern: 'resonance',
  },
  'act-3': {
    id: 'cyber-magenta',
    name: 'Cyberpunk Rant',
    tone: '27° Pitch Urgency & Neon Geometry',
    description: 'High-voltage fuchsia, neon magenta and crimson laser bursts echoing narrative urgency.',
    primary: '#d946ef',
    secondary: '#f43f5e',
    ambient: 'rgba(217, 70, 239, 0.38)',
    accent: '#f472b6',
    pulseSpeed: '1.9s',
    pattern: 'cyber-strobe',
  },
  'outro': {
    id: 'emerald-void',
    name: 'Nebula Jade',
    tone: 'Deep Chill & Temporal Reverb',
    description: 'Ethereal emerald fog and deep aurora jade drifting quietly into the void.',
    primary: '#10b981',
    secondary: '#14b8a6',
    ambient: 'rgba(16, 185, 129, 0.32)',
    accent: '#6ee7b7',
    pulseSpeed: '5.0s',
    pattern: 'aurora-fade',
  },
  'hyper-cycle': {
    id: 'hyper-cycle',
    name: 'Multiverse Prism',
    tone: 'Continuous Chromatic Flow',
    description: 'Rapid 360-degree rainbow spectrum shift traversing all dimensional frequencies.',
    primary: '#a855f7',
    secondary: '#3b82f6',
    ambient: 'rgba(168, 85, 247, 0.35)',
    accent: '#e879f9',
    pulseSpeed: '2.2s',
    pattern: 'rainbow-cycle',
  },
};

export function getLightingMoodForAct(act: any): LightingMood {
  if (!act) return LIGHTING_MOODS['act-1'];
  
  // Direct match by ID
  if (LIGHTING_MOODS[act.id]) {
    return LIGHTING_MOODS[act.id];
  }

  // Text-based mood inference for dynamically generated acts
  const text = `${act.title || ''} ${act.bit || ''} ${act.gag || ''}`.toLowerCase();
  
  if (text.includes('microwave') || text.includes('quantum') || text.includes('paradox') || text.includes('laser')) {
    return {
      id: 'quantum-violet',
      name: 'Quantum Violet',
      tone: 'Superposition & Space-Time Warps',
      description: 'Ultra-deep violet and neon cobalt representing quantum superposition and microwave loops.',
      primary: '#8b5cf6',
      secondary: '#06b6d4',
      ambient: 'rgba(139, 92, 246, 0.35)',
      accent: '#c4b5fd',
      pulseSpeed: '2.3s',
      pattern: 'resonance',
    };
  }

  if (text.includes('fire') || text.includes('roast') || text.includes('blunt') || text.includes('dragon')) {
    return {
      id: 'dragon-flame',
      name: 'Solar Flare Amber',
      tone: 'Dragon Fire & Cosmic Bong Heat',
      description: 'Blazing solar orange and molten ruby radiating dragon breath heat.',
      primary: '#f97316',
      secondary: '#ef4444',
      ambient: 'rgba(249, 115, 22, 0.4)',
      accent: '#fca5a5',
      pulseSpeed: '2.8s',
      pattern: 'breathing',
    };
  }

  if (text.includes('chill') || text.includes('zen') || text.includes('void') || text.includes('smoke')) {
    return LIGHTING_MOODS['outro'];
  }

  // Default to Cosmic Amber
  return LIGHTING_MOODS['act-1'];
}
