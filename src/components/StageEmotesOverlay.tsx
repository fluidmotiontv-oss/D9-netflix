import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, HelpCircle, Eye, RefreshCw, AlertTriangle, Play } from 'lucide-react';

export interface ActiveEmote {
  id: string;
  type: 'eye_roll' | 'smirk' | 'shrug' | 'puff' | 'sweat' | 'mind_blown';
  emoji: string;
  label: string;
  phrase: string;
  x: number; // percentage width from center, e.g., 50 is center
  y: number; // percentage height from top, e.g., 30
  scale?: number;
}

export const PRESET_EMOTES: { type: ActiveEmote['type']; emoji: string; label: string; phrase: string }[] = [
  { 
    type: 'eye_roll', 
    emoji: '🙄', 
    label: 'Kiwi Sarcasm', 
    phrase: 'Yeah, nah. Absolutely arbitrary knuckles.' 
  },
  { 
    type: 'smirk', 
    emoji: '😏', 
    label: 'Tokyo Smugness', 
    phrase: '顔見ろよ、完全にフリーズしてるぜ！' 
  },
  { 
    type: 'shrug', 
    emoji: '🤷‍♂️', 
    label: 'Sumerian Dismissal', 
    phrase: 'Not ideal for you, but legendary for me.' 
  },
  { 
    type: 'puff', 
    emoji: '💨', 
    label: 'Cosmic Exhaust', 
    phrase: '*takes a massive, reality-bending bong rip*' 
  },
  { 
    type: 'sweat', 
    emoji: '😰', 
    label: 'Composure Check', 
    phrase: 'Dave in the front row is staring into my soul...' 
  },
  { 
    type: 'mind_blown', 
    emoji: '🤯', 
    label: 'Time Collapse', 
    phrase: 'Times Up, Mother Fathers! 54-Min Harmonic shift!' 
  }
];

// Context-aware automatic beats mapping for each act
export interface EmoteBeat {
  minProgress: number;
  maxProgress: number;
  type: ActiveEmote['type'];
  emoji: string;
  label: string;
  phrase: string;
  x: number;
  y: number;
}

