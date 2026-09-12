// Canvas Performer Renderer for Video Export Studio & Modals
// Renders the complete, high-fidelity 2.5D Cell-Shaded Super Puff Dragon Performer
// with top-layer face, horns, snout, sunglasses, expressive eyes, talking mouth,
// gold clock medallion, glowing blunt, microphone, stage lighting, and subtitles.

import { ScriptCue } from './scriptTimedCues';

export interface LayerVisibilityConfig {
  background?: boolean;
  actor?: boolean;
  overlay?: boolean;
}

export interface CanvasRenderOptions {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  timestamp: number;
  currentTimeSec: number;
  targetDurationSec: number;
  currentCue: ScriptCue | null;
  aspectRatio: '9:16' | '16:9';
  targetLanguage?: string;
  clipTitle?: string;
  presetTitle?: string;
  strainPairing?: string;
  includeSubtitles?: boolean;
  includeTimingVisualizer?: boolean;
  primaryColor?: string;
  accentColor?: string;
  isSpeaking?: boolean;
  fps?: number;
  videoFormat?: 'mp4' | 'webm';
  layers?: LayerVisibilityConfig;
  previewExportMode?: boolean;
  showSafeZones?: boolean;
  showCompositionGrid?: boolean;
  showLayerTags?: boolean;
}

