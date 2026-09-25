import React, { useEffect, useRef } from 'react';
import { useScrollStore } from '../../store/useScrollStore';
import { ILLUSTRATION_CONFIG } from '../checkpoints/illustrationConfig';

/**
 * 2.5D Generative Subterranean Tunnel & Cavern Engine
 * 
 * Simulates a continuous forward descent into the Earth's interior:
 * - Concentric rocky cavern slices projected with perspective depth.
 * - Dynamic cavern cross-sections (stalactites, uneven rock walls, fissures).
 * - Interactive torchlight / lantern lighting that casts volumetric glow and responsive parallax.
 * - Depth-projected 3D-to-2D atmospheric particles (floating dust, bioluminescent spores, embers).
 * - Environmental biome palette transitions synchronized to book narrative chapters.
 */

// Per-checkpoint tunnel environmental biome configurations
const BIOME_PALETTES = [
  {
    // 0: Library / The Awakening (Sepia, ancient parchment, dim study lamp)
    tunnelFar: '#0e0805',
    tunnelMid: '#1a100a',
    tunnelNear: '#2b1a10',
    rockStroke: 'rgba(92, 60, 36, 0.45)',
    glowColor: 'rgba(255, 190, 110, 0.18)',
    fogColor: '#120a06',
    particleColor: '235, 195, 140',
    particleType: 'dust',
  },
  {
    // 1: The Call of the Stone / Shadows of the Past (Weathered sandstone, old stone)
    tunnelFar: '#0d0907',
    tunnelMid: '#1c130d',
    tunnelNear: '#302117',
    rockStroke: 'rgba(110, 75, 45, 0.5)',
    glowColor: 'rgba(240, 175, 95, 0.2)',
    fogColor: '#160e09',
    particleColor: '220, 180, 130',
    particleType: 'dust',
  },
  {
    // 2: The Threshold / Scartaris Pointing (Glacial basalt, arctic dusk, volcanic ash)
    tunnelFar: '#080d14',
    tunnelMid: '#121d28',
    tunnelNear: '#1e3042',
    rockStroke: 'rgba(75, 110, 145, 0.45)',
    glowColor: 'rgba(140, 195, 245, 0.22)',
    fogColor: '#0c141d',
    particleColor: '175, 215, 255',
    particleType: 'frost',
  },
  {
    // 3: The Whispering Walls / Whispering Gallery (Deep granite chasm, acoustic darkness)
    tunnelFar: '#050406',
    tunnelMid: '#0e0b12',
    tunnelNear: '#18131f',
    rockStroke: 'rgba(115, 95, 145, 0.4)',
    glowColor: 'rgba(175, 140, 230, 0.16)',
    fogColor: '#070508',
    particleColor: '190, 170, 240',
    particleType: 'crystal',
  },
  {
    // 4: The Sea of Mushrooms / Subterranean Flora (Bioluminescent fungi, eerie emerald/teal)
    tunnelFar: '#03100e',
    tunnelMid: '#06211d',
    tunnelNear: '#0c3832',
    rockStroke: 'rgba(40, 175, 140, 0.55)',
    glowColor: 'rgba(50, 240, 185, 0.25)',
    fogColor: '#041411',
    particleColor: '80, 250, 195',
    particleType: 'spores',
  },
  {
    // 5: The Living Museum / Lidenbrock Sea (Vast marine horizon, phosphorescent ocean)
    tunnelFar: '#020914',
    tunnelMid: '#05162c',
    tunnelNear: '#0a274c',
    rockStroke: 'rgba(45, 130, 215, 0.5)',
    glowColor: 'rgba(70, 170, 255, 0.26)',
    fogColor: '#030d1c',
    particleColor: '120, 205, 255',
    particleType: 'marine',
  },
  {
    // 6: The Earth's Revenge / Leviathan Duel (Violent stormy undertow, churning abyss)
    tunnelFar: '#0b050c',
    tunnelMid: '#1a0d1e',
    tunnelNear: '#2d1434',
    rockStroke: 'rgba(170, 60, 160, 0.5)',
    glowColor: 'rgba(215, 80, 200, 0.22)',
    fogColor: '#0e0710',
    particleColor: '235, 120, 220',
    particleType: 'surge',
  },
  {
    // 7: The Violent Return / Stromboli Eruption (Magma surge, molten rock, blinding heat)
    tunnelFar: '#180401',
    tunnelMid: '#340a02',
    tunnelNear: '#521204',
    rockStroke: 'rgba(255, 100, 30, 0.65)',
    glowColor: 'rgba(255, 135, 40, 0.32)',
    fogColor: '#220602',
    particleColor: '255, 150, 50',
    particleType: 'embers',
  },
  {
    // 8: Epilogue / Return to the Sun (Mediterranean sunlight breaking through)
    tunnelFar: '#0a1622',
    tunnelMid: '#162e45',
    tunnelNear: '#284f74',
    rockStroke: 'rgba(100, 175, 230, 0.5)',
    glowColor: 'rgba(240, 220, 170, 0.28)',
    fogColor: '#0e1d2c',
    particleColor: '255, 235, 185',
    particleType: 'sunlight',
  },
];

