import React, { useEffect, useRef, useState } from 'react';
import { useScrollStore } from '../../store/useScrollStore';
import { playRunicWhisperAudio } from '../../hooks/useSyntheticSoundscape';

/**
 * Journey v3: High-Performance 2.5D Volumetric Subterranean Cavern & Tunnel Engine
 * 
 * Performance & Cross-Device Optimizations:
 * - Hardware-accelerated 1/4 bilinear bloom upsampling (0 CPU rasterization penalty).
 * - Batched GPU draw paths: continuous contour rings & batched specular glint primitives.
 * - Full touch event support (touchmove, touchstart) for mobile phones and tablets.
 * - Dynamic Adaptive Quality Tiering: monitors frame delta and automatically scales detail to lock 60 FPS.
 * - Procedural Volumetric Light Shafts (God Rays) radiating from adventurer's lantern.
 * - Real-time Normal-Mapped Rock Strata with diffuse/specular lighting relief.
 * - Interactive Wall Runes with proximity discovery and audio chimes.
 * - Milestone Tectonic Screen Shake on Checkpoint 6 (Leviathan) & Checkpoint 7 (Stromboli).
 */

const BIOME_PALETTES = [
  {
    // 0: Library / The Awakening (Sepia, ancient parchment, warm lamp)
    tunnelFar: '#0e0805',
    tunnelMid: '#1a100a',
    tunnelNear: '#2b1a10',
    rockStroke: 'rgba(92, 60, 36, 0.55)',
    glowColor: 'rgba(255, 190, 110, 0.28)',
    bloomColor: 'rgba(255, 210, 140, 0.5)',
    fogColor: '#120a06',
    particleColor: '235, 195, 140',
    specularIntensity: 0.25,
  },
  {
    // 1: The Call of the Stone / Shadows of the Past (Weathered sandstone, old stone)
    tunnelFar: '#0d0907',
    tunnelMid: '#1c130d',
    tunnelNear: '#302117',
    rockStroke: 'rgba(110, 75, 45, 0.6)',
    glowColor: 'rgba(240, 175, 95, 0.3)',
    bloomColor: 'rgba(245, 190, 120, 0.55)',
    fogColor: '#160e09',
    particleColor: '220, 180, 130',
    specularIntensity: 0.3,
  },
  {
    // 2: The Threshold / Scartaris Pointing (Glacial basalt, arctic dusk, volcanic ash)
    tunnelFar: '#080d14',
    tunnelMid: '#121d28',
    tunnelNear: '#1e3042',
    rockStroke: 'rgba(75, 110, 145, 0.55)',
    glowColor: 'rgba(140, 195, 245, 0.32)',
    bloomColor: 'rgba(160, 215, 255, 0.6)',
    fogColor: '#0c141d',
    particleColor: '175, 215, 255',
    specularIntensity: 0.55,
  },
  {
    // 3: The Whispering Walls / Whispering Gallery (Deep granite chasm, acoustic darkness)
    tunnelFar: '#050406',
    tunnelMid: '#0e0b12',
    tunnelNear: '#18131f',
    rockStroke: 'rgba(115, 95, 145, 0.5)',
    glowColor: 'rgba(175, 140, 230, 0.28)',
    bloomColor: 'rgba(195, 160, 245, 0.55)',
    fogColor: '#070508',
    particleColor: '190, 170, 240',
    specularIntensity: 0.45,
  },
  {
    // 4: The Sea of Mushrooms / Subterranean Flora (Bioluminescent fungi, eerie emerald/teal)
    tunnelFar: '#03100e',
    tunnelMid: '#06211d',
    tunnelNear: '#0c3832',
    rockStroke: 'rgba(40, 175, 140, 0.65)',
    glowColor: 'rgba(50, 240, 185, 0.38)',
    bloomColor: 'rgba(70, 255, 205, 0.7)',
    fogColor: '#041411',
    particleColor: '80, 250, 195',
    specularIntensity: 0.7,
  },
  {
    // 5: The Living Museum / Lidenbrock Sea (Vast marine horizon, phosphorescent ocean)
    tunnelFar: '#020914',
    tunnelMid: '#05162c',
    tunnelNear: '#0a274c',
    rockStroke: 'rgba(45, 130, 215, 0.6)',
    glowColor: 'rgba(70, 170, 255, 0.36)',
    bloomColor: 'rgba(95, 190, 255, 0.65)',
    fogColor: '#030d1c',
    particleColor: '120, 205, 255',
    specularIntensity: 0.85,
  },
  {
    // 6: The Earth's Revenge / Leviathan Duel (Violent stormy undertow, churning abyss)
    tunnelFar: '#0b050c',
    tunnelMid: '#1a0d1e',
    tunnelNear: '#2d1434',
    rockStroke: 'rgba(170, 60, 160, 0.6)',
    glowColor: 'rgba(215, 80, 200, 0.35)',
    bloomColor: 'rgba(235, 110, 225, 0.65)',
    fogColor: '#0e0710',
    particleColor: '235, 120, 220',
    specularIntensity: 0.6,
  },
  {
    // 7: The Violent Return / Stromboli Eruption (Magma surge, molten rock, blinding heat)
    tunnelFar: '#180401',
    tunnelMid: '#340a02',
    tunnelNear: '#521204',
    rockStroke: 'rgba(255, 100, 30, 0.75)',
    glowColor: 'rgba(255, 135, 40, 0.45)',
    bloomColor: 'rgba(255, 165, 60, 0.8)',
    fogColor: '#220602',
    particleColor: '255, 150, 50',
    specularIntensity: 0.75,
  },
  {
    // 8: Epilogue / Return to the Sun (Mediterranean sunlight breaking through)
    tunnelFar: '#0a1622',
    tunnelMid: '#162e45',
    tunnelNear: '#284f74',
    rockStroke: 'rgba(100, 175, 230, 0.6)',
    glowColor: 'rgba(240, 220, 170, 0.38)',
    bloomColor: 'rgba(255, 240, 190, 0.7)',
    fogColor: '#0e1d2c',
    particleColor: '255, 235, 185',
    specularIntensity: 0.4,
  },
];

