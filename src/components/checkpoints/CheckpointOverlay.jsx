import React, { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { useScrollStore } from '../../store/useScrollStore';
import { CHECKPOINTS } from '../../data/checkpoints';
import { ILLUSTRATION_CONFIG } from './illustrationConfig';
import { AnimatedCheckpointIllustration } from '../illustrations/AnimatedCheckpointIllustration';
import { Sparkles, BookOpen, Scroll, CheckCircle, ChevronDown, Award } from 'lucide-react';
import './CheckpointOverlay.css';

// Spatial choreography layout mappings per checkpoint ID
const LAYOUT_MAP = {
  0: 'layout-top-image-bottom-text', // Checkpoint 0: Top Image, Bottom Text
  1: 'layout-left-image-right-text', // Checkpoint 1: Left Image, Right Text
  2: 'layout-right-image-left-text', // Checkpoint 2: Right Image, Left Text (Glides to right)
  3: 'layout-diagonal-split',        // Checkpoint 3: Top-Left Image, Bottom-Right Text
  4: 'layout-bottom-image-top-text', // Checkpoint 4: Bottom Image, Top Text
  5: 'layout-marine-voyage',         // Checkpoint 5: Left Image, Right Text (Oceanic drift)
  6: 'layout-cinematic-arena',       // Checkpoint 6: Right Image, Left Text (Leviathans battle)
  7: 'layout-vertical-surge',        // Checkpoint 7: Top Image, Bottom Text (Stromboli eruption)
  8: 'layout-top-image-bottom-text', // Checkpoint 8: Top Image, Bottom Text (Epilogue)
};

// Initial glide vectors from center to target layout for GSAP transition sequence
const getTransitionOffsets = (checkpointId) => {
  switch (checkpointId) {
    case 0: // Top Image, Bottom Text (Vertical split from center)
      return {
        startIllu: { x: 0, y: 110, scale: 0.88, opacity: 0 },
        startText: { x: 0, y: -70, opacity: 0 },
      };
    case 1: // Left Image, Right Text (Glides from center to Left / Right)
      return {
        startIllu: { x: 150, y: 0, scale: 0.88, opacity: 0 },
        startText: { x: -130, y: 0, opacity: 0 },
      };
    case 2: // Right Image, Left Text (Glides from center to Right / Left)
      return {
        startIllu: { x: -150, y: 0, scale: 0.88, opacity: 0 },
        startText: { x: 130, y: 0, opacity: 0 },
      };
    case 3: // Diagonal Split (Top-Left Image, Bottom-Right Text)
      return {
        startIllu: { x: 90, y: 90, scale: 0.88, opacity: 0 },
        startText: { x: -90, y: -90, opacity: 0 },
      };
    case 4: // Bottom Image, Top Text (Floor biome)
      return {
        startIllu: { x: 0, y: -90, scale: 0.88, opacity: 0 },
        startText: { x: 0, y: 80, opacity: 0 },
      };
    case 5: // Left Image, Right Text (Oceanic Drift)
      return {
        startIllu: { x: 150, y: 0, scale: 0.88, opacity: 0 },
        startText: { x: -130, y: 0, opacity: 0 },
      };
    case 6: // Right Image, Left Text (Leviathan Arena)
      return {
        startIllu: { x: -150, y: 0, scale: 0.88, opacity: 0 },
        startText: { x: 130, y: 0, opacity: 0 },
      };
    case 7: // Top Image, Bottom Text (Skyward Magma Surge)
      return {
        startIllu: { x: 0, y: 130, scale: 0.88, opacity: 0 },
        startText: { x: 0, y: -70, opacity: 0 },
      };
    case 8: // Top Image, Bottom Text (Epilogue / Return to Sun)
      return {
        startIllu: { x: 0, y: 110, scale: 0.88, opacity: 0 },
        startText: { x: 0, y: -70, opacity: 0 },
      };
    default:
      return {
        startIllu: { x: 0, y: 0, scale: 1, opacity: 0 },
        startText: { x: 0, y: 0, opacity: 0 },
      };
  }
};

// Continuous micro-scroll physics glide vectors
const getGlideTransform = (id, localProgress) => {
  const norm = localProgress - 0.5; // -0.5 to +0.5
  switch (id) {
    case 0:
      return {
        illu: `translate3d(0, ${norm * -25}px, 0)`,
        text: `translate3d(0, ${norm * 20}px, 0)`,
      };
    case 1:
      return {
        illu: `translate3d(${norm * -30}px, ${norm * -12}px, 0)`,
        text: `translate3d(${norm * 25}px, ${norm * 10}px, 0)`,
      };
    case 2:
      return {
        illu: `translate3d(${norm * 35}px, ${norm * -12}px, 0)`,
        text: `translate3d(${norm * -25}px, ${norm * 10}px, 0)`,
      };
    case 3:
      return {
        illu: `translate3d(${norm * -25}px, ${norm * -20}px, 0)`,
        text: `translate3d(${norm * 25}px, ${norm * 20}px, 0)`,
      };
    case 4:
      return {
        illu: `translate3d(0, ${norm * 25}px, 0)`,
        text: `translate3d(0, ${norm * -20}px, 0)`,
      };
    case 5:
      return {
        illu: `translate3d(${norm * -35}px, ${Math.sin(norm * Math.PI) * 12}px, 0)`,
        text: `translate3d(${norm * 25}px, 0, 0)`,
      };
    case 6:
      return {
        illu: `translate3d(${norm * 30}px, ${norm * -10}px, 0)`,
        text: `translate3d(${norm * -25}px, ${norm * 10}px, 0)`,
      };
    case 7:
      return {
        illu: `translate3d(0, ${norm * -45}px, 0)`,
        text: `translate3d(0, ${norm * 25}px, 0)`,
      };
    case 8:
      return {
        illu: `translate3d(0, ${norm * -25}px, 0)`,
        text: `translate3d(0, ${norm * 20}px, 0)`,
      };
    default:
      return { illu: 'none', text: 'none' };
  }
};

export function CheckpointOverlay() {
  const currentCheckpoint = useScrollStore((state) => state.currentCheckpoint);
  const scrollProgress = useScrollStore((state) => state.scrollProgress);
  const localProgress = useScrollStore((state) => state.localProgress);
  const isMuted = useScrollStore((state) => state.isMuted);
  const setJournalOpen = useScrollStore((state) => state.setJournalOpen);
  const setRunicDecoderOpen = useScrollStore((state) => state.setRunicDecoderOpen);
  const setCertificateOpen = useScrollStore((state) => state.setCertificateOpen);

  const readingProgress = useScrollStore((state) => state.readingProgress);
  const unlockedCheckpoints = useScrollStore((state) => state.unlockedCheckpoints);
  const advanceCheckpointReading = useScrollStore((state) => state.advanceCheckpointReading);
  const unlockCheckpoint = useScrollStore((state) => state.unlockCheckpoint);

  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const slideRefs = useRef({});
  const illuRefs = useRef({});
  const textRefs = useRef({});
  const prevCpIdRef = useRef(null);

  // Intercept wheel, touch, and keyboard scrolling when reading is active
  useEffect(() => {
    const cpId = currentCheckpoint?.id;
    if (cpId === undefined || cpId === null) return;

    const isUnlocked = unlockedCheckpoints.includes(cpId);
    const curProg = readingProgress[cpId] || 0;

    // Only intercept if this checkpoint is locked or not fully read yet
    if (isUnlocked && curProg >= 0.999) return;

    const handleWheel = (e) => {
      if (e.deltaY > 0) {
        // Scrolling down advances word highlighting
        e.preventDefault();
        e.stopPropagation();
        const delta = Math.max(0.035, Math.min(0.12, Math.abs(e.deltaY) * 0.00075));
        advanceCheckpointReading(cpId, delta);
      } else if (e.deltaY < 0 && curProg > 0) {
        // Scrolling up slightly rewinds or allows fine inspection
        const delta = -Math.max(0.02, Math.min(0.08, Math.abs(e.deltaY) * 0.0005));
        advanceCheckpointReading(cpId, delta);
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e) => {
      if (e.touches.length > 0) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const touchCurrentY = e.touches[0].clientY;
        const deltaY = touchStartY - touchCurrentY;
        if (deltaY > 8) {
          e.preventDefault();
          advanceCheckpointReading(cpId, 0.055);
          touchStartY = touchCurrentY;
        } else if (deltaY < -8 && curProg > 0) {
          advanceCheckpointReading(cpId, -0.04);
          touchStartY = touchCurrentY;
        }
      }
    };

    const handleKeyDown = (e) => {
      if (['ArrowDown', 'PageDown', ' ', 'Enter'].includes(e.key)) {
        e.preventDefault();
        advanceCheckpointReading(cpId, 0.075);
      } else if (['ArrowUp', 'PageUp'].includes(e.key) && curProg > 0) {
        advanceCheckpointReading(cpId, -0.05);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('keydown', handleKeyDown, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentCheckpoint?.id, unlockedCheckpoints, readingProgress, advanceCheckpointReading]);

  // Mouse move handler for strata ambient position
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const xPct = (clientX / window.innerWidth) * 100;
    const yPct = (clientY / window.innerHeight) * 100;
    setMousePos({ x: xPct, y: yPct });
  };

  // GSAP Checkpoint Transition Sequence: Glides image and text containers from center to target offsets
  useEffect(() => {
    const targetId = currentCheckpoint?.id;
    if (targetId === undefined || targetId === null) return;

    const prevId = prevCpIdRef.current;
    prevCpIdRef.current = targetId;

    const targetSlide = slideRefs.current[targetId];
    const targetIllu = illuRefs.current[targetId];
    const targetText = textRefs.current[targetId];

    // Outgoing slide transition with gsap.to()
    if (prevId !== null && prevId !== targetId) {
      const prevSlide = slideRefs.current[prevId];
      const prevIllu = illuRefs.current[prevId];
      const prevText = textRefs.current[prevId];

      if (prevIllu && prevText) {
        gsap.to([prevIllu, prevText], {
          opacity: 0,
          scale: 0.94,
          filter: 'blur(6px)',
          duration: 0.35,
          ease: 'power2.inOut',
        });
      }
      if (prevSlide) {
        gsap.to(prevSlide, {
          opacity: 0,
          duration: 0.35,
          ease: 'power2.inOut',
          onComplete: () => {
            gsap.set(prevSlide, { visibility: 'hidden', pointerEvents: 'none' });
          },
        });
      }
    }

    // Incoming target slide glide sequence with gsap.to()
    if (targetSlide && targetIllu && targetText) {
      const offsets = getTransitionOffsets(targetId);

      // Make target slide active
      gsap.set(targetSlide, {
        visibility: 'visible',
        opacity: 1,
        pointerEvents: 'auto',
      });

      // Set initial starting coordinates (e.g. Center / Offsets)
      gsap.set(targetIllu, {
        x: offsets.startIllu.x,
        y: offsets.startIllu.y,
        scale: offsets.startIllu.scale,
        opacity: 0,
        filter: 'blur(10px)',
      });

      gsap.set(targetText, {
        x: offsets.startText.x,
        y: offsets.startText.y,
        opacity: 0,
        scale: 0.96,
        filter: 'blur(8px)',
      });

      // Glide image container smoothly to its layout target position (0, 0)
      gsap.to(targetIllu, {
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.85,
        delay: prevId !== null ? 0.12 : 0.02,
        ease: 'power3.out',
      });

      // Glide text container smoothly to its layout target position (0, 0)
      gsap.to(targetText, {
        x: 0,
        y: 0,
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        duration: 0.85,
        delay: prevId !== null ? 0.18 : 0.08,
        ease: 'power3.out',
      });

      // Staggered text items entrance
      const textItems = targetText.querySelectorAll('.anime-text-item');
      if (textItems.length > 0) {
        gsap.fromTo(
          textItems,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.04,
            delay: prevId !== null ? 0.28 : 0.15,
            ease: 'power2.out',
          }
        );
      }
    }
  }, [currentCheckpoint?.id]);

  const isCardActive = !!currentCheckpoint?.card && scrollProgress < 0.99;
  const overlayOpacity = isCardActive ? 1.0 : 0;

  const particles = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: `${(i * 5.8 + 4) % 100}%`,
      top: `${(i * 11.7 + 6) % 100}%`,
      size: `${(i % 3) * 1.5 + 1.5}px`,
      duration: `${4 + (i % 5) * 1.5}s`,
      delay: `${(i * 0.35) % 3}s`,
    }));
  }, []);

  const activeConfig = ILLUSTRATION_CONFIG[currentCheckpoint?.id] || ILLUSTRATION_CONFIG[0];

  return (
    <div
      className="checkpoint-overlay"
      onMouseMove={handleMouseMove}
      style={{
        opacity: overlayOpacity,
        pointerEvents: overlayOpacity > 0.05 ? 'auto' : 'none',
        transition: 'opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        '--glow-color': activeConfig.glowColor,
      }}
    >
      {/* 2D SUBTERRANEAN GRAIN */}
      <div className="checkpoint-grain" />

      {/* AMBIENT FLOATING STRATA PARTICLES */}
      <div className="mural-particles">
        {particles.map((p) => (
          <div
            key={p.id}
            className="mural-particle"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              animationDuration: p.duration,
              animationDelay: p.delay,
              backgroundColor: activeConfig.glowColor,
            }}
          />
        ))}
      </div>

      {/* CORNER DECORATIVE ACCENTS */}
      <div className="checkpoint-corner tl" />
      <div className="checkpoint-corner tr" />
      <div className="checkpoint-corner bl" />
      <div className="checkpoint-corner br" />

      {/* 2D ASYMMETRICAL SPATIAL CHOREOGRAPHY SLIDES */}
      <div className="relative w-full h-full">
        {CHECKPOINTS.filter((cp) => cp.card).map((cp) => {
          const isCurrent = currentCheckpoint?.id === cp.id;
          const config = ILLUSTRATION_CONFIG[cp.id] || ILLUSTRATION_CONFIG[0];
          const layoutClass = LAYOUT_MAP[cp.id] || 'layout-left-heavy';
          const glide = getGlideTransform(cp.id, isCurrent ? localProgress : 0.5);

          return (
            <div
              key={`slide-${cp.id}`}
              ref={(el) => (slideRefs.current[cp.id] = el)}
              className={`checkpoint-slide ${layoutClass}`}
              style={{
                opacity: isCurrent ? 1 : 0,
                pointerEvents: isCurrent ? 'auto' : 'none',
                visibility: isCurrent ? 'visible' : 'hidden',
              }}
            >
              {/* ASYMMETRIC ILLUSTRATION DOCK WITH GSAP GLIDE & RIVE */}
              <div
                ref={(el) => (illuRefs.current[cp.id] = el)}
                className="illu-container"
              >
                <div
                  className="relative w-full flex items-center justify-center p-2 rounded-lg border border-[#c9a84c]/25 bg-[#0c0805]/85 shadow-[0_25px_60px_rgba(0,0,0,0.95)] backdrop-blur-sm"
                  style={{
                    transform: isCurrent ? glide.illu : 'none',
                    transition: 'transform 0.15s ease-out',
                  }}
                >
                  <div className="w-full relative z-10">
                    <AnimatedCheckpointIllustration
                      checkpointId={cp.id}
                      glowColor={config.glowColor}
                      mousePos={mousePos}
                      scrollVelocity={localProgress}
                    />
                  </div>
                </div>
              </div>

              {/* ASYMMETRIC NARRATIVE DOCK WITH GSAP GLIDE */}
              <div
                ref={(el) => (textRefs.current[cp.id] = el)}
                className="text-container checkpoint-text"
                style={{
                  transform: isCurrent ? glide.text : 'none',
                  transition: 'transform 0.15s ease-out',
                }}
              >
                <div className="checkpoint-top-line anime-text-item" style={{ '--glow-color': config.glowColor }} />

                <span className="checkpoint-label anime-text-item" style={{ color: config.glowColor }}>
                  {cp.card.label}
                </span>

                <h2
                  className="checkpoint-title anime-text-item"
                  style={{ textShadow: `0 0 30px ${config.glowColor}` }}
                >
                  {cp.card.title}
                </h2>

                <div
                  className="checkpoint-depth-badge anime-text-item"
                  style={{ borderColor: config.glowColor, color: config.glowColor }}
                >
                  {cp.depth}
                </div>

                {/* PROGRESSIVE WORD-BY-WORD DECRYPTION NARRATIVE */}
                {(() => {
                  const words = cp.card.body.split(/\s+/).filter(Boolean);
                  const currentProg = readingProgress[cp.id] !== undefined
                    ? readingProgress[cp.id]
                    : (unlockedCheckpoints.includes(cp.id) ? 1 : 0);
                  const highlightedCount = Math.floor(currentProg * words.length);
                  const isFullyUnlocked = unlockedCheckpoints.includes(cp.id) || currentProg >= 0.999;

                  return (
                    <div className="flex flex-col gap-3 w-full">
                      <p className="checkpoint-body anime-text-item">
                        {words.map((word, idx) => {
                          const isHighlighted = isFullyUnlocked || idx < highlightedCount;
                          const isActiveCursor = !isFullyUnlocked && idx === highlightedCount;

                          return (
                            <span
                              key={idx}
                              className={`word-token ${
                                isHighlighted
                                  ? 'word-highlighted'
                                  : isActiveCursor
                                  ? 'word-active-cursor'
                                  : 'word-dimmed'
                              }`}
                              style={
                                isHighlighted
                                  ? { '--glow-color': config.glowColor }
                                  : undefined
                              }
                            >
                              {word}
                            </span>
                          );
                        })}
                      </p>

                      {/* DECIPHER PROGRESS BAR OR UNLOCKED STRATA BANNER */}
                      {!isFullyUnlocked ? (
                        <div className="reading-status-bar anime-text-item" style={{ '--glow-color': config.glowColor }}>
                          <div className="reading-status-meta">
                            <span className="flex items-center gap-1.5">
                              <Scroll className="w-3.5 h-3.5 text-[#c9a84c] animate-bounce" />
                              <span>Scroll to Decipher ({Math.round(currentProg * 100)}%)</span>
                            </span>
                            <button
                              onClick={() => unlockCheckpoint(cp.id)}
                              className="text-[0.6rem] text-[#c9a84c]/70 hover:text-[#fff] underline tracking-widest uppercase transition-colors"
                            >
                              Instant Unlock
                            </button>
                          </div>
                          <div className="reading-progress-track">
                            <div
                              className="reading-progress-fill"
                              style={{
                                width: `${Math.max(4, Math.round(currentProg * 100))}%`,
                                '--glow-color': config.glowColor,
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="strata-unlocked-banner anime-text-item" style={{ '--glow-color': config.glowColor }}>
                          <div className="flex items-center gap-2 text-xs font-['Cinzel'] text-[#f2e6c9] tracking-widest uppercase">
                            <CheckCircle className="w-4 h-4 text-[#c9a84c]" />
                            <span>Strata Decoded — Path Unlocked</span>
                          </div>
                          <div className="flex items-center gap-1 text-[0.65rem] font-['Cinzel'] text-[#c9a84c] tracking-widest uppercase animate-pulse">
                            <span>Scroll Down to Descend</span>
                            <ChevronDown className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* INTERACTIVE ACTION CHIPS */}
                <div className="anime-text-item flex items-center gap-2 pt-1 flex-wrap">
                  <button
                    onClick={() => setJournalOpen(true)}
                    className="px-3 py-1.5 border border-[#c9a84c]/40 hover:border-[#c9a84c] bg-[#140e0a]/80 hover:bg-[#c9a84c]/15 text-xs text-[#f2e6c9] rounded-sm flex items-center gap-1.5 transition-all font-['Cinzel'] tracking-wider uppercase"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#c9a84c]" />
                    <span>Read Field Notes</span>
                  </button>

                  <button
                    onClick={() => setRunicDecoderOpen(true)}
                    className="px-3 py-1.5 border border-[#c9a84c]/40 hover:border-[#c9a84c] bg-[#140e0a]/80 hover:bg-[#c9a84c]/15 text-xs text-[#f2e6c9] rounded-sm flex items-center gap-1.5 transition-all font-['Cinzel'] tracking-wider uppercase"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#c9a84c]" />
                    <span>Decode Runes</span>
                  </button>

                  {cp.id === 8 && (
                    <button
                      onClick={() => setCertificateOpen(true)}
                      className="px-3.5 py-1.5 border border-[#ffd700] hover:border-[#fff] bg-[#ffd700]/25 hover:bg-[#ffd700]/45 text-xs text-[#fff] rounded-sm flex items-center gap-1.5 transition-all font-['Cinzel'] tracking-wider uppercase shadow-[0_0_20px_rgba(255,215,0,0.4)] animate-pulse"
                    >
                      <Award className="w-4 h-4 text-[#ffd700]" />
                      <span>Expedition Certificate</span>
                    </button>
                  )}
                </div>

                {/* Animated Cave Recital Hint */}
                <div className="recital-hint anime-text-item" style={{ color: config.glowColor }}>
                  <div className="wave-icon">
                    <span style={{ backgroundColor: config.glowColor }}></span>
                    <span style={{ backgroundColor: config.glowColor }}></span>
                    <span style={{ backgroundColor: config.glowColor }}></span>
                  </div>
                  {isMuted ? 'Subterranean ambient frequencies' : 'Soundscape echoes throughout the strata'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* SCROLL HINT */}
      <div className="checkpoint-scroll-hint">Continue Descent</div>
    </div>
  );
}

