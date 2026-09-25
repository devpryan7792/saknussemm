import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { animate } from 'animejs';
import { useScrollStore } from '../../store/useScrollStore';
import { CHECKPOINTS } from '../../data/checkpoints';
import { BookOpen, Key } from 'lucide-react';
import './HUD.css';

// Hyper-tactile Magnetic Button Wrapper
function MagneticButton({ children, onClick, className, id }) {
  const ref = useRef(null);
  const hitAreaRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    if (!hitAreaRef.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = hitAreaRef.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.45, y: middleY * 0.45 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;
  return (
    <div
      ref={hitAreaRef}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ padding: '12px', margin: '-12px', cursor: 'pointer', display: 'inline-block' }}
    >
      <motion.button
        id={id}
        ref={ref}
        className={className}
        onClick={onClick}
        animate={{ x, y }}
        transition={{ type: 'spring', stiffness: 220, damping: 14, mass: 0.2 }}
        style={{ pointerEvents: 'auto' }}
      >
        {children}
      </motion.button>
    </div>
  );
}

export function HUD() {
  const scrollProgress = useScrollStore((state) => state.scrollProgress);
  const currentCheckpoint = useScrollStore((state) => state.currentCheckpoint);
  const localProgress = useScrollStore((state) => state.localProgress);
  const isMuted = useScrollStore((state) => state.isMuted);
  const setIsMuted = useScrollStore((state) => state.setIsMuted);
  const setJournalOpen = useScrollStore((state) => state.setJournalOpen);
  const setRunicDecoderOpen = useScrollStore((state) => state.setRunicDecoderOpen);
  const scrollToCheckpoint = useScrollStore((state) => state.scrollToCheckpoint);

  const needleRef = useRef(null);

  const getNeedleAngle = () => {
    const nextIndex = Math.min(currentCheckpoint.id + 1, CHECKPOINTS.length - 1);
    const nextCheckpoint = CHECKPOINTS[nextIndex];
    if (!nextCheckpoint || currentCheckpoint.id === nextCheckpoint.id) return currentCheckpoint.needleAngle;
    return currentCheckpoint.needleAngle + (nextCheckpoint.needleAngle - currentCheckpoint.needleAngle) * localProgress;
  };

  const angle = getNeedleAngle();

  useEffect(() => {
    if (needleRef.current) {
      animate(needleRef.current, {
        rotate: angle,
        duration: 400,
        ease: 'outQuad',
      });
    }
  }, [angle]);

  return (
    <div className="hud-container pointer-events-none">
      {/* TOP BAR WITH AUDIO & EXPEDITION TOOLS */}
      <div className="hud-audio-controls flex items-center gap-3">
        {/* Audio Ambient Generator */}
        <MagneticButton
          id="audio-toggle-btn"
          className={`hud-mute-btn ${isMuted ? 'is-muted' : ''}`}
          onClick={() => setIsMuted(!isMuted)}
        >
          <div className="audio-icon">
            <div className={`bar ${isMuted ? 'muted' : 'playing'}`}></div>
            <div className={`bar ${isMuted ? 'muted' : 'playing'}`}></div>
            <div className={`bar ${isMuted ? 'muted' : 'playing'}`}></div>
          </div>
          <span>{isMuted ? 'UNMUTE SOUNDSCAPE' : 'SUBTERRANEAN AUDIO'}</span>
        </MagneticButton>

        {/* Expedition Field Journal Button */}
        <MagneticButton
          id="journal-open-btn"
          className="hud-mute-btn"
          onClick={() => setJournalOpen(true)}
        >
          <BookOpen className="w-3.5 h-3.5 text-[#c9a84c]" />
          <span>FIELD JOURNAL</span>
        </MagneticButton>

        {/* Runic Cryptographic Slate Button */}
        <MagneticButton
          id="runic-open-btn"
          className="hud-mute-btn"
          onClick={() => setRunicDecoderOpen(true)}
        >
          <Key className="w-3.5 h-3.5 text-[#c9a84c]" />
          <span>RUNIC CIPHER</span>
        </MagneticButton>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar" style={{ width: `${scrollProgress * 100}%` }} />

      {/* Env Label */}
      {scrollProgress >= 0.03 && scrollProgress <= 0.96 && (
        <div className="env-label">{currentCheckpoint.envLabel}</div>
      )}

      {/* Compass with click-to-realign and interactive magnetic tilt */}
      <div className="compass-container pointer-events-auto" onClick={() => scrollToCheckpoint(0)} title="Click to surface">
        <div className="compass">
          <span className="compass-label n">N</span>
          <span className="compass-label e">E</span>
          <span className="compass-label s">S</span>
          <span className="compass-label w">W</span>
          <div
            ref={needleRef}
            className="compass-needle"
            style={{ transform: `rotate(${angle}deg)` }}
          >
            <div className="needle-north"></div>
            <div className="needle-south"></div>
            <div className="needle-center"></div>
          </div>
        </div>
        <div className="compass-depth">{currentCheckpoint.depth}</div>
      </div>

      {/* Interactive Depth Meter: Clickable Waypoints */}
      <div className="depth-meter-container pointer-events-auto">
        <div className="depth-meter-line">
          <div
            className="depth-meter-dot"
            style={{
              top: `${Math.max(0, Math.min(100, scrollProgress * 100))}%`,
              transition: 'top 0.15s ease-out',
            }}
          />
          <div className="depth-meter-ticks">
            {CHECKPOINTS.map((cp) => (
              <span
                key={cp.id}
                onClick={() => scrollToCheckpoint(cp.id)}
                className="cursor-pointer hover:text-[#c9a84c] hover:scale-110 transition-transform font-mono"
                style={{
                  top: `${(cp.scrollStart + cp.scrollEnd) * 50}%`,
                  color: currentCheckpoint.id === cp.id ? '#c9a84c' : 'rgba(242, 230, 201, 0.4)',
                }}
                title={cp.card?.title || cp.envLabel}
              >
                {cp.depth}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
