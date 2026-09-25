import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

import plate0 from '../../assets/images/verne_library_study_1790364948062.jpg';
import plate1 from '../../assets/images/verne_iceland_glacier_1790364962606.jpg';
import plate2 from '../../assets/images/verne_sneffels_crater_1790364975735.jpg';
import plate3 from '../../assets/images/verne_whispering_cavern_1790364988928.jpg';
import plate4 from '../../assets/images/verne_fungi_forest_1790365000822.jpg';
import plate5 from '../../assets/images/verne_lidenbrock_sea_1790365013418.jpg';
import plate6 from '../../assets/images/verne_leviathan_battle_1790365026130.jpg';
import plate7 from '../../assets/images/verne_stromboli_eruption_1790365038304.jpg';

interface PlateMeta {
  src: string;
  plateNum: string;
  title: string;
  location: string;
  date: string;
}

const PLATES: Record<number, PlateMeta> = {
  0: {
    src: plate0,
    plateNum: 'PLATE I',
    title: 'THE STUDY & SAKNUSSEMM CIPHER',
    location: 'Hamburg · Konigstrasse 19',
    date: 'MAY 1863',
  },
  1: {
    src: plate1,
    plateNum: 'PLATE II',
    title: 'SNÆFELLSJÖKULL GLACIER',
    location: 'Reykjavik · Western Iceland',
    date: 'JUNE 1863',
  },
  2: {
    src: plate2,
    plateNum: 'PLATE III',
    title: 'CHIMNEY OF SCARTARIS',
    location: 'Sneffels Crater · 2,800 Ft Abyss',
    date: 'JULY 1863',
  },
  3: {
    src: plate3,
    plateNum: 'PLATE IV',
    title: 'WHISPERING GALLERY & HANSBACH',
    location: 'Granite Cavern · 15 Leagues Depth',
    date: 'JULY 1863',
  },
  4: {
    src: plate4,
    plateNum: 'PLATE V',
    title: 'FOREST OF SUBTERRANEAN FUNGI',
    location: 'Silurian Basin · 30 Leagues Depth',
    date: 'AUGUST 1863',
  },
  5: {
    src: plate5,
    plateNum: 'PLATE VI',
    title: 'THE VAST LIDENBROCK SEA',
    location: 'Subterranean Ocean · Timber Raft',
    date: 'AUGUST 1863',
  },
  6: {
    src: plate6,
    plateNum: 'PLATE VII',
    title: 'BATTLE OF PRIMEVAL LEVIATHANS',
    location: 'Great Abyssal Sea · 42 Leagues',
    date: 'AUGUST 1863',
  },
  7: {
    src: plate7,
    plateNum: 'PLATE VIII',
    title: 'MAGMA ASCENT & STROMBOLI ERUPTION',
    location: 'Mount Stromboli · Sicily, Italy',
    date: 'SEPTEMBER 1863',
  },
};

interface AnimatedCheckpointIllustrationProps {
  checkpointId: number;
  glowColor?: string;
  mousePos?: { x: number; y: number };
  scrollVelocity?: number;
  className?: string;
}

export function AnimatedCheckpointIllustration({
  checkpointId,
  glowColor = '#c9a84c',
  className = '',
}: AnimatedCheckpointIllustrationProps) {
  const [hasError, setHasError] = useState(false);
  const plate = PLATES[checkpointId] || PLATES[0];

  return (
    <div
      className={`relative w-full flex items-center justify-center select-none ${className}`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={`anim-plate-${checkpointId}`}
          initial={{ opacity: 0, scale: 0.96, filter: 'blur(6px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 1.03, filter: 'blur(6px)' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="w-full relative flex flex-col items-center"
        >
          {/* IMMUTABLE ARCHIVAL MUSEUM PLATE FRAME */}
          <div
            className="relative w-full overflow-hidden rounded-md bg-[#0a0705] border border-[#c9a84c]/35 shadow-[0_20px_50px_rgba(0,0,0,0.92)]"
            style={{
              boxShadow: `0 24px 60px rgba(0,0,0,0.95), 0 0 40px ${glowColor}15`,
            }}
          >
            {/* Inner Antique Double Hairline Inset */}
            <div className="absolute inset-0 pointer-events-none z-20 border border-[#c9a84c]/20 m-1 rounded-sm" />

            {/* Corner Brass Brackets */}
            <div className="absolute top-2 left-2 z-25 w-2.5 h-2.5 border-t border-l border-[#c9a84c]/70 pointer-events-none" />
            <div className="absolute top-2 right-2 z-25 w-2.5 h-2.5 border-t border-r border-[#c9a84c]/70 pointer-events-none" />
            <div className="absolute bottom-10 left-2 z-25 w-2.5 h-2.5 border-b border-l border-[#c9a84c]/70 pointer-events-none" />
            <div className="absolute bottom-10 right-2 z-25 w-2.5 h-2.5 border-b border-r border-[#c9a84c]/70 pointer-events-none" />

            {/* Lithograph Artwork Slot with Zero-Broken-Image Policy */}
            <div className="relative w-full aspect-[4/3] bg-[#0c0906] overflow-hidden">
              {!hasError ? (
                <img
                  src={plate.src}
                  alt={plate.title}
                  loading="eager"
                  referrerPolicy="no-referrer"
                  onError={() => setHasError(true)}
                  className="w-full h-full object-cover block select-none pointer-events-none filter contrast-[1.04] brightness-[0.96]"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#140e0a]">
                  <span className="font-['Cinzel'] text-sm text-[#c9a84c] tracking-widest uppercase mb-1">
                    {plate.plateNum}
                  </span>
                  <span className="text-xs text-[#f2e6c9]/70 font-serif italic">
                    {plate.title}
                  </span>
                </div>
              )}

              {/* Archival Vignette Gradient Scrim */}
              <div
                className="absolute inset-0 pointer-events-none z-10"
                style={{
                  background:
                    'radial-gradient(circle at 50% 50%, transparent 55%, rgba(10, 6, 4, 0.45) 85%, rgba(8, 4, 2, 0.85) 100%)',
                }}
              />
            </div>

            {/* ARCHIVAL INSCRIPTION LABEL (CLEAN UNBOXED METADATA) */}
            <div className="relative z-20 w-full bg-[#0e0a07] border-t border-[#c9a84c]/25 px-3.5 py-2.5 flex items-center justify-between text-[#c9a84c] select-none">
              <div className="flex items-center gap-2 text-[0.68rem] font-['Cinzel'] tracking-[0.2em] uppercase font-semibold text-[#c9a84c]">
                <span>{plate.plateNum}</span>
                <span className="text-[#c9a84c]/40 font-normal">·</span>
                <span className="text-[#f2e6c9]/90 tracking-[0.16em]">{plate.title}</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-[0.62rem] font-serif text-[#f2e6c9]/60 tracking-wider">
                <span>{plate.location}</span>
                <span className="text-[#c9a84c]/30">·</span>
                <span>{plate.date}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
