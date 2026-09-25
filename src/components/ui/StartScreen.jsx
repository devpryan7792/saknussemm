import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { animate, stagger } from 'animejs';
import { Compass, Headphones, Sparkles, Flame, Eye } from 'lucide-react';

export function StartScreen({ onStart, started }) {
  const runesRef = useRef(null);

  useEffect(() => {
    if (!started && runesRef.current) {
      const items = runesRef.current.querySelectorAll('.runic-float');
      if (items.length) {
        animate(items, {
          translateY: [-10, 10],
          opacity: [0.3, 0.9],
          delay: stagger(120),
          duration: 2500,
          direction: 'alternate',
          loop: true,
          ease: 'inOutSine',
        });
      }
    }
  }, [started]);

  return (
    <AnimatePresence>
      {!started && (
        <motion.div
          id="start-screen-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, transition: { duration: 1.2, ease: 'easeInOut' } }}
          className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-[#070503] text-[#f2e6c9] select-none p-6"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 50%, rgba(201, 168, 76, 0.12) 0%, rgba(5, 3, 2, 0.98) 75%)',
          }}
        >
          {/* BACKGROUND RUNIC AURA */}
          <div
            ref={runesRef}
            className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center opacity-30 gap-8 flex-wrap max-w-4xl"
          >
            {['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛈ', 'ᛇ', 'ᛉ', 'ᛊ'].map(
              (char, idx) => (
                <span
                  key={idx}
                  className="runic-float text-4xl md:text-6xl font-['Cinzel_Decorative'] text-[#c9a84c]"
                >
                  {char}
                </span>
              )
            )}
          </div>

          <div className="relative z-10 text-center space-y-6 max-w-2xl px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-3.5 py-1 border border-[#c9a84c]/40 text-[#c9a84c] rounded-full text-xs font-['Cinzel'] tracking-[0.25em] uppercase mb-2 bg-[#c9a84c]/5"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Interactive 2D Subterranean Odyssey</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="text-4xl sm:text-6xl font-['Cinzel_Decorative'] tracking-wider text-[#f2e6c9] font-bold leading-tight"
              style={{ textShadow: '0 0 35px rgba(201, 168, 76, 0.5)' }}
            >
              Journey To The Centre
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              transition={{ delay: 0.7, duration: 1 }}
              className="font-['EB_Garamond'] italic text-lg sm:text-2xl text-[#d8c8a8] max-w-lg mx-auto"
            >
              "Descend, bold traveler, into the crater of the jokul of Snæfell..."
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 1.1, duration: 1 }}
              className="flex items-center justify-center gap-2 text-xs sm:text-sm font-['Cinzel'] text-[#a09075] tracking-widest uppercase pt-2"
            >
              <Headphones className="w-4 h-4 text-[#c9a84c]" />
              <span>Best experienced with audio & smooth scroll</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="pt-6"
            >
              <button
                id="begin-descent-btn"
                onClick={onStart}
                className="group relative inline-flex items-center gap-3 px-9 py-4 border border-[#c9a84c] text-[#f2e6c9] font-['Cinzel'] text-sm tracking-[0.35em] uppercase bg-[#140e0a] hover:bg-[#c9a84c] hover:text-[#140e0a] transition-all duration-300 rounded-sm shadow-[0_0_25px_rgba(201,168,76,0.25)] hover:shadow-[0_0_40px_rgba(201,168,76,0.6)] cursor-pointer"
              >
                <Flame className="w-4 h-4 text-[#c9a84c] group-hover:text-[#140e0a] transition-colors" />
                <span className="font-bold">Enter The Depths</span>
              </button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