const RUNIC_WHISPERS = [
  "Saknussemm's Mark: 'Descend, bold traveler, into the crater of Snæfells...'",
  "Saknussemm's Mark: 'The stone is listening; every descent begins with silence.'",
  "Saknussemm's Mark: 'When the shadow of Scartaris caresses the basalt, the gate unlocks.'",
  "Saknussemm's Mark: 'In the hollowed veins of granite, fear amplifies into legend.'",
  "Saknussemm's Mark: 'A sunless sea cradled beneath a continent of living rock.'",
  "Saknussemm's Mark: 'The central fire shall exhume what the earth consumed.'",
];

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
  const [activeWhisper, setActiveWhisper] = useState(null);
  const whisperTimerRef = useRef(null);

  const mouseRef = useRef({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 400,
    tx: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    ty: typeof window !== 'undefined' ? window.innerHeight / 2 : 400,
    vx: 0,
    vy: 0,
    isHoveringRune: false,
    hoveredRuneIdx: -1,
  });

  const activeRunePositionsRef = useRef([]);

  const triggerRunicWhisper = (runeIndex) => {
    playRunicWhisperAudio();
    const whisper = RUNIC_WHISPERS[runeIndex % RUNIC_WHISPERS.length];
    setActiveWhisper(whisper);

    clearTimeout(whisperTimerRef.current);
    whisperTimerRef.current = setTimeout(() => {
      setActiveWhisper(null);
    }, 4500);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
    if (!ctx) return;

    // Fast 1/4 scale Bloom Buffer (hardware bilinear blur with zero CPU overhead)
    const bloomCanvas = document.createElement('canvas');
    const bloomCtx = bloomCanvas.getContext('2d');

    let animId;
    let isVisible = true;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const updateDimensions = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      // 1/4 resolution for bloom buffer: blurs naturally when upscaled
      bloomCanvas.width = Math.max(1, Math.floor(width / 4));
      bloomCanvas.height = Math.max(1, Math.floor(height / 4));
      if (bloomCtx) {
        bloomCtx.imageSmoothingEnabled = true;
      }
    };
    updateDimensions();

    const handleResize = () => {
      updateDimensions();
    };
    window.addEventListener('resize', handleResize, { passive: true });

    let lastMouseX = width / 2;
    let lastMouseY = height / 2;

    const updatePointer = (clientX, clientY) => {
      mouseRef.current.tx = clientX;
      mouseRef.current.ty = clientY;
      mouseRef.current.vx = clientX - lastMouseX;
      mouseRef.current.vy = clientY - lastMouseY;
      lastMouseX = clientX;
      lastMouseY = clientY;

      // Check proximity to interactive wall runes
      let hovered = -1;
      for (let i = 0; i < activeRunePositionsRef.current.length; i++) {
        const item = activeRunePositionsRef.current[i];
        const dx = item.x - clientX;
        const dy = item.y - clientY;
        if (dx * dx + dy * dy < 3200) {
          hovered = item.index;
          break;
        }
      }

      mouseRef.current.isHoveringRune = hovered !== -1;
      mouseRef.current.hoveredRuneIdx = hovered;
    };

    const handleMouseMove = (e) => {
      updatePointer(e.clientX, e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        updatePointer(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchMove, { passive: true });

    const handleClick = (e) => {
      const mx = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : mouseRef.current.x);
      const my = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : mouseRef.current.y);

      for (let i = 0; i < activeRunePositionsRef.current.length; i++) {
        const item = activeRunePositionsRef.current[i];
        const dx = item.x - mx;
        const dy = item.y - my;
        if (dx * dx + dy * dy < 4200) {
          triggerRunicWhisper(item.index);
          break;
        }
      }
    };
    window.addEventListener('click', handleClick);

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible && !animId) {
        animId = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Dynamic Adaptive Performance Guardrail
    let isLowPowerDevice = false;
    let slowFrameStreak = 0;
    let lastTime = performance.now();

    // 3D Depth Particles
    const PARTICLE_COUNT = 96;
    const particles = Array.from({ length: PARTICLE_COUNT }).map(() => ({
      x: (Math.random() - 0.5) * 2.3,
      y: (Math.random() - 0.5) * 2.3,
      z: Math.random() * 0.95 + 0.05,
      speed: 0.0014 + Math.random() * 0.0028,
      size: 1.2 + Math.random() * 2.4,
      phase: Math.random() * Math.PI * 2,
    }));

    // Radial contours with normal calculation points
    const RADIAL_SEGMENTS = 36;
    const angleStep = (Math.PI * 2) / RADIAL_SEGMENTS;
    const contourSeeds = Array.from({ length: RADIAL_SEGMENTS }).map((_, i) => ({
      freq1: Math.sin(i * 1.3) * 0.22,
      freq2: Math.cos(i * 2.7) * 0.16,
      freq3: Math.sin(i * 4.1 + 0.8) * 0.11,
      roughness: Math.sin(i * 7.9) * 0.05,
    }));

    // Ancient Runic Markers pinned to tunnel depths
    const runeGlyphs = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛈ', 'ᛇ', 'ᛉ', 'ᛊ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛟ', 'ᛞ'];
    const runes = Array.from({ length: 18 }).map((_, i) => ({
      char: runeGlyphs[i % runeGlyphs.length],
      angle: (i / 18) * Math.PI * 2 + (i % 3) * 0.2,
      zOffset: (i * 0.14) % 1.0,
      size: 19 + (i % 3) * 5,
      idx: i,
    }));

    // Volumetric Light Ray Beams
    const RAY_COUNT = 7;
    const rays = Array.from({ length: RAY_COUNT }).map((_, i) => ({
      angleOffset: (i / RAY_COUNT) * Math.PI * 2,
      speed: 0.07 + (i % 3) * 0.035,
      width: 0.18 + Math.random() * 0.12,
    }));

    let time = 0;
    let prevProgress = 0;

    // Main Render Loop
    const render = () => {
      if (!isVisible) {
        animId = null;
        return;
      }

      const now = performance.now();
      const delta = now - lastTime;
      lastTime = now;

      // Adaptive Performance Monitor: if frames drop below 40fps consistently, enable low-power mode
      if (delta > 25) {
        slowFrameStreak++;
        if (slowFrameStreak > 60 && !isLowPowerDevice) {
          isLowPowerDevice = true;
        }
      } else {
        slowFrameStreak = Math.max(0, slowFrameStreak - 1);
      }

      time += 0.015;

      const mouse = mouseRef.current;
      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;
      const mx = mouse.x;
      const my = mouse.y;

      const { scrollProgress, currentCheckpoint } = useScrollStore.getState();
      const cpId = currentCheckpoint?.id ?? 0;
      const currentBiome = BIOME_PALETTES[cpId] || BIOME_PALETTES[0];
      const nextBiome = BIOME_PALETTES[Math.min(cpId + 1, BIOME_PALETTES.length - 1)];

      const range = (currentCheckpoint?.scrollEnd ?? 0.1) - (currentCheckpoint?.scrollStart ?? 0);
      const cpProgress = range > 0
        ? Math.max(0, Math.min(1, (scrollProgress - (currentCheckpoint?.scrollStart ?? 0)) / range))
        : 0;

      // ── CAMERA JITTER / TECTONIC SHAKE ON MILESTONES ──
      let shakeX = 0;
      let shakeY = 0;
      if (cpId === 6) {
        const tremorAmp = 3.2 * (0.5 + 0.5 * Math.sin(time * 3.5));
        shakeX = (Math.random() - 0.5) * tremorAmp;
        shakeY = (Math.random() - 0.5) * tremorAmp;
      } else if (cpId === 7) {
        const tremorAmp = 5.8 * (0.6 + 0.4 * Math.sin(time * 5.2));
        shakeX = (Math.random() - 0.5) * tremorAmp;
        shakeY = (Math.random() - 0.5) * tremorAmp;
      }

      ctx.save();
      if (shakeX !== 0 || shakeY !== 0) {
        ctx.translate(shakeX, shakeY);
      }

      // Dynamic Vanishing Point with parallax tilt
      const lookOffsetX = (mx - width / 2) * 0.22;
      const lookOffsetY = (my - height / 2) * 0.22;
      const vx = width / 2 + lookOffsetX;
      const vy = height / 2 + lookOffsetY;

      const scrollDelta = Math.abs(scrollProgress - prevProgress);
      prevProgress = scrollProgress;
      const thrust = Math.min(scrollDelta * 20, 0.045);

      // Clear bloom canvas if not in low-power mode
      const useBloom = !isLowPowerDevice && bloomCtx;
      if (useBloom) {
        bloomCtx.clearRect(0, 0, bloomCanvas.width, bloomCanvas.height);
      }

      // 1. DEEP CAVERN HORIZON BACKGROUND
      const blendedFar = lerpColor(currentBiome.tunnelFar, nextBiome.tunnelFar, cpProgress);
      const blendedNear = lerpColor(currentBiome.tunnelNear, nextBiome.tunnelNear, cpProgress);
      const blendedFog = lerpColor(currentBiome.fogColor, nextBiome.fogColor, cpProgress);

      const bgGrad = ctx.createRadialGradient(vx, vy, 15, vx, vy, Math.max(width, height) * 0.88);
      bgGrad.addColorStop(0, blendedFar);
      bgGrad.addColorStop(0.5, blendedFog);
      bgGrad.addColorStop(1, '#020102');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. NORMAL-MAPPED CONCENTRIC CAVERN TUNNEL RINGS
      const baseRadius = Math.min(width, height) * 0.74;
      const ringCount = isLowPowerDevice ? 7 : 9;

      // Batched arrays for high-performance single-pass drawing
      const specularPoints = [];
      const litSegmentPaths = [];

      for (let r = 0; r < ringCount; r++) {
        const ringZOffset = (r / ringCount + (scrollProgress * 4.8)) % 1.0;
        const depth = Math.pow(ringZOffset, 2.1);
        if (depth < 0.005) continue;

        const ringRadius = baseRadius * depth;
        const ringAlpha = Math.min(1, Math.max(0, depth * 1.6)) * (1 - Math.pow(ringZOffset, 4.2));

        const curveX = vx + Math.sin(time * 0.45 + r * 0.55 + scrollProgress * 6) * (32 * (1 - ringZOffset));
        const curveY = vy + Math.cos(time * 0.38 + r * 0.48 + scrollProgress * 5) * (22 * (1 - ringZOffset));

        const points = [];

        for (let i = 0; i <= RADIAL_SEGMENTS; i++) {
          const idx = i % RADIAL_SEGMENTS;
          const seed = contourSeeds[idx];
          const angle = i * angleStep;

          const isCeiling = Math.sin(angle) < -0.2;
          const stalactiteBoost = isCeiling ? Math.abs(Math.sin(angle)) * 0.2 : 0;
          
          const rockDeform = 1 + seed.freq1 + seed.freq2 + seed.freq3 + seed.roughness - stalactiteBoost +
            Math.sin(angle * 3.5 + time * 0.65 + r) * 0.035;

          const rad = ringRadius * rockDeform;
          const px = curveX + Math.cos(angle) * rad;
          const py = curveY + Math.sin(angle) * (rad * 0.86);

          points.push({ x: px, y: py });
        }

        // BATCHED CONTROLLER 1: Base ring contour in ONE continuous path
        ctx.beginPath();
        for (let i = 0; i < points.length; i++) {
          if (i === 0) ctx.moveTo(points[i].x, points[i].y);
          else ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.closePath();

        // Stroke base contour
        ctx.strokeStyle = currentBiome.rockStroke;
        ctx.lineWidth = Math.max(1.1, 1.8 * depth);
        ctx.globalAlpha = ringAlpha * 0.7;
        ctx.stroke();

        // Fill rock strata band depth
        if (depth > 0.32) {
          ctx.fillStyle = blendedNear;
          ctx.globalAlpha = Math.min(0.28, (depth - 0.32) * 0.45);
          ctx.fill();
        }

        // BATCHED CONTROLLER 2: Collect lit highlights & specular facets
        for (let i = 0; i < points.length - 1; i++) {
          const p1 = points[i];
          const p2 = points[i + 1];

          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const segLen = Math.sqrt(dx * dx + dy * dy);
          if (segLen === 0) continue;

          const nx = -dy / segLen;
          const ny = dx / segLen;

          const midX = (p1.x + p2.x) * 0.5;
          const midY = (p1.y + p2.y) * 0.5;
          const lx = mx - midX;
          const ly = my - midY;
          const lDist = Math.sqrt(lx * lx + ly * ly);
          const lNormX = lDist > 0.001 ? lx / lDist : 0;
          const lNormY = lDist > 0.001 ? ly / lDist : 0;

          const nDotL = Math.max(0, nx * lNormX + ny * lNormY);
          const attenuation = Math.max(0, 1 - lDist / (Math.max(width, height) * 0.85));

          if (nDotL * attenuation > 0.18) {
            litSegmentPaths.push({
              p1,
              p2,
              alpha: Math.min(1, ringAlpha * (nDotL * attenuation * 1.2)),
              width: Math.max(1.5, 2.8 * depth),
            });
          }

          // Specular glint calculation
          if (depth > 0.25) {
            const hx = lNormX;
            const hy = lNormY - 0.2;
            const hLen = Math.sqrt(hx * hx + hy * hy);
            const nDotH = hLen > 0.001 ? Math.max(0, (nx * hx + ny * hy) / hLen) : 0;
            const specular = Math.pow(nDotH, 12) * currentBiome.specularIntensity * attenuation;

            if (specular > 0.3) {
              specularPoints.push({ x: midX, y: midY, size: 1.5 * depth, alpha: Math.min(0.9, specular * ringAlpha) });
            }
          }
        }
      }

      // Draw batched lit segment highlights
      if (litSegmentPaths.length > 0) {
        ctx.beginPath();
        for (let i = 0; i < litSegmentPaths.length; i++) {
          const seg = litSegmentPaths[i];
          ctx.moveTo(seg.p1.x, seg.p1.y);
          ctx.lineTo(seg.p2.x, seg.p2.y);
        }
        ctx.strokeStyle = '#ffffff';
        ctx.globalAlpha = 0.28;
        ctx.lineWidth = 1.6;
        ctx.stroke();
      }

      // Draw batched specular sparkles
      if (specularPoints.length > 0) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        for (let i = 0; i < specularPoints.length; i++) {
          const sp = specularPoints[i];
          ctx.moveTo(sp.x + sp.size, sp.y);
          ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
        }
        ctx.globalAlpha = 0.75;
        ctx.fill();

        // Add to bloom buffer if active
        if (useBloom) {
          bloomCtx.fillStyle = currentBiome.bloomColor;
          bloomCtx.beginPath();
          for (let i = 0; i < specularPoints.length; i++) {
            const sp = specularPoints[i];
            const bx = (sp.x / width) * bloomCanvas.width;
            const by = (sp.y / height) * bloomCanvas.height;
            bloomCtx.moveTo(bx + sp.size * 2, by);
            bloomCtx.arc(bx, by, sp.size * 2, 0, Math.PI * 2);
          }
          bloomCtx.fill();
        }
      }
      ctx.globalAlpha = 1;

      // 3. INTERACTIVE SAKNUSSEMM WALL RUNES WITH BLOOM
      const newActiveRunes = [];
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let i = 0; i < runes.length; i++) {
        const rune = runes[i];
        const runeZ = (rune.zOffset + (scrollProgress * 2.6)) % 1.0;
        if (runeZ < 0.08 || runeZ > 0.92) continue;

        const runeScale = Math.pow(runeZ, 1.8);
        const runeDist = baseRadius * runeScale * 0.95;
        const rx = vx + Math.cos(rune.angle) * runeDist;
        const ry = vy + Math.sin(rune.angle) * (runeDist * 0.86);

        const dx = rx - mx;
        const dy = ry - my;
        const distToLantern = Math.sqrt(dx * dx + dy * dy);

        if (distToLantern < 280) {
          const proximity = Math.pow(1 - distToLantern / 280, 1.5);
          const isHovered = distToLantern < 55;

          if (isHovered) {
            newActiveRunes.push({ index: rune.idx, x: rx, y: ry });
          }

          ctx.save();
          ctx.translate(rx, ry);
          ctx.rotate(rune.angle + Math.PI / 2);
          const fontSize = Math.round(rune.size * runeScale * (isHovered ? 1.4 : 1));
          ctx.font = `${fontSize}px "Cinzel Decorative", serif`;
          
          if (isHovered) {
            ctx.shadowColor = '#ffe29e';
            ctx.shadowBlur = 20;
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = 1;
          } else {
            ctx.fillStyle = currentBiome.glowColor;
            ctx.shadowColor = currentBiome.bloomColor;
            ctx.shadowBlur = 10 * proximity;
            ctx.globalAlpha = proximity * Math.min(1, runeScale * 2.2);
          }

          ctx.fillText(rune.char, 0, 0);
          ctx.restore();

          // Render glowing rune to bloom buffer
          if (useBloom && (isHovered || proximity > 0.4)) {
            bloomCtx.save();
            const bx = (rx / width) * bloomCanvas.width;
            const by = (ry / height) * bloomCanvas.height;
            bloomCtx.translate(bx, by);
            bloomCtx.rotate(rune.angle + Math.PI / 2);
            bloomCtx.font = `${Math.round(fontSize * 0.45)}px "Cinzel Decorative", serif`;
            bloomCtx.fillStyle = isHovered ? '#ffffff' : currentBiome.bloomColor;
            bloomCtx.fillText(rune.char, 0, 0);
            bloomCtx.restore();
          }
        }
      }
      activeRunePositionsRef.current = newActiveRunes;
      ctx.globalAlpha = 1;

      // 4. PROCEDURAL VOLUMETRIC LIGHT SHAFTS (GOD RAYS)
      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      const rayReach = Math.max(width, height) * 0.95;
      const [glowR, glowG, glowB] = currentBiome.particleColor.split(',').map(s => parseInt(s.trim(), 10));

      for (let i = 0; i < rays.length; i++) {
        const ray = rays[i];
        const currentAngle = ray.angleOffset + time * ray.speed + (mouse.vx * 0.003);
        const rayWidth = ray.width * (0.85 + 0.15 * Math.sin(time * 2.0 + i));

        const a1 = currentAngle - rayWidth * 0.5;
        const a2 = currentAngle + rayWidth * 0.5;

        const x1 = mx + Math.cos(a1) * rayReach;
        const y1 = my + Math.sin(a1) * rayReach;
        const x2 = mx + Math.cos(a2) * rayReach;
        const y2 = my + Math.sin(a2) * rayReach;

        const rayGrad = ctx.createRadialGradient(mx, my, 20, mx, my, rayReach);
        const rayAlpha = (0.045 + 0.02 * Math.sin(time * 1.5 + i)) * (0.8 + 0.4 * cpProgress);
        rayGrad.addColorStop(0, `rgba(${glowR}, ${glowG}, ${glowB}, ${rayAlpha * 1.6})`);
        rayGrad.addColorStop(0.35, `rgba(${glowR}, ${glowG}, ${glowB}, ${rayAlpha})`);
        rayGrad.addColorStop(0.75, `rgba(${glowR}, ${glowG}, ${glowB}, ${rayAlpha * 0.25})`);
        rayGrad.addColorStop(1, 'transparent');

        ctx.fillStyle = rayGrad;
        ctx.beginPath();
        ctx.moveTo(mx, my);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // 5. 3D-TO-2D DEPTH PARTICLES CATCHING VOLUMETRIC LIGHT
      const pColorRgb = `rgb(${glowR}, ${glowG}, ${glowB})`;
      const activeParticleCount = isLowPowerDevice ? 50 : particles.length;

      for (let i = 0; i < activeParticleCount; i++) {
        const p = particles[i];
        p.z -= p.speed + thrust;

        if (p.z <= 0.02) {
          p.z = 0.98 + Math.random() * 0.02;
          p.x = (Math.random() - 0.5) * 2.3;
          p.y = (Math.random() - 0.5) * 2.3;
        }

        const projScale = 1 / p.z;
        const sx = vx + (p.x * width * 0.4) * projScale;
        const sy = vy + (p.y * height * 0.4) * projScale;

        if (sx < -20 || sx > width + 20 || sy < -20 || sy > height + 20) continue;

        const pSize = Math.max(0.7, p.size * (1 - p.z * 0.55) * Math.min(projScale, 4.8));
        const pAlpha = Math.min(0.9, (1 - p.z) * 0.95);

        const pdx = sx - mx;
        const pdy = sy - my;
        const pDistSq = pdx * pdx + pdy * pdy;
        const illuminated = pDistSq < 65000;

        ctx.beginPath();
        if (illuminated) {
          const boost = 1 - Math.sqrt(pDistSq) / 255;
          ctx.fillStyle = pColorRgb;
          ctx.globalAlpha = Math.min(1, pAlpha + boost * 0.65);
          ctx.arc(sx, sy, pSize * (1 + boost * 0.5), 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.globalAlpha = boost * 0.28;
          ctx.arc(sx, sy, pSize * 2.8, 0, Math.PI * 2);
          ctx.fill();

          // Add bright motes to bloom
          if (useBloom && boost > 0.55) {
            const bx = (sx / width) * bloomCanvas.width;
            const by = (sy / height) * bloomCanvas.height;
            bloomCtx.fillStyle = currentBiome.bloomColor;
            bloomCtx.beginPath();
            bloomCtx.arc(bx, by, pSize * 1.5, 0, Math.PI * 2);
            bloomCtx.fill();
          }
        } else {
          ctx.fillStyle = pColorRgb;
          ctx.globalAlpha = pAlpha * 0.38;
          ctx.arc(sx, sy, pSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      // 6. HARDWARE BILINEAR BLOOM COMPOSITE (Zero CPU penalty)
      if (useBloom && bloomCanvas.width > 0 && bloomCanvas.height > 0) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = 0.65;
        // Drawing 1/4 size bloomCanvas upscaled automatically performs bilinear smoothing
        ctx.drawImage(bloomCanvas, 0, 0, width, height);
        ctx.restore();
      }

      // 7. LANTERN LIGHT CONE & PERIPHERAL VIGNETTE
      const lanternRadius = Math.max(width, height) * 0.56;
      const lanternGrad = ctx.createRadialGradient(mx, my, 30, mx, my, lanternRadius);
      lanternGrad.addColorStop(0, 'rgba(255, 238, 195, 0.16)');
      lanternGrad.addColorStop(0.3, 'rgba(0, 0, 0, 0.1)');
      lanternGrad.addColorStop(0.68, 'rgba(0, 0, 0, 0.68)');
      lanternGrad.addColorStop(1, 'rgba(2, 2, 4, 0.96)');

      ctx.fillStyle = lanternGrad;
      ctx.fillRect(0, 0, width, height);

      // 8. LANTERN CORE SPECULAR FLARE
      const flareGrad = ctx.createRadialGradient(mx, my, 0, mx, my, 240);
      flareGrad.addColorStop(0, currentBiome.glowColor);
      flareGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = flareGrad;
      ctx.globalCompositeOperation = 'screen';
      ctx.fillRect(mx - 240, my - 240, 480, 480);
      ctx.globalCompositeOperation = 'source-over';

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchMove);
      window.removeEventListener('click', handleClick);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        id="tunnel-cavern-canvas"
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
        style={{ display: 'block', imageRendering: 'auto' }}
      />

      {/* FLOATING RUNIC WHISPER TOAST NOTIFICATION */}
      {activeWhisper && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-40 px-5 py-2.5 rounded border border-[#c9a84c]/60 bg-[#0e0a07]/92 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.85)] pointer-events-none animate-in fade-in slide-in-from-top-4 duration-300">
          <p className="font-['Cinzel'] text-xs text-[#f4decb] tracking-wider text-center italic">
            {activeWhisper}
          </p>
        </div>
      )}
    </>
  );
}