export const AUTOMATIC_EMOTE_BEATS: Record<string, EmoteBeat[]> = {
  // Support both act-1 (default) and act_01_threshold (bilingual export)
  'act-1': [
    { minProgress: 14, maxProgress: 24, type: 'eye_roll', emoji: '🙄', label: 'Sumerian Dismissal', phrase: '"Yeah, nah. Arbitrary knuckles."', x: 35, y: 30 },
    { minProgress: 45, maxProgress: 56, type: 'puff', emoji: '💨', label: 'Terpene Inhalation', phrase: '*exhales thick cloud of Cosmic OG logic*', x: 65, y: 32 },
    { minProgress: 80, maxProgress: 92, type: 'mind_blown', emoji: '🤯', label: 'Time Collapse', phrase: '"Times Up, Mother Fathers! Snap back!"', x: 50, y: 25 },
  ],
  'act_01_threshold': [
    { minProgress: 14, maxProgress: 24, type: 'eye_roll', emoji: '🙄', label: 'Sumerian Dismissal', phrase: '"Yeah, nah. Arbitrary knuckles."', x: 35, y: 30 },
    { minProgress: 45, maxProgress: 56, type: 'puff', emoji: '💨', label: 'Terpene Inhalation', phrase: '*exhales thick cloud of Cosmic OG logic*', x: 65, y: 32 },
    { minProgress: 80, maxProgress: 92, type: 'mind_blown', emoji: '🤯', label: 'Time Collapse', phrase: '"Times Up, Mother Fathers! Snap back!"', x: 50, y: 25 },
  ],
  'act_02_deep_tuning': [
    { minProgress: 15, maxProgress: 25, type: 'eye_roll', emoji: '🙄', label: 'Kiwi Sarcasm', phrase: '"Staring at a microwave for 60 seconds?"', x: 35, y: 30 },
    { minProgress: 48, maxProgress: 58, type: 'puff', emoji: '💨', label: 'Cosmic Exhaust', phrase: '*exhales 432Hz ambient sub-drone*', x: 68, y: 32 },
    { minProgress: 82, maxProgress: 92, type: 'mind_blown', emoji: '🤯', label: 'Linear Time Collapse', phrase: '"Times Up, Mother Fathers! 54-min Protocol!"', x: 50, y: 25 },
  ],
  'act-2': [
    { minProgress: 18, maxProgress: 28, type: 'smirk', emoji: '😏', label: 'Tokyo Smugness', phrase: '"顔見ろよ、完全にフリーズしてるぜ"', x: 68, y: 28 },
    { minProgress: 48, maxProgress: 58, type: 'shrug', emoji: '🤷‍♂️', label: 'NZ Empathy', phrase: '"You left the stove on in 2014, didn\'t ya?"', x: 32, y: 32 },
    { minProgress: 82, maxProgress: 92, type: 'mind_blown', emoji: '🤯', label: 'Time-Slice Eruption', phrase: '"時間切れだぜ、マザーファザーズ！"', x: 50, y: 24 },
  ],
  'act_03_cosmic_shift': [
    { minProgress: 18, maxProgress: 28, type: 'smirk', emoji: '😏', label: 'Tokyo Smugness', phrase: '"顔見ろよ、完全にフリーズしてるぜ"', x: 68, y: 28 },
    { minProgress: 48, maxProgress: 58, type: 'shrug', emoji: '🤷‍♂️', label: 'NZ Empathy', phrase: '"You left the stove on in 2014, didn\'t ya?"', x: 32, y: 32 },
    { minProgress: 82, maxProgress: 92, type: 'mind_blown', emoji: '🤯', label: 'Time-Slice Eruption', phrase: '"時間切れだぜ、マザーファザーズ！"', x: 50, y: 24 },
  ],
  'act-3': [
    { minProgress: 15, maxProgress: 25, type: 'shrug', emoji: '🤷‍♂️', label: 'Gravity Resigns', phrase: '"Not ideal for you, but legendary for me."', x: 30, y: 34 },
    { minProgress: 50, maxProgress: 60, type: 'smirk', emoji: '😏', label: 'Swagger Peak', phrase: '"俺がこの街で一番デカい時計だ！"', x: 70, y: 28 },
    { minProgress: 82, maxProgress: 92, type: 'mind_blown', emoji: '🤯', label: 'Shibuya Vector Explode', phrase: '"Times Up, Mother Fathers!" *laser beams*', x: 50, y: 25 },
  ],
  'act_04_apex_exit': [
    { minProgress: 15, maxProgress: 25, type: 'shrug', emoji: '🤷‍♂️', label: 'Gravity Resigns', phrase: '"Not ideal for you, but legendary for me."', x: 30, y: 34 },
    { minProgress: 50, maxProgress: 60, type: 'smirk', emoji: '😏', label: 'Swagger Peak', phrase: '"俺がこの街で一番デカい時計だ！"', x: 70, y: 28 },
    { minProgress: 82, maxProgress: 92, type: 'mind_blown', emoji: '🤯', label: 'Shibuya Vector Explode', phrase: '"Times Up, Mother Fathers!" *laser beams*', x: 50, y: 25 },
  ],
  'outro': [
    { minProgress: 28, maxProgress: 38, type: 'smirk', emoji: '😏', label: 'Antidotal Exit', phrase: '"じゃあな、良い夢見ろよ (See ya, sweet dreams)"', x: 65, y: 30 },
    { minProgress: 65, maxProgress: 78, type: 'puff', emoji: '💨', label: 'Deep Terpene Rest', phrase: '*Super Puff is out. Thick violet smoke engulfs*', x: 35, y: 32 },
  ]
};

interface StageEmotesOverlayProps {
  activeEmotes: ActiveEmote[];
  onRemoveEmote?: (id: string) => void;
}

