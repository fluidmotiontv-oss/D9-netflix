import { motion } from 'motion/react';

interface PlasmaStageBackgroundProps {
  intensity: 'normal' | 'high';
  isPlasmaActive: boolean;
}

export function PlasmaStageBackground({ intensity, isPlasmaActive }: PlasmaStageBackgroundProps) {
  if (!isPlasmaActive) return null;

  // Speed multiplier based on intensity (lower duration = faster waves)
  const durationScale = intensity === 'high' ? 0.32 : 1.0; 
  
  // Dynamic color palette: Toxic deep red/blood tones for Brutal Mode high intensity, neon pink/cyan for normal
  const stopMagenta = intensity === 'high' ? '#ef4444' : '#d946ef'; // Red vs Magenta
  const stopCyan = intensity === 'high' ? '#f97316' : '#22d3ee';    // Burning Orange vs Electric Cyan
  const stopGold = intensity === 'high' ? '#b91c1c' : '#fbbf24';    // Blood Red vs Radiant Gold
  const stopEmerald = intensity === 'high' ? '#7f1d1d' : '#34d399'; // Deep Void Red vs Toxic Emerald

  return (
    <>
      <defs>
        {/* Shimmering plasma gradients responding dynamically to Brutal intensity */}
        <radialGradient id="plasmaMagenta" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={stopMagenta} stopOpacity="0.85" />
          <stop offset="50%" stopColor={intensity === 'high' ? '#450a0a' : '#a855f7'} stopOpacity="0.35" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="plasmaCyan" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={stopCyan} stopOpacity="0.9" />
          <stop offset="50%" stopColor={intensity === 'high' ? '#7f1d1d' : '#3b82f6'} stopOpacity="0.35" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="plasmaGold" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={stopGold} stopOpacity="0.8" />
          <stop offset="55%" stopColor={intensity === 'high' ? '#991b1b' : '#ec4899'} stopOpacity="0.35" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="plasmaEmerald" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={stopEmerald} stopOpacity="0.85" />
          <stop offset="55%" stopColor={intensity === 'high' ? '#3f0712' : '#06b6d4'} stopOpacity="0.3" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>

        {/* SVG Displacement Filter with animation speed synced to intensity */}
        <filter id="d9enigmaPlasma" x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" result="noise">
            <animate 
              attributeName="baseFrequency" 
              values="0.012;0.026;0.012" 
              dur={intensity === 'high' ? "3.8s" : "14s"} 
              repeatCount="indefinite" 
            />
          </feTurbulence>
          <feColorMatrix type="matrix" values="
            1 0 0 0 0
            0 1 0 0 0
            0 0 1 0 0
            0 0 0 24 -9
          " result="coloredNoise" />
          <feDisplacementMap 
            in="SourceGraphic" 
            in2="coloredNoise" 
            scale={intensity === 'high' ? 48 : 26} 
            xChannelSelector="R" 
            yChannelSelector="G" 
          />
        </filter>
      </defs>

      {/* Volumetric dynamic plasma cloud group */}
      <g filter="url(#d9enigmaPlasma)" opacity={intensity === 'high' ? "0.95" : "0.85"}>
        <motion.circle
          cx="140"
          cy="150"
          r="115"
          fill="url(#plasmaMagenta)"
          animate={{
            scale: intensity === 'high' ? [1, 1.45, 0.75, 1.25] : [1, 1.25, 0.9, 1.1],
            cx: [140, 165, 125, 140],
            cy: [150, 130, 175, 150],
          }}
          transition={{
            duration: 8 * durationScale,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.circle
          cx="180"
          cy="195"
          r="125"
          fill="url(#plasmaCyan)"
          animate={{
            scale: intensity === 'high' ? [1.25, 0.75, 1.45, 1.25] : [1.15, 0.9, 1.35, 1.15],
            cx: [180, 145, 195, 180],
            cy: [195, 215, 170, 195],
          }}
          transition={{
            duration: 10 * durationScale,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.circle
          cx="160"
          cy="170"
          r="105"
          fill="url(#plasmaGold)"
          animate={{
            scale: intensity === 'high' ? [0.75, 1.4, 1.15, 0.75] : [0.9, 1.25, 1.1, 0.9],
            cx: [160, 180, 140, 160],
            cy: [170, 150, 190, 170],
          }}
          transition={{
            duration: 7 * durationScale,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.circle
          cx="115"
          cy="215"
          r="95"
          fill="url(#plasmaEmerald)"
          animate={{
            scale: intensity === 'high' ? [1, 1.45, 0.8, 1] : [1, 1.35, 0.9, 1],
            cx: [115, 135, 105, 115],
            cy: [215, 195, 230, 215],
          }}
          transition={{
            duration: 9 * durationScale,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </g>
    </>
  );
}

export default PlasmaStageBackground;