// Helper: interpolate between two hex or rgba colors
function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  if (clean.length === 3) {
    return [
      parseInt(clean[0] + clean[0], 16),
      parseInt(clean[1] + clean[1], 16),
      parseInt(clean[2] + clean[2], 16),
    ];
  }
  return [
    parseInt(clean.substring(0, 2), 16),
    parseInt(clean.substring(2, 4), 16),
    parseInt(clean.substring(4, 6), 16),
  ];
}

function lerpColor(hexA, hexB, t) {
  const [r1, g1, b1] = hexToRgb(hexA);
  const [r2, g2, b2] = hexToRgb(hexB);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

export function TunnelCavern2D() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 400,
    tx: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    ty: typeof window !== 'undefined' ? window.innerHeight / 2 : 400,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
    if (!ctx) return;

    let animId;
    let isVisible = true;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize, { passive: true });

    const handleMouseMove = (e) => {
      mouseRef.current.tx = e.clientX;
      mouseRef.current.ty = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible && !animId) {
        animId = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 3D Depth Particles (Z goes from 0.05 to 1.0)
    const PARTICLE_COUNT = 90;
    const particles = Array.from({ length: PARTICLE_COUNT }).map(() => ({
      x: (Math.random() - 0.5) * 2.2, // normalized coordinates around center
      y: (Math.random() - 0.5) * 2.2,
      z: Math.random() * 0.95 + 0.05, // 0.05 (near) to 1.0 (far)
      speed: 0.0015 + Math.random() * 0.0025,
      size: 1.2 + Math.random() * 2.2,
      phase: Math.random() * Math.PI * 2,
    }));

    // Pre-calculated rock angle seeds for organic, rugged cave contours (32 radial segments)
    const RADIAL_SEGMENTS = 32;
    const angleStep = (Math.PI * 2) / RADIAL_SEGMENTS;
    const contourSeeds = Array.from({ length: RADIAL_SEGMENTS }).map((_, i) => ({
      freq1: Math.sin(i * 1.3) * 0.22,
      freq2: Math.cos(i * 2.7) * 0.15,
      freq3: Math.sin(i * 4.1 + 0.8) * 0.1,
    }));

    // Ancient Runic Markers pinned to tunnel depths
    const runeGlyphs = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛈ', 'ᛇ', 'ᛉ', 'ᛊ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛟ', 'ᛞ'];
    const runes = Array.from({ length: 18 }).map((_, i) => ({
      char: runeGlyphs[i % runeGlyphs.length],
      angle: (i / 18) * Math.PI * 2 + (i % 3) * 0.2,
      zOffset: (i * 0.14) % 1.0,
      size: 16 + (i % 3) * 6,
    }));

    // Tunnel Rings configuration (number of concentric depth strata)
    const RING_COUNT = 9;

    let time = 0;
    let prevProgress = 0;

    // Render loop
    const render = () => {
      if (!isVisible) {
        animId = null;
        return;
      }

      time += 0.014;

      // Smooth lantern cursor interpolation
      const mouse = mouseRef.current;
      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;
      const mx = mouse.x;
      const my = mouse.y;

      const { scrollProgress, currentCheckpoint } = useScrollStore.getState();
      const cpId = currentCheckpoint?.id ?? 0;
      const currentBiome = BIOME_PALETTES[cpId] || BIOME_PALETTES[0];
      const nextBiome = BIOME_PALETTES[Math.min(cpId + 1, BIOME_PALETTES.length - 1)];

      // Calculate smooth blend factor between consecutive checkpoints
      const range = (currentCheckpoint?.scrollEnd ?? 0.1) - (currentCheckpoint?.scrollStart ?? 0);
      const cpProgress = range > 0
        ? Math.max(0, Math.min(1, (scrollProgress - (currentCheckpoint?.scrollStart ?? 0)) / range))
        : 0;

      // Dynamic Vanishing Point (influenced gently by cursor to create head-tracking parallax)
      const lookOffsetX = (mx - width / 2) * 0.22;
      const lookOffsetY = (my - height / 2) * 0.22;
      const vx = width / 2 + lookOffsetX;
      const vy = height / 2 + lookOffsetY;

      // Scroll speed estimate for forward thrust effect
      const scrollDelta = Math.abs(scrollProgress - prevProgress);
      prevProgress = scrollProgress;
      const thrust = Math.min(scrollDelta * 18, 0.04);

      // 1. HORIZON / DEEP CAVERN BACKGROUND
      const blendedFar = lerpColor(currentBiome.tunnelFar, nextBiome.tunnelFar, cpProgress);
      const blendedNear = lerpColor(currentBiome.tunnelNear, nextBiome.tunnelNear, cpProgress);
      const blendedFog = lerpColor(currentBiome.fogColor, nextBiome.fogColor, cpProgress);

      const bgGrad = ctx.createRadialGradient(vx, vy, 10, vx, vy, Math.max(width, height) * 0.85);
      bgGrad.addColorStop(0, blendedFar);
      bgGrad.addColorStop(0.55, blendedFog);
      bgGrad.addColorStop(1, '#020203');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. 2.5D CONCENTRIC CAVERN TUNNEL RINGS (Back to Front)
      // Rings travel forward as scrollProgress increases
      const baseRadius = Math.min(width, height) * 0.72;

      for (let r = 0; r < RING_COUNT; r++) {
        // Continuous depth parameter: (0 is horizon/far, 1 is rushing past camera)
        // Combine ring index with continuous scroll-derived forward traversal
        const ringZOffset = (r / RING_COUNT + (scrollProgress * 4.5)) % 1.0;
        
        // Non-linear perspective scaling: 1 / (1 - z) feeling
        const depth = Math.pow(ringZOffset, 2.2);
        if (depth < 0.005) continue;

        const ringRadius = baseRadius * depth;
        const ringAlpha = Math.min(1, Math.max(0, depth * 1.5)) * (1 - Math.pow(ringZOffset, 4));

        // Center shifts slightly with depth to create curving tunnel curvature
        const curveX = vx + Math.sin(time * 0.5 + r * 0.6 + scrollProgress * 6) * (30 * (1 - ringZOffset));
        const curveY = vy + Math.cos(time * 0.4 + r * 0.5 + scrollProgress * 5) * (20 * (1 - ringZOffset));

        ctx.beginPath();
        for (let i = 0; i <= RADIAL_SEGMENTS; i++) {
          const idx = i % RADIAL_SEGMENTS;
          const seed = contourSeeds[idx];
          const angle = i * angleStep;

          // Natural cave irregularities: stalactites hang more from the ceiling (angle ~ -PI/2)
          const isCeiling = Math.sin(angle) < -0.2;
          const stalactiteBoost = isCeiling ? Math.abs(Math.sin(angle)) * 0.18 : 0;
          
          // Organic rock noise synthesis
          const rockDeform = 1 + seed.freq1 + seed.freq2 + seed.freq3 - stalactiteBoost +
            Math.sin(angle * 3 + time * 0.7 + r) * 0.04;

          const rad = ringRadius * rockDeform;
          const px = curveX + Math.cos(angle) * rad;
          const py = curveY + Math.sin(angle) * (rad * 0.85); // slight vertical oval cave cross-section

          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();

        // Stroke the rock strata ring edge
        ctx.strokeStyle = currentBiome.rockStroke;
        ctx.lineWidth = Math.max(1, 1.8 * depth);
        ctx.globalAlpha = ringAlpha * 0.85;
        ctx.stroke();

        // Fill hollow outer cavern shadow (leaving the tunnel center open)
        if (depth > 0.35) {
          ctx.fillStyle = blendedNear;
          ctx.globalAlpha = Math.min(0.28, (depth - 0.35) * 0.45);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      // 3. ANCIENT SAKNUSSEMM RUNIC CARVINGS ON TUNNEL WALLS
      const fontConfigured = '18px "Cinzel Decorative", serif';
      ctx.font = fontConfigured;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let i = 0; i < runes.length; i++) {
        const rune = runes[i];
        // Relative depth of this rune in the moving tunnel
        const runeZ = (rune.zOffset + (scrollProgress * 2.5)) % 1.0;
        if (runeZ < 0.08 || runeZ > 0.92) continue;

        const runeScale = Math.pow(runeZ, 1.8);
        const runeDist = baseRadius * runeScale * 0.95;
        const rx = vx + Math.cos(rune.angle) * runeDist;
        const ry = vy + Math.sin(rune.angle) * (runeDist * 0.85);

        // Distance from adventurer's lantern beam
        const dx = rx - mx;
        const dy = ry - my;
        const distToLantern = Math.sqrt(dx * dx + dy * dy);

        if (distToLantern < 260) {
          const proximity = Math.pow(1 - distToLantern / 260, 1.6);
          ctx.save();
          ctx.translate(rx, ry);
          ctx.rotate(rune.angle + Math.PI / 2);
          ctx.font = `${Math.round(rune.size * runeScale)}px "Cinzel Decorative", serif`;
          ctx.fillStyle = currentBiome.glowColor;
          ctx.globalAlpha = proximity * Math.min(1, runeScale * 2);
          ctx.fillText(rune.char, 0, 0);
          ctx.restore();
        }
      }
      ctx.globalAlpha = 1;

      // 4. 3D-TO-2D PROJECTED PARTICLES (Deep subterranean atmosphere)
      // Moving forward towards camera
      const [pr, pg, pb] = currentBiome.particleColor.split(',').map(s => s.trim());
      const pColorRgb = `rgb(${pr}, ${pg}, ${pb})`;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Particle moves toward the viewer (z decreases)
        // Scroll thrust accelerates speed
        p.z -= p.speed + thrust;

        // Reset particle to far horizon when it passes the camera
        if (p.z <= 0.02) {
          p.z = 0.98 + Math.random() * 0.02;
          p.x = (Math.random() - 0.5) * 2.2;
          p.y = (Math.random() - 0.5) * 2.2;
        }

        // Perspective projection: screen = center + (norm / z)
        const projScale = 1 / p.z;
        const sx = vx + (p.x * width * 0.38) * projScale;
        const sy = vy + (p.y * height * 0.38) * projScale;

        // Clip particles outside screen bounds
        if (sx < -20 || sx > width + 20 || sy < -20 || sy > height + 20) continue;

        // Particle size expands as it approaches camera
        const pSize = Math.max(0.6, p.size * (1 - p.z * 0.6) * Math.min(projScale, 4.5));
        const pAlpha = Math.min(0.85, (1 - p.z) * 0.9);

        // Torchlight proximity glow
        const pdx = sx - mx;
        const pdy = sy - my;
        const pDistSq = pdx * pdx + pdy * pdy;
        const illuminated = pDistSq < 60000;

        ctx.beginPath();
        if (illuminated) {
          const boost = 1 - Math.sqrt(pDistSq) / 245;
          ctx.fillStyle = pColorRgb;
          ctx.globalAlpha = Math.min(1, pAlpha + boost * 0.6);
          ctx.arc(sx, sy, pSize * (1 + boost * 0.4), 0, Math.PI * 2);
          ctx.fill();

          // Soft halo around lit particles
          ctx.beginPath();
          ctx.globalAlpha = boost * 0.22;
          ctx.arc(sx, sy, pSize * 2.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = pColorRgb;
          ctx.globalAlpha = pAlpha * 0.35;
          ctx.arc(sx, sy, pSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      // 5. ADVENTURER'S LANTERN / TORCHLIGHT CONE & VIGNETTE
      // Simulates holding a light source inside the underground chasm
      const lanternRadius = Math.max(width, height) * 0.55;
      const lanternGrad = ctx.createRadialGradient(mx, my, 25, mx, my, lanternRadius);
      lanternGrad.addColorStop(0, 'rgba(255, 235, 190, 0.15)');
      lanternGrad.addColorStop(0.3, 'rgba(0, 0, 0, 0.12)');
      lanternGrad.addColorStop(0.65, 'rgba(0, 0, 0, 0.65)');
      lanternGrad.addColorStop(1, 'rgba(2, 2, 4, 0.95)');

      ctx.fillStyle = lanternGrad;
      ctx.fillRect(0, 0, width, height);

      // 6. ATMOSPHERIC BIOME TINT / ANAMORPHIC ILLUMINATION
      const flareGrad = ctx.createRadialGradient(mx, my, 0, mx, my, 220);
      flareGrad.addColorStop(0, currentBiome.glowColor);
      flareGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = flareGrad;
      ctx.globalCompositeOperation = 'screen';
      ctx.fillRect(mx - 220, my - 220, 440, 440);
      ctx.globalCompositeOperation = 'source-over';

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="tunnel-cavern-canvas"
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ display: 'block', imageRendering: 'auto' }}
    />
  );
}