export function StageEmotesOverlay({ activeEmotes, onRemoveEmote }: StageEmotesOverlayProps) {
  return (
    <div className="absolute inset-0 pointer-events-none z-30 select-none overflow-hidden">
      <AnimatePresence>
        {activeEmotes.map((emote) => {
          // Dynamic glow/colors based on emote type
          let glowColor = 'rgba(234, 88, 12, 0.4)'; // orange
          let borderColor = 'border-orange-500/30';
          let bgGradient = 'from-orange-950/75 via-black/85 to-amber-950/70';
          let textGlow = 'text-orange-400';

          if (emote.type === 'eye_roll' || emote.type === 'shrug') {
            glowColor = 'rgba(14, 165, 233, 0.4)'; // cyan
            borderColor = 'border-sky-500/30';
            bgGradient = 'from-sky-950/75 via-black/85 to-blue-950/70';
            textGlow = 'text-sky-400';
          } else if (emote.type === 'puff') {
            glowColor = 'rgba(168, 85, 247, 0.4)'; // purple
            borderColor = 'border-purple-500/30';
            bgGradient = 'from-purple-950/75 via-black/85 to-indigo-950/70';
            textGlow = 'text-purple-400';
          } else if (emote.type === 'sweat') {
            glowColor = 'rgba(239, 68, 68, 0.4)'; // red
            borderColor = 'border-red-500/30';
            bgGradient = 'from-red-950/75 via-black/85 to-rose-950/70';
            textGlow = 'text-red-400';
          } else if (emote.type === 'mind_blown') {
            glowColor = 'rgba(245, 158, 11, 0.5)'; // gold
            borderColor = 'border-amber-400/40';
            bgGradient = 'from-amber-950/80 via-black/90 to-yellow-950/70';
            textGlow = 'text-amber-400';
          }

          return (
            <motion.div
              key={emote.id}
              initial={{ opacity: 0, scale: 0.5, y: emote.y + 12, x: `${emote.x}%` }}
              animate={{ 
                opacity: 1, 
                scale: emote.scale || 1.0, 
                y: emote.y,
                x: `${emote.x}%`,
                rotate: [0, -2, 2, 0]
              }}
              exit={{ opacity: 0, scale: 0.7, y: emote.y - 35, transition: { duration: 0.35 } }}
              transition={{ 
                type: 'spring', 
                stiffness: 140, 
                damping: 14,
                rotate: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' } 
              }}
              className="absolute left-0 -translate-x-1/2 pointer-events-auto cursor-pointer"
              style={{ top: `${emote.y}%` }}
              onClick={() => onRemoveEmote && onRemoveEmote(emote.id)}
              title="Click to pop emote"
            >
              {/* Floating Container */}
              <div 
                className={`relative p-3 rounded-2xl border ${borderColor} bg-gradient-to-br ${bgGradient} backdrop-blur-xl shadow-2xl flex items-center gap-3 w-[220px] sm:w-[260px] transform hover:scale-105 transition-transform duration-200 select-none`}
                style={{
                  boxShadow: `0 10px 30px -10px rgba(0, 0, 0, 0.7), 0 0 15px 1px ${glowColor}`
                }}
              >
                {/* Neon Particle Orbit */}
                <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-30 animate-pulse pointer-events-none" />

                {/* Left side Large Animated Emoji */}
                <motion.div 
                  animate={{ 
                    scale: [1, 1.25, 1],
                    rotate: [0, -10, 10, 0]
                  }}
                  transition={{ 
                    duration: 1.8, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-4xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.25)] select-none pointer-events-none"
                >
                  {emote.emoji}
                </motion.div>

                {/* Right side Metadata & Subtitle */}
                <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                  <div className="flex items-center gap-1">
                    <span className={`text-[8px] font-mono uppercase tracking-widest ${textGlow} font-black`}>
                      {emote.label}
                    </span>
                    <Sparkles className={`w-2.5 h-2.5 ${textGlow} animate-pulse shrink-0`} />
                  </div>
                  <p className="text-[10px] leading-snug font-mono text-white/90 font-medium line-clamp-2">
                    {emote.phrase}
                  </p>
                  <span className="text-[7px] font-mono text-white/30 text-right uppercase tracking-wider block mt-0.5">
                    Click to Pop
                  </span>
                </div>

                {/* Pop indicator ring */}
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500/80 border border-white/20 animate-ping pointer-events-none" />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
