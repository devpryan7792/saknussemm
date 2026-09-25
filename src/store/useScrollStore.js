import { create } from 'zustand';
import { CHECKPOINTS } from '../data/checkpoints';

export const useScrollStore = create((set, get) => ({
  scrollProgress: 0,
  currentCheckpoint: CHECKPOINTS[0],
  localProgress: 0,
  narrativeProgress: 1, // Full clarity by default so text is immediately readable
  sceneProgress: 0,     // 2D scroll progress
  isMuted: true,
  isLocked: false,      // Macro scroll lock (Lenis)
  isCheckpointLocked: false, // Whether user is currently reading-locked at a checkpoint
  readingProgress: {},  // { [checkpointId]: 0 to 1.0 }
  unlockedCheckpoints: [], // List of checkpoint IDs that have been fully read and unlocked
  lenis: null,
  isJournalOpen: false,
  isRunicDecoderOpen: false,

  setLenis: (lenis) => set({ lenis }),
  setIsLocked: (locked) => set({ isLocked: locked }),
  setJournalOpen: (open) => set({ isJournalOpen: open }),
  setRunicDecoderOpen: (open) => set({ isRunicDecoderOpen: open }),

  advanceCheckpointReading: (id, delta) => {
    const state = get();
    const current = state.readingProgress[id] || 0;
    const next = Math.max(0, Math.min(1, current + delta));
    
    const newProgress = { ...state.readingProgress, [id]: next };
    
    if (next >= 0.999) {
      const newUnlocked = state.unlockedCheckpoints.includes(id)
        ? state.unlockedCheckpoints
        : [...state.unlockedCheckpoints, id];
      
      set({
        readingProgress: newProgress,
        unlockedCheckpoints: newUnlocked,
        isLocked: false,
        isCheckpointLocked: false,
      });
    } else {
      set({
        readingProgress: newProgress,
      });
    }
  },

  unlockCheckpoint: (id) => {
    const state = get();
    const newProgress = { ...state.readingProgress, [id]: 1 };
    const newUnlocked = state.unlockedCheckpoints.includes(id)
      ? state.unlockedCheckpoints
      : [...state.unlockedCheckpoints, id];
    
    set({
      readingProgress: newProgress,
      unlockedCheckpoints: newUnlocked,
      isLocked: false,
      isCheckpointLocked: false,
    });
  },

  scrollToCheckpoint: (id) => {
    const cp = CHECKPOINTS.find((c) => c.id === id);
    if (!cp) return;
    const targetProgress = (cp.scrollStart + cp.scrollEnd) / 2;
    const state = get();
    const lenis = state.lenis;
    
    // Unlock checkpoint on direct navigation jump
    const newUnlocked = Array.from(new Set([...state.unlockedCheckpoints, id]));
    const newReading = { ...state.readingProgress, [id]: 1 };
    set({
      isLocked: false,
      isCheckpointLocked: false,
      unlockedCheckpoints: newUnlocked,
      readingProgress: newReading,
    });

    const snapEl = document.getElementById(`checkpoint-snap-${id}`);
    const targetScroll = snapEl
      ? snapEl.offsetTop
      : (id === 0 ? 0 : targetProgress * (document.documentElement.scrollHeight - window.innerHeight));

    if (lenis) {
      lenis.start();
      lenis.scrollTo(targetScroll, { duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    } else {
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  },

  setScrollProgress: (progress) => {
    const clampedProgress = Math.max(0, Math.min(1, progress));
    const state = get();

    // 1. Absolute checkpoint evaluation
    let foundCheckpoint = CHECKPOINTS.find(
      (cp) => clampedProgress >= cp.scrollStart && clampedProgress <= cp.scrollEnd
    );

    if (!foundCheckpoint) {
      if (clampedProgress >= 1) foundCheckpoint = CHECKPOINTS[CHECKPOINTS.length - 1];
      else foundCheckpoint = CHECKPOINTS[0];
    }
    
    // 2. Local progress within the active checkpoint (0 to 1)
    const range = foundCheckpoint.scrollEnd - foundCheckpoint.scrollStart;
    let local = 0;
    if (range > 0) {
      local = Math.max(0, Math.min(1, (clampedProgress - foundCheckpoint.scrollStart) / range));
    }

    // 3. Checkpoint Scroll Lock Gating
    const isUnlocked = state.unlockedCheckpoints.includes(foundCheckpoint.id);
    const readingProg = state.readingProgress[foundCheckpoint.id] || 0;
    
    let shouldLock = false;
    if (!isUnlocked && readingProg < 0.999 && local >= 0.25 && local <= 0.85) {
      shouldLock = true;
    }

    // 4. Smooth narrative progress
    let narrative = 1;
    if (foundCheckpoint.id !== 8) { 
      const lockStart = 0.08;
      const lockEnd = 0.92;
      
      if (local < lockStart) {
        narrative = Math.max(0.2, local / lockStart);
      } else if (local <= lockEnd) {
        narrative = 1;
      } else {
        narrative = Math.max(0.2, 1 - (local - lockEnd) / (1 - lockEnd));
      }
    }

    const sceneProg = clampedProgress;

    const nextCheckpoint = (state.currentCheckpoint && state.currentCheckpoint.id === foundCheckpoint.id)
      ? state.currentCheckpoint
      : foundCheckpoint;

    set({
      scrollProgress: clampedProgress,
      sceneProgress: sceneProg,
      currentCheckpoint: nextCheckpoint,
      localProgress: local,
      narrativeProgress: narrative,
      isLocked: shouldLock || (state.isLocked && state.isCheckpointLocked),
      isCheckpointLocked: shouldLock,
    });
  },
  
  setIsMuted: (muted) => set({ isMuted: muted })
}));