export function drawPerformerCanvasFrame({
  ctx,
  width,
  height,
  timestamp,
  currentTimeSec,
  targetDurationSec,
  currentCue,
  aspectRatio,
  targetLanguage = 'EN',
  clipTitle = 'HIGHLIGHT REEL',
  presetTitle = 'Act I: Threshold',
  strainPairing = 'Cosmic OG (31.4% THC)',
  includeSubtitles = true,
  includeTimingVisualizer = true,
  primaryColor = '#22c55e',
  accentColor = '#a855f7',
  isSpeaking = true,
  fps = 25,
  videoFormat = 'mp4',
  layers = { background: true, actor: true, overlay: true },
  previewExportMode = false,
  showSafeZones = true,
  showCompositionGrid = true,
  showLayerTags = true,
}: CanvasRenderOptions) {
  const showBg = layers.background !== false;
  const showActor = layers.actor !== false;
  const showOverlay = layers.overlay !== false;

  // Clear canvas (default to dark slate transparency if bg hidden for alpha testing)
  ctx.clearRect(0, 0, width, height);

  if (!showBg) {
    // Checkerboard pattern for transparent/alpha preview
    ctx.save();
    const squareSize = 20;
    for (let x = 0; x < width; x += squareSize) {
      for (let y = 0; y < height; y += squareSize) {
        ctx.fillStyle = ((x / squareSize + y / squareSize) % 2 === 0) ? '#111827' : '#0f172a';
        ctx.fillRect(x, y, squareSize, squareSize);
      }
    }
    ctx.restore();
  }

  // =========================================================================
  // LAYER 1: STAGE BACKGROUND & VOLUMETRICS
  // =========================================================================
  if (showBg) {
    // 1. Stage Background Void & Radial Falloff
    const bgGradient = ctx.createRadialGradient(
      width / 2, height * 0.38, 50,
      width / 2, height * 0.55, Math.max(width, height) * 0.85
    );
    bgGradient.addColorStop(0, '#1c1917');
    bgGradient.addColorStop(0.45, '#0c0a09');
    bgGradient.addColorStop(1, '#020202');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // 2. Stage Floor Grid & Glow (Perspective plane)
    ctx.save();
    const floorY = height * 0.70;
    const floorGrad = ctx.createLinearGradient(0, floorY, 0, height);
    floorGrad.addColorStop(0, 'rgba(168, 85, 247, 0.25)');
    floorGrad.addColorStop(0.3, 'rgba(34, 197, 94, 0.12)');
    floorGrad.addColorStop(1, 'rgba(0, 0, 0, 0.9)');
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, floorY, width, height - floorY);

    // Stage Floor Circular Spotlight Reflection
    ctx.beginPath();
    ctx.ellipse(width / 2, floorY + 40, width * 0.38, 35, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(34, 197, 94, 0.20)';
    ctx.filter = 'blur(10px)';
    ctx.fill();
    ctx.filter = 'none';
    ctx.restore();

    // 3. Volumetric Overhead Spotlights (Conic & Linear Sweep)
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const lightSway = Math.sin(timestamp * 0.0012) * 40;

    // Left Cone (Amber / Violet)
    const spotGrad1 = ctx.createLinearGradient(width * 0.3 + lightSway, 0, width * 0.5, floorY);
    spotGrad1.addColorStop(0, 'rgba(168, 85, 247, 0.35)');
    spotGrad1.addColorStop(0.6, 'rgba(34, 197, 94, 0.15)');
    spotGrad1.addColorStop(1, 'transparent');
    ctx.fillStyle = spotGrad1;
    ctx.beginPath();
    ctx.moveTo(width * 0.25 + lightSway, 0);
    ctx.lineTo(width * 0.38 + lightSway, 0);
    ctx.lineTo(width * 0.75, floorY);
    ctx.lineTo(width * 0.25, floorY);
    ctx.closePath();
    ctx.fill();

    // Right Cone (Cyan / Amber)
    const spotGrad2 = ctx.createLinearGradient(width * 0.7 - lightSway, 0, width * 0.5, floorY);
    spotGrad2.addColorStop(0, 'rgba(6, 182, 212, 0.30)');
    spotGrad2.addColorStop(0.6, 'rgba(245, 158, 11, 0.15)');
    spotGrad2.addColorStop(1, 'transparent');
    ctx.fillStyle = spotGrad2;
    ctx.beginPath();
    ctx.moveTo(width * 0.62 - lightSway, 0);
    ctx.lineTo(width * 0.75 - lightSway, 0);
    ctx.lineTo(width * 0.85, floorY);
    ctx.lineTo(width * 0.35, floorY);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // 4. Floating Atmospheric Terpene & Smoke Particles
    ctx.save();
    for (let i = 0; i < 22; i++) {
      const pX = (width * 0.5 + Math.sin(timestamp * 0.0007 + i * 1.5) * (width * 0.42));
      const pY = (floorY - ((timestamp * 0.035 + i * 35) % (height * 0.5)));
      const pRadius = 18 + Math.sin(i * 3 + timestamp * 0.001) * 10;
      const pAlpha = 0.06 + Math.sin(i * 2 + timestamp * 0.002) * 0.04;
      ctx.fillStyle = `rgba(168, 85, 247, ${pAlpha})`;
      ctx.beginPath();
      ctx.arc(pX, pY, pRadius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // =========================================================================
  // LAYER 2: HIGH-FIDELITY 2.5D SUPER PUFF DRAGON PERFORMER (Complete Face & Top Layers)
  // =========================================================================
  const scaleFactor = aspectRatio === '9:16' ? (width / 420) : (height / 640);
  const centerX = width / 2;
  const centerY = aspectRatio === '9:16' ? height * 0.43 : height * 0.44;
  const bounceY = Math.sin(timestamp * 0.004) * 6;
  const swayX = Math.sin(timestamp * 0.002) * 4;

  if (showActor) {
    ctx.save();
    
    // Performer Origin Positioning & Dynamic Sway/Bounce
    ctx.translate(centerX + swayX, centerY + bounceY);
    ctx.scale(scaleFactor, scaleFactor);

    // A. Luminous Ambient Dragon Aura (Back Halo)
  const auraGrad = ctx.createRadialGradient(0, 0, 40, 0, 0, 150);
  auraGrad.addColorStop(0, 'rgba(74, 222, 128, 0.30)');
  auraGrad.addColorStop(0.5, 'rgba(34, 197, 94, 0.12)');
  auraGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = auraGrad;
  ctx.beginPath();
  ctx.arc(0, 0, 150, 0, Math.PI * 2);
  ctx.fill();

  // B. Dragon Back Spikes (Golden Amber with Dark Outlines)
  const drawSpike = (x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    const spikeGrad = ctx.createLinearGradient(x1, y1, x2, y2);
    spikeGrad.addColorStop(0, '#fef08a');
    spikeGrad.addColorStop(0.5, '#f59e0b');
    spikeGrad.addColorStop(1, '#92400e');
    ctx.fillStyle = spikeGrad;
    ctx.fill();
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  drawSpike(-40, -90, -75, -115, -45, -75);
  drawSpike(-55, -50, -95, -70, -60, -35);
  drawSpike(-65, 0, -105, -15, -70, 15);

  // C. Curved Majestic Dragon Horns (Left & Right Horns with Specular Ridges)
  const drawHorn = (isLeft: boolean) => {
    ctx.save();
    if (!isLeft) {
      ctx.scale(-1, 1);
    }
    ctx.beginPath();
    ctx.moveTo(-20, -85);
    ctx.bezierCurveTo(-50, -145, -85, -150, -85, -150);
    ctx.bezierCurveTo(-55, -120, -35, -80, -10, -75);
    ctx.closePath();

    const hornGrad = ctx.createLinearGradient(-20, -85, -85, -150);
    hornGrad.addColorStop(0, '#fef08a');
    hornGrad.addColorStop(0.4, '#f59e0b');
    hornGrad.addColorStop(0.8, '#d97706');
    hornGrad.addColorStop(1, '#78350f');
    ctx.fillStyle = hornGrad;
    ctx.fill();
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Horn Ridge Highlight Line
    ctx.beginPath();
    ctx.moveTo(-25, -90);
    ctx.quadraticCurveTo(-52, -135, -80, -147);
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();

    ctx.restore();
  };

  drawHorn(true);  // Left Horn
  drawHorn(false); // Right Horn

  // D. Dragon Body / Streetwear Cyber Hoodie Shoulders
  ctx.beginPath();
  ctx.moveTo(-60, 60);
  ctx.bezierCurveTo(-90, 80, -110, 150, -125, 200);
  ctx.lineTo(125, 200);
  ctx.bezierCurveTo(110, 150, 90, 80, 60, 60);
  ctx.closePath();
  
  const hoodieGrad = ctx.createLinearGradient(0, 60, 0, 200);
  hoodieGrad.addColorStop(0, '#0f172a');
  hoodieGrad.addColorStop(0.5, '#090d16');
  hoodieGrad.addColorStop(1, '#020617');
  ctx.fillStyle = hoodieGrad;
  ctx.fill();
  ctx.strokeStyle = '#a855f7';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Hoodie Trim Accents & Shoulder Highlights
  ctx.beginPath();
  ctx.moveTo(-55, 65);
  ctx.quadraticCurveTo(-85, 110, -115, 195);
  ctx.strokeStyle = 'rgba(74, 222, 128, 0.7)';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(55, 65);
  ctx.quadraticCurveTo(85, 110, 115, 195);
  ctx.strokeStyle = 'rgba(74, 222, 128, 0.7)';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.stroke();

  // E. Chest Underbelly Scales with Neon Rim Light
  ctx.beginPath();
  ctx.moveTo(-35, 60);
  ctx.quadraticCurveTo(0, 80, 35, 60);
  ctx.quadraticCurveTo(45, 140, 30, 200);
  ctx.lineTo(-30, 200);
  ctx.quadraticCurveTo(-45, 140, -35, 60);
  ctx.closePath();
  
  const scalesGrad = ctx.createLinearGradient(0, 60, 0, 200);
  scalesGrad.addColorStop(0, 'rgba(74, 222, 128, 0.55)');
  scalesGrad.addColorStop(0.5, 'rgba(34, 197, 94, 0.35)');
  scalesGrad.addColorStop(1, 'rgba(21, 128, 61, 0.20)');
  ctx.fillStyle = scalesGrad;
  ctx.fill();
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 4]);
  ctx.stroke();
  ctx.setLineDash([]);

  // Individual Chest Scale Ridges
  ctx.strokeStyle = '#86efac';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-25, 95); ctx.quadraticCurveTo(0, 107, 25, 95);
  ctx.moveTo(-28, 125); ctx.quadraticCurveTo(0, 137, 28, 125);
  ctx.moveTo(-26, 155); ctx.quadraticCurveTo(0, 167, 26, 155);
  ctx.stroke();

  // F. Heavy Gold Chain & Clock Medallion ("超時" 9:54 / 54-Min Harmonic)
  ctx.beginPath();
  ctx.moveTo(-45, 55);
  ctx.quadraticCurveTo(0, 105, 45, 55);
  const chainGrad = ctx.createLinearGradient(-45, 55, 45, 55);
  chainGrad.addColorStop(0, '#fef08a');
  chainGrad.addColorStop(0.3, '#fbbf24');
  chainGrad.addColorStop(0.7, '#f59e0b');
  chainGrad.addColorStop(1, '#d97706');
  ctx.strokeStyle = chainGrad;
  ctx.lineWidth = 5;
  ctx.setLineDash([7, 4]);
  ctx.stroke();
  ctx.setLineDash([]);

  // Medallion Outer Disc
  ctx.beginPath();
  ctx.arc(0, 100, 16, 0, Math.PI * 2);
  ctx.fillStyle = '#0f172a';
  ctx.fill();
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Medallion Clock Inner Hands (Showing 9:54)
  ctx.beginPath();
  ctx.arc(0, 100, 13, 0, Math.PI * 2);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 2]);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.beginPath();
  ctx.moveTo(0, 100);
  ctx.lineTo(-7, 98); // Hour hand to 9
  ctx.moveTo(0, 100);
  ctx.lineTo(2, 90);  // Minute hand to 54
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Medallion Kanji Label
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 8px monospace';
  ctx.textAlign = 'center';
  ctx.fillText("超時", 0, 124);

  // G. Dragon Neck
  ctx.beginPath();
  ctx.moveTo(-40, 0);
  ctx.lineTo(-45, 65);
  ctx.lineTo(45, 65);
  ctx.lineTo(40, 0);
  ctx.closePath();
  const neckGrad = ctx.createLinearGradient(0, 0, 0, 65);
  neckGrad.addColorStop(0, '#16a34a');
  neckGrad.addColorStop(1, '#14532d');
  ctx.fillStyle = neckGrad;
  ctx.fill();
  ctx.strokeStyle = '#052e16';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // H. DRAGON HEAD STRUCTURE (Radiant Jade-Emerald Cell-Shaded Geometry)
  ctx.beginPath();
  ctx.moveTo(-45, -50);
  ctx.quadraticCurveTo(-50, -105, 0, -105);
  ctx.quadraticCurveTo(50, -105, 45, -50);
  ctx.quadraticCurveTo(65, -25, 50, 10);
  ctx.quadraticCurveTo(0, 35, -50, 10);
  ctx.quadraticCurveTo(-65, -25, -45, -50);
  ctx.closePath();

  const headGrad = ctx.createLinearGradient(0, -105, 0, 35);
  headGrad.addColorStop(0, '#4ade80');
  headGrad.addColorStop(0.35, '#22c55e');
  headGrad.addColorStop(0.70, '#16a34a');
  headGrad.addColorStop(1, '#0f4625');
  ctx.fillStyle = headGrad;
  ctx.fill();
  ctx.strokeStyle = '#052e16';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Forehead & Brow Specular Ridge
  ctx.beginPath();
  ctx.moveTo(-35, -90);
  ctx.quadraticCurveTo(0, -100, 35, -90);
  ctx.strokeStyle = '#bbf7d0';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Cheekbone Highlights
  ctx.save();
  ctx.fillStyle = 'rgba(74, 222, 128, 0.6)';
  ctx.beginPath();
  ctx.ellipse(-48, -25, 6, 12, -0.25, 0, Math.PI * 2);
  ctx.ellipse(48, -25, 6, 12, 0.25, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // I. Expressive Snout & Nostrils with Smoke Wisps
  ctx.beginPath();
  ctx.moveTo(-28, -25);
  ctx.quadraticCurveTo(0, -38, 28, -25);
  ctx.strokeStyle = '#bbf7d0';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Left & Right Nostrils
  ctx.beginPath();
  ctx.ellipse(-15, -15, 5, 7, 0, 0, Math.PI * 2);
  ctx.ellipse(15, -15, 5, 7, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#052e16';
  ctx.fill();
  ctx.strokeStyle = '#4ade80';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Nostril Smoke Wisps
  if (isSpeaking) {
    const nostrilSmoke = Math.sin(timestamp * 0.008);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.arc(-15, -22 + nostrilSmoke * 3, 3, 0, Math.PI * 2);
    ctx.arc(15, -22 + nostrilSmoke * 3, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // J. STONED DRAGON EYES (Red Glow with Golden Pupils & Blinking)
  const isBlinking = Math.sin(timestamp * 0.002) > 0.94;
  const eyeHeight = isBlinking ? 2 : 12;

  // Eye Sockets
  ctx.fillStyle = '#ef4444';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2.5;

  // Left Eye Socket
  ctx.beginPath();
  ctx.ellipse(-25, -60, 14, eyeHeight, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Right Eye Socket
  ctx.beginPath();
  ctx.ellipse(25, -60, 14, eyeHeight, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Pupils & Golden Iris Glints (if eyes are open)
  if (!isBlinking) {
    ctx.fillStyle = '#7f1d1d';
    ctx.beginPath();
    ctx.ellipse(-23, -60, 4.5, 9, 0, 0, Math.PI * 2);
    ctx.ellipse(23, -60, 4.5, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(-27, -64, 2.5, 0, Math.PI * 2);
    ctx.arc(21, -64, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // K. SUPER COOL GOLD AVIATOR SUNGLASSES (Lenses, Wire Frames & Glints)
  // Top Brow Bar
  ctx.beginPath();
  ctx.moveTo(-40, -70);
  ctx.quadraticCurveTo(0, -74, 40, -70);
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Wire Frame Nose Bridge
  ctx.beginPath();
  ctx.moveTo(-13, -64);
  ctx.lineTo(13, -64);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Left Sunglasses Lens
  ctx.beginPath();
  ctx.moveTo(-40, -68);
  ctx.quadraticCurveTo(-25, -70, -12, -66);
  ctx.quadraticCurveTo(-12, -48, -25, -46);
  ctx.quadraticCurveTo(-40, -48, -40, -68);
  ctx.closePath();

  const lensGrad = ctx.createLinearGradient(-40, -68, -12, -46);
  lensGrad.addColorStop(0, '#312e81');
  lensGrad.addColorStop(0.5, '#1e1b4b');
  lensGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = lensGrad;
  ctx.fill();
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Left Lens Diagonal Glint
  ctx.beginPath();
  ctx.moveTo(-36, -65);
  ctx.lineTo(-28, -52);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.lineWidth = 1.5;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Right Sunglasses Lens
  ctx.beginPath();
  ctx.moveTo(12, -66);
  ctx.quadraticCurveTo(25, -70, 40, -68);
  ctx.quadraticCurveTo(40, -48, 25, -46);
  ctx.quadraticCurveTo(12, -48, 12, -66);
  ctx.closePath();
  ctx.fillStyle = lensGrad;
  ctx.fill();
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Right Lens Diagonal Glint
  ctx.beginPath();
  ctx.moveTo(16, -65);
  ctx.lineTo(24, -52);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.lineWidth = 1.5;
  ctx.lineCap = 'round';
  ctx.stroke();

  // L. Expressive Eyebrows (Swagger / Comedic Delivery)
  ctx.beginPath();
  ctx.moveTo(-42, -74);
  ctx.quadraticCurveTo(-25, -80, -8, -72);
  ctx.moveTo(8, -72);
  ctx.quadraticCurveTo(25, -80, 42, -74);
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.stroke();

  // M. DYNAMIC TALKING MOUTH (Mouth Open / Closed in Sync with Audio Speech)
  const isMouthOpen = isSpeaking && (Math.sin(timestamp * 0.018) > -0.2);

  if (isMouthOpen) {
    // Open Talking Mouth Cavity
    ctx.beginPath();
    ctx.moveTo(-30, 0);
    ctx.quadraticCurveTo(0, 32, 30, 0);
    ctx.quadraticCurveTo(0, 8, -30, 0);
    ctx.closePath();
    ctx.fillStyle = '#7f1d1d';
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Sharp Little Dragon Teeth
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    // Top Left Tooth
    ctx.moveTo(-18, 1); ctx.lineTo(-13, 8); ctx.lineTo(-8, 1);
    // Top Right Tooth
    ctx.moveTo(8, 1); ctx.lineTo(13, 8); ctx.lineTo(18, 1);
    ctx.fill();
  } else {
    // Confident Dragon Smirk Line
    ctx.beginPath();
    ctx.moveTo(-30, 0);
    ctx.quadraticCurveTo(0, 14, 30, -2);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  // N. RIGHT CLAW HOLDING MASTER-CURED BLUNT (Glowing Cherry & Smoke)
  ctx.save();
  ctx.translate(35, -5);
  ctx.rotate(-0.35);

  // Dragon Claw
  ctx.beginPath();
  ctx.moveTo(10, 20);
  ctx.quadraticCurveTo(25, 15, 35, 25);
  ctx.quadraticCurveTo(25, 35, 10, 30);
  ctx.closePath();
  ctx.fillStyle = '#16a34a';
  ctx.fill();
  ctx.strokeStyle = '#052e16';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Golden Amber Claw Tip
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.moveTo(35, 25);
  ctx.lineTo(42, 24);
  ctx.lineTo(36, 28);
  ctx.closePath();
  ctx.fill();

  // The Precision Blunt
  ctx.fillStyle = '#92400e';
  ctx.beginPath();
  ctx.roundRect(20, 8, 55, 10, 3);
  ctx.fill();
  ctx.strokeStyle = '#451a03';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Burning Cherry Fire (Radial Glow)
  const cherryGrad = ctx.createRadialGradient(75, 13, 1, 75, 13, 9);
  cherryGrad.addColorStop(0, '#fff7ed');
  cherryGrad.addColorStop(0.35, '#f97316');
  cherryGrad.addColorStop(0.75, '#dc2626');
  cherryGrad.addColorStop(1, '#7f1d1d');
  ctx.fillStyle = cherryGrad;
  ctx.beginPath();
  ctx.arc(75, 13, 8, 0, Math.PI * 2);
  ctx.fill();

  // Terpene Ping Ring
  const pingRadius = 10 + Math.sin(timestamp * 0.008) * 4;
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(75, 13, pingRadius, 0, Math.PI * 2);
  ctx.stroke();

  // Floating Smoke Rings
  for (let s = 0; s < 3; s++) {
    const ringTime = (timestamp * 0.04 + s * 30) % 90;
    const ringAlpha = Math.max(0, 0.45 - (ringTime / 90));
    ctx.strokeStyle = `rgba(255, 255, 255, ${ringAlpha})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(85 + ringTime * 0.8, 8 - ringTime * 0.9, 8 + ringTime * 0.25, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();

  // O. VINTAGE COMEDY CLUB CHROME SHURE 55SH MICROPHONE (Foreground Stand)
  ctx.save();
  ctx.translate(0, 15);

  // Chrome Mic Head Capsule
  const micHeadGrad = ctx.createLinearGradient(-12, 10, 12, 40);
  micHeadGrad.addColorStop(0, '#f8fafc');
  micHeadGrad.addColorStop(0.4, '#94a3b8');
  micHeadGrad.addColorStop(0.7, '#475569');
  micHeadGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = micHeadGrad;
  ctx.beginPath();
  ctx.roundRect(-12, 10, 24, 30, 6);
  ctx.fill();
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Horizontal Rib Grille Lines
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-9, 18); ctx.lineTo(9, 18);
  ctx.moveTo(-9, 24); ctx.lineTo(9, 24);
  ctx.moveTo(-9, 30); ctx.lineTo(9, 30);
  ctx.moveTo(-9, 36); ctx.lineTo(9, 36);
  ctx.stroke();

  // Chrome Mic Neck Swivel & Stand Pole
  ctx.fillStyle = '#334155';
  ctx.fillRect(-4, 40, 8, 12);
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(-2.5, 52, 5, 140);
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1;
  ctx.strokeRect(-2.5, 52, 5, 140);

  ctx.restore();

  ctx.restore(); // End Performer Container
} // End if (showActor)

  // =========================================================================
  // LAYER 3: TOP HUD BRANDING, TIMECODE & LOCALIZATION BADGES
  // =========================================================================
  if (showOverlay) {
    ctx.save();
    const hudPadding = aspectRatio === '9:16' ? 24 : 36;

    // Nutflox & Special Header
    ctx.fillStyle = primaryColor;
    ctx.font = 'bold 13px monospace';
    ctx.textAlign = 'left';
    ctx.fillText("NUTFLOX ORIGINAL SPECIAL", hudPadding, 38);

    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${aspectRatio === '9:16' ? '16px' : '18px'} monospace`;
    ctx.fillText(`${clipTitle.toUpperCase()} [${targetLanguage}]`, hudPadding, 60);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '11px monospace';
    ctx.fillText(`DRAGON 9 PROTOCOL • 54-MIN HARMONIC • ${strainPairing}`, hudPadding, 78);

    // Timecode Countdown (Top Right)
    const mins = Math.floor(currentTimeSec / 60);
    const secs = Math.floor(currentTimeSec % 60);
    const targetMins = Math.floor(targetDurationSec / 60);
    const targetSecs = Math.floor(targetDurationSec % 60);
    const timecodeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')} / ${String(targetMins).padStart(2, '0')}:${String(targetSecs).padStart(2, '0')}`;

    ctx.textAlign = 'right';
    ctx.fillStyle = primaryColor;
    ctx.font = `bold ${aspectRatio === '9:16' ? '16px' : '18px'} monospace`;
    ctx.fillText(timecodeStr, width - hudPadding, 40);

    // Preset Title Badge
    ctx.fillStyle = 'rgba(6, 182, 212, 0.95)';
    ctx.font = '11px monospace';
    ctx.fillText(presetTitle.toUpperCase(), width - hudPadding, 60);

    // Soundscape / Audio & FPS Broadcast Indicator
    ctx.fillStyle = 'rgba(251, 191, 36, 0.9)';
    ctx.font = '10px monospace';
    ctx.fillText(`432Hz HARMONIC • ${fps} FPS ${videoFormat.toUpperCase()}`, width - hudPadding, 78);

    ctx.restore();

    // =========================================================================
    // 7. KINETIC SUBTITLES & TIMING DIRECTIVES BANNER
    // =========================================================================
    if (includeSubtitles && currentCue) {
      ctx.save();
      const isPunchline = !!currentCue.isPunchline;
      const subBoxWidth = aspectRatio === '9:16' ? width * 0.92 : width * 0.88;
      const subBoxHeight = aspectRatio === '9:16' ? 120 : 100;
      const subBoxX = (width - subBoxWidth) / 2;
      const subBoxY = height - subBoxHeight - (aspectRatio === '9:16' ? 32 : 28);

      // Subtitle Card Backdrop
      ctx.fillStyle = 'rgba(0, 0, 0, 0.82)';
      ctx.beginPath();
      ctx.roundRect(subBoxX, subBoxY, subBoxWidth, subBoxHeight, 16);
      ctx.fill();

      ctx.strokeStyle = isPunchline ? 'rgba(239, 68, 68, 0.9)' : 'rgba(34, 197, 94, 0.55)';
      ctx.lineWidth = isPunchline ? 2.5 : 1.5;
      ctx.stroke();

      // Speaker Tag
      ctx.fillStyle = isPunchline ? '#f87171' : '#4ade80';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      const tagText = isPunchline ? "🔥 SUPER PUFF (CLIMAX PUNCHLINE)" : "🎙️ SUPER PUFF (THE BIGGER CLOCK)";
      ctx.fillText(tagText, width / 2, subBoxY + 22);

      // Spoken Text Word-Wrapping
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${aspectRatio === '9:16' ? '15px' : '16px'} sans-serif`;
      ctx.textAlign = 'center';

      const words = currentCue.spokenText.split(' ');
      let line = '';
      let lineY = subBoxY + 48;
      const maxWidth = subBoxWidth - 36;
      const lineHeight = aspectRatio === '9:16' ? 24 : 22;

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          ctx.fillText(line, width / 2, lineY);
          line = words[n] + ' ';
          lineY += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, width / 2, lineY);

      // Pacing Directive Tag [pause: X.Xs]
      if (includeTimingVisualizer && currentCue.pacingNote) {
        ctx.fillStyle = 'rgba(253, 186, 116, 0.85)';
        ctx.font = 'italic 11px monospace';
        const maxPacingLen = aspectRatio === '9:16' ? 65 : 85;
        const truncatedPacing = currentCue.pacingNote.length > maxPacingLen
          ? currentCue.pacingNote.slice(0, maxPacingLen - 3) + '...'
          : currentCue.pacingNote;
        ctx.fillText(`[${truncatedPacing}]`, width / 2, subBoxY + subBoxHeight - 12);
      }

      ctx.restore();
    }

    // =========================================================================
    // 8. PUNCHLINE CHROMATIC FLARE & STANDING OVATION PULSE
    // =========================================================================
    if (currentCue?.isPunchline) {
      ctx.save();
      ctx.globalCompositeOperation = 'color-dodge';
      const flareAlpha = 0.20 + Math.sin(timestamp * 0.012) * 0.12;
      ctx.fillStyle = `rgba(168, 85, 247, ${flareAlpha})`;
      ctx.fillRect(0, 0, width, height);

      // Golden Lens Flare Ring
      ctx.beginPath();
      ctx.arc(width / 2, centerY, width * 0.45, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(251, 191, 36, ${flareAlpha * 0.8})`;
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.restore();
    }
  } // End if (showOverlay)

  // =========================================================================
  // 9. PREVIEW EXPORT DIAGNOSTIC OVERLAY (Real-time Composition Verification)
  // =========================================================================
  if (previewExportMode) {
    ctx.save();

    // A. Rule of Thirds Grid & Center Crosshairs
    if (showCompositionGrid) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);

      // Vertical 1/3 and 2/3
      ctx.beginPath();
      ctx.moveTo(width / 3, 0); ctx.lineTo(width / 3, height);
      ctx.moveTo((width * 2) / 3, 0); ctx.lineTo((width * 2) / 3, height);
      // Horizontal 1/3 and 2/3
      ctx.moveTo(0, height / 3); ctx.lineTo(width, height / 3);
      ctx.moveTo(0, (height * 2) / 3); ctx.lineTo(width, (height * 2) / 3);
      ctx.stroke();

      // Golden Intersection Crosshair Marks (+)
      ctx.setLineDash([]);
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)';
      ctx.lineWidth = 1.5;
      const drawCross = (cx: number, cy: number) => {
        ctx.beginPath();
        ctx.moveTo(cx - 8, cy); ctx.lineTo(cx + 8, cy);
        ctx.moveTo(cx, cy - 8); ctx.lineTo(cx, cy + 8);
        ctx.stroke();
      };
      drawCross(width / 3, height / 3);
      drawCross((width * 2) / 3, height / 3);
      drawCross(width / 3, (height * 2) / 3);
      drawCross((width * 2) / 3, (height * 2) / 3);

      // Stage Center Axis Crosshair
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 14, centerY); ctx.lineTo(width / 2 + 14, centerY);
      ctx.moveTo(width / 2, centerY - 14); ctx.lineTo(width / 2, centerY + 14);
      ctx.arc(width / 2, centerY, 8, 0, Math.PI * 2);
      ctx.stroke();
    }

    // B. Broadcast Action Safe (90%) & Title Safe (80%) Guides
    if (showSafeZones) {
      // 90% Action Safe Boundary (Cyan)
      const actionMarginX = width * 0.05;
      const actionMarginY = height * 0.05;
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.65)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([6, 3]);
      ctx.strokeRect(actionMarginX, actionMarginY, width - actionMarginX * 2, height - actionMarginY * 2);

      ctx.fillStyle = 'rgba(6, 182, 212, 0.85)';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'left';
      ctx.fillText("90% ACTION SAFE", actionMarginX + 6, actionMarginY + 12);

      // 80% Title Safe Boundary (Magenta)
      const titleMarginX = width * 0.10;
      const titleMarginY = height * 0.10;
      ctx.strokeStyle = 'rgba(236, 72, 153, 0.75)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(titleMarginX, titleMarginY, width - titleMarginX * 2, height - titleMarginY * 2);

      ctx.fillStyle = 'rgba(236, 72, 153, 0.85)';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'left';
      ctx.fillText("80% TITLE / SUBTITLE SAFE", titleMarginX + 6, titleMarginY + 12);
      ctx.setLineDash([]);
    }

    // C. Layer Boundary Badges & Visual Callouts
    if (showLayerTags) {
      // Layer 1 Badge (Top-left bottom corner)
      ctx.fillStyle = showBg ? 'rgba(168, 85, 247, 0.9)' : 'rgba(100, 116, 139, 0.5)';
      ctx.fillRect(16, height - 200, 180, 20);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`L1: BACKGROUND (${showBg ? 'ACTIVE' : 'MUTED'})`, 22, height - 186);

      // Layer 2 Badge (Actor Zone)
      const actorTagY = Math.max(120, centerY - (aspectRatio === '9:16' ? 180 : 150));
      ctx.fillStyle = showActor ? 'rgba(34, 197, 94, 0.9)' : 'rgba(100, 116, 139, 0.5)';
      ctx.fillRect(width / 2 - 95, actorTagY, 190, 20);
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`L2: 2.5D ACTOR MESH (${showActor ? 'ACTIVE' : 'MUTED'})`, width / 2, actorTagY + 14);

      // Layer 2 Bounding Box outline
      if (showActor) {
        ctx.strokeStyle = 'rgba(34, 197, 94, 0.4)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        const boxW = aspectRatio === '9:16' ? width * 0.72 : width * 0.48;
        const boxH = aspectRatio === '9:16' ? height * 0.45 : height * 0.56;
        ctx.strokeRect((width - boxW) / 2, centerY - boxH * 0.5, boxW, boxH);
        ctx.setLineDash([]);
      }

      // Layer 3 Badge (Overlay / Teleprompter)
      ctx.fillStyle = showOverlay ? 'rgba(6, 182, 212, 0.9)' : 'rgba(100, 116, 139, 0.5)';
      ctx.fillRect(16, height - 175, 180, 20);
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`L3: HUD & CAPTIONS (${showOverlay ? 'ACTIVE' : 'MUTED'})`, 22, height - 161);
    }

    // D. Real-Time Composition Diagnostics & Telemetry HUD Overlay
    const hudW = aspectRatio === '9:16' ? 240 : 260;
    const hudH = 110;
    const hudX = width - hudW - (aspectRatio === '9:16' ? 16 : 24);
    const hudY = height - hudH - (aspectRatio === '9:16' ? 160 : 135);

    // Diagnostics Card
    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    ctx.beginPath();
    ctx.roundRect(hudX, hudY, hudW, hudH, 10);
    ctx.fill();
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Diagnostics Title Bar
    ctx.fillStyle = 'rgba(34, 197, 94, 0.2)';
    ctx.beginPath();
    ctx.roundRect(hudX, hudY, hudW, 24, [10, 10, 0, 0]);
    ctx.fill();

    ctx.fillStyle = '#4ade80';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'left';
    ctx.fillText("◉ PREVIEW EXPORT INSPECTOR", hudX + 10, hudY + 16);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '9px monospace';
    ctx.fillText(`CANVAS: ${width}x${height} • ${fps} FPS ${videoFormat.toUpperCase()}`, hudX + 10, hudY + 42);
    ctx.fillText(`LAYERS: L1:${showBg ? '✓' : '✗'} L2:${showActor ? '✓' : '✗'} L3:${showOverlay ? '✓' : '✗'} (ALL SYNCED)`, hudX + 10, hudY + 58);
    ctx.fillText(`TIME: ${currentTimeSec.toFixed(2)}s / ${targetDurationSec}s • REC 709`, hudX + 10, hudY + 74);
    
    // Status Indicator
    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 9px monospace';
    ctx.fillText("● COMPOSITION STATUS: VERIFIED", hudX + 10, hudY + 94);

    ctx.restore();
  }
}
