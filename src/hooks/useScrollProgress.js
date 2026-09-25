import { useEffect } from 'react';
import Lenis from 'lenis';
import { useScrollStore } from '../store/useScrollStore';

// PROJECT: Journey to the Centre of the Earth
// FILE: useScrollProgress.js
// UPDATE: Switched to Lenis for normalized, buttery smooth virtual scroll

export function useScrollProgress() {
  const setScrollProgress = useScrollStore((state) => state.setScrollProgress);

  useEffect(() => {
    // Initialize Lenis with optimal settings for a cinematic scroll
    const lenis = new Lenis({
      lerp: 0.12, // Physical base friction, replacing 'duration'
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1.0, // Standard speed for better control
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    useScrollStore.getState().setLenis(lenis);

    let animationFrameId;
    let snapSettleTimer = null;

    // Synchronize scroll on resize to prevent limit errors
    const handleResize = () => {
      lenis.resize();
    };
    window.addEventListener('resize', handleResize);

    // The scroll event is now fired cleanly by Lenis
    lenis.on('scroll', ({ scroll, limit, progress }) => {
      // Use progress directly if available, otherwise calculate
      const p = (typeof progress === 'number') ? progress : (limit > 0 ? scroll / limit : 0);
      setScrollProgress(Math.max(0, Math.min(1, p)));
      
      // Dynamic Physical Friction (Pressure of the Earth)
      // Make it EXTREMELY obvious. Surface = extremely fast/light (0.2). Core = heavy sludge (0.015).
      if (lenis.options) {
        lenis.options.lerp = 0.20 - (p * 0.185); 
      }

      // Checkpoint snap lock: when user stops scrolling, settle perfectly on nearest checkpoint
      clearTimeout(snapSettleTimer);
      if (!useScrollStore.getState().isLocked) {
        snapSettleTimer = setTimeout(() => {
          if (useScrollStore.getState().isLocked) return;
          const currentY = window.scrollY;
          const snapSections = document.querySelectorAll('.checkpoint-snap-section');
          if (snapSections.length > 0) {
            let closestTop = 0;
            let minDiff = Infinity;
            snapSections.forEach((sec) => {
              const top = sec.offsetTop;
              const diff = Math.abs(currentY - top);
              if (diff < minDiff) {
                minDiff = diff;
                closestTop = top;
              }
            });

            // Smooth snap lock into view if within checkpoint attraction zone
            if (minDiff > 4 && minDiff < window.innerHeight * 0.7) {
              lenis.scrollTo(closestTop, {
                duration: 0.6,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
              });
            }
          }
        }, 150);
      }
    });

    function raf(time) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }
    
    animationFrameId = requestAnimationFrame(raf);

    // Initial check in case of mid-page reload
    if (document.documentElement.scrollHeight > window.innerHeight) {
       const initialScroll = window.scrollY || 0;
       const limit = document.documentElement.scrollHeight - window.innerHeight;
       setScrollProgress(Math.max(0, Math.min(1, initialScroll / limit)));
    }

    if (useScrollStore.getState().isLocked) {
      lenis.stop();
    }

    const unsubscribe = useScrollStore.subscribe(
      (state, prevState) => {
        if (state.isLocked !== prevState.isLocked) {
          if (state.isLocked) {
            lenis.stop();
          } else {
            lenis.start();
          }
        }
      }
    );

    return () => {
      clearTimeout(snapSettleTimer);
      unsubscribe();
      window.removeEventListener('resize', handleResize);
      lenis.destroy();
      cancelAnimationFrame(animationFrameId);
    };
  }, [setScrollProgress]);

  return null;
}
