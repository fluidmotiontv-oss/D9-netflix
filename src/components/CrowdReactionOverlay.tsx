import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CrowdReactionItem } from '../audio/crowdAudio';

export interface ActiveCrowdParticle {
  id: string;
  reaction: CrowdReactionItem;
  x: number; // percentage from left
  startY: number; // percentage from top
  scale: number;
  rotation: number;
}

export interface CrowdReactionOverlayProps {
  particles: ActiveCrowdParticle[];
  activeReaction?: CrowdReactionItem | null;
}

export const CrowdReactionOverlay: React.FC<CrowdReactionOverlayProps> = ({
  particles,
  activeReaction,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-25 overflow-hidden">
      
      {/* Floating Particle Bursts */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ 
              opacity: 0, 
              scale: 0.3, 
              x: `${p.x}%`, 
              y: `${p.startY}%`,
              rotate: p.rotation - 20
            }}
            animate={{ 
              opacity: [0, 1, 1, 0], 
              scale: [0.3, p.scale * 1.3, p.scale, p.scale * 0.8], 
              y: [`${p.startY}%`, `${p.startY - 35}%`, `${p.startY - 70}%`],
              rotate: [p.rotation - 20, p.rotation + 15, p.rotation - 10]
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 2.2, 
              ease: "easeOut",
              times: [0, 0.15, 0.7, 1] 
            }}
            className="absolute left-0 top-0 select-none flex flex-col items-center justify-center filter drop-shadow-[0_0_12px_rgba(0,0,0,0.8)]"
            style={{
              textShadow: `0 0 20px ${p.reaction.color}88`,
            }}
          >
            <span className="text-4xl sm:text-5xl">{p.reaction.emoji}</span>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Center Stage Reaction Banner Callout */}
      <AnimatePresence>
        {activeReaction && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -15 }}
            transition={{ type: "spring", damping: 15, stiffness: 300 }}
            className="absolute top-8 left-1/2 -translate-x-1/2 pointer-events-none z-30"
          >
            <div 
              className="px-4 py-2 rounded-2xl border backdrop-blur-xl flex items-center gap-2.5 shadow-2xl"
              style={{
                backgroundColor: `${activeReaction.color}22`,
                borderColor: `${activeReaction.color}88`,
                boxShadow: `0 0 30px ${activeReaction.color}44`,
              }}
            >
              <span className="text-2xl animate-bounce">{activeReaction.emoji}</span>
              <div className="flex flex-col">
                <span className="text-xs font-mono font-black uppercase tracking-wider text-white">
                  {activeReaction.label}
                </span>
                <span className="text-[9px] font-mono text-white/70">
                  {activeReaction.description}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default CrowdReactionOverlay;
