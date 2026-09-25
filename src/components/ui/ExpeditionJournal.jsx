import React, { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';
import { useScrollStore } from '../../store/useScrollStore';
import { CHECKPOINTS } from '../../data/checkpoints';
import { BookOpen, X, Compass, Thermometer, ShieldAlert, Sparkles, Scroll } from 'lucide-react';

const JOURNAL_ENTRIES = [
  {
    id: 0,
    title: "Hamburg Study, May 24",
    author: "Prof. Otto Lidenbrock",
    temp: "19°C",
    pressure: "760 mmHg",
    strata: "Holocene Alluvium",
    note: "Discovered the runic manuscript of Arne Saknussemm within the Heims-Kringla. The parchment smells of age and sulfur. Axel claims it is madness, yet the cryptographic cipher is indisputable.",
    specimen: "Codex Runicus fragment on vellum",
    runes: "ᛁᚾ ᛊᚾᛖᚠᚠᛖᛚᛊ ᛁᛟᚲᚢᛚᛁᛊ",
  },
  {
    id: 1,
    title: "Reykjavík Outskirts, June 13",
    author: "Axel Lidenbrock",
    temp: "9°C",
    pressure: "755 mmHg",
    strata: "Tertiary Basalt",
    note: "We have recruited Hans Bjelke, a quiet eiderdown hunter. He asks no questions, packs his rifle, and guides our pack horses toward the volcanic crater. My hands tremble at the thought of leaving the surface.",
    specimen: "Trachyte lava sample with olivine crystals",
    runes: "ᛞᛖᛊᚲᛖᚾᛞᛖ ᚨᚢᛞᚨᛊ",
  },
  {
    id: 2,
    title: "Crater of Snæfellsjökull, June 28",
    author: "Prof. Otto Lidenbrock",
    temp: "2°C",
    pressure: "710 mmHg",
    strata: "Quaternary Andesite",
    note: "The solstice sun casts the shadow of Mount Scartaris directly upon the central chimney. 'Foras!' the chimney cries. The descent into the subterranean abyss has formally commenced.",
    specimen: "Obsidian glass shard from crater lip",
    runes: "ᛊᚲᚨᚱᛏᚨᚱᛁᛊ ᚢᛗᛒᚱᚨ",
  },
  {
    id: 3,
    title: "The Whispering Gallery, July 10",
    author: "Axel Lidenbrock",
    temp: "27°C",
    pressure: "980 mmHg",
    strata: "Pre-Cambrian Gneiss",
    note: "Separated from Hans and my uncle in the dark labyrinth. My lantern died. In the absolute pitch, the curved granite walls transmitted my uncle's voice from three leagues away. The cavern is an acoustic cathedral.",
    specimen: "Sonorous acoustic granite slab",
    runes: "ᚹᛟᛪ ᛁᚾ ᛏᛖᚾᛖᛒᚱᛁᛊ",
  },
  {
    id: 4,
    title: "Forest of Gigantic Fungi, July 24",
    author: "Axel Lidenbrock",
    temp: "29°C",
    pressure: "1,150 mmHg",
    strata: "Silurian Sediment",
    note: "Towering mushrooms thirty cubits high, pale Lycoperdon resembling ivory domes. We walked beneath their fibrous canopies like insects beneath ancient oaks. No sunlight, yet a persistent phosphorescent mist illuminates everything.",
    specimen: "Giant Prototaxites spore capsule",
    runes: "ᚠᚢᚾᚷᚢᛊ ᚷᛁᚷᚨᚾᛏᛖᚢᛊ",
  },
  {
    id: 5,
    title: "Shores of the Lidenbrock Sea, Aug 4",
    author: "Prof. Otto Lidenbrock",
    temp: "31°C",
    pressure: "1,320 mmHg",
    strata: "Carboniferous Shale",
    note: "Constructed a sturdy raft from petrified surturbrand wood. The subterranean ocean stretches beyond the horizon under a vaulted sky of luminous electric vapors. Strange marine breezes fill our linen sail.",
    specimen: "Lepidodendron bark & petrified surturbrand",
    runes: "ᛗᚨᚱᛖ ᛚᛁᛞᛖᚾᛒᚱᛟᚲᚲ",
  },
  {
    id: 6,
    title: "The Great Leviathan Battle, Aug 19",
    author: "Axel Lidenbrock",
    temp: "38°C",
    pressure: "1,550 mmHg",
    strata: "Jurassic Limestone",
    note: "Two prehistoric sea monsters surfaced around our raft! The Ichthyosaurus with dolphin agility and the Plesiosaurus with a serpentine neck forty feet long. They ripped the black water into foam before sinking into the abyss.",
    specimen: "Fossilized Ichthyosaur tooth fragment",
    runes: "ᛞᚱᚨᚲᛟ ᛈᛚᛖᛊᛁᛟᛊᚨᚢᚱᚢᛊ",
  },
  {
    id: 7,
    title: "Stromboli Crater Lip, Sept 9",
    author: "Hans Bjelke & Axel",
    temp: "42°C",
    pressure: "758 mmHg",
    strata: "Basaltic Tephra",
    note: "Carried upward on a raft of boiling magma and steam through the central chimney of Stromboli in the Tyrrhenian Sea. We have returned to the land of living light. The journey is complete.",
    specimen: "Volcanic lapilli & olive branch from Messina",
    runes: "ᚨᛞ ᛚᚢᚲᛖᛗ ᚱᛖᛞᛁᛏᚢᛊ",
  },
];

export function ExpeditionJournal() {
  const isJournalOpen = useScrollStore((state) => state.isJournalOpen);
  const setJournalOpen = useScrollStore((state) => state.setJournalOpen);
  const currentCheckpoint = useScrollStore((state) => state.currentCheckpoint);
  const scrollToCheckpoint = useScrollStore((state) => state.scrollToCheckpoint);

  const modalRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (isJournalOpen && modalRef.current) {
      animate(modalRef.current, {
        opacity: [0, 1],
        scale: [0.94, 1],
        translateY: [20, 0],
        duration: 450,
        ease: 'outCubic',
      });
      const items = contentRef.current?.querySelectorAll('.journal-anim-item');
      if (items && items.length) {
        animate(items, {
          opacity: [0, 1],
          translateY: [15, 0],
          delay: stagger(50, { start: 150 }),
          duration: 400,
          ease: 'outQuad',
        });
      }
    }
  }, [isJournalOpen]);

  if (!isJournalOpen) return null;

  const activeEntry = JOURNAL_ENTRIES[currentCheckpoint?.id] || JOURNAL_ENTRIES[0];

  return (
    <div
      id="expedition-journal-backdrop"
      className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
      onClick={() => setJournalOpen(false)}
    >
      <div
        ref={modalRef}
        id="expedition-journal-modal"
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#140e0a] border border-[#c9a84c]/40 rounded-sm shadow-[0_25px_60px_rgba(0,0,0,0.9)] text-[#f2e6c9] overflow-hidden flex flex-col pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(201, 168, 76, 0.08) 0%, transparent 70%)',
        }}
      >
        {/* HEADER BAR */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#c9a84c]/30 bg-[#1a120d]">
          <div className="flex items-center gap-3">
            <Scroll className="w-5 h-5 text-[#c9a84c]" />
            <div>
              <h3 className="font-['Cinzel_Decorative'] text-lg text-[#c9a84c] tracking-wider font-bold">
                Expedition Field Notes & Logbook
              </h3>
              <p className="text-xs text-[#a09075] font-['Cinzel'] tracking-widest uppercase">
                Subterranean Survey • Lidenbrock Archives 1863
              </p>
            </div>
          </div>
          <button
            id="close-journal-btn"
            onClick={() => setJournalOpen(false)}
            className="p-2 text-[#a09075] hover:text-[#c9a84c] hover:bg-[#c9a84c]/10 rounded-sm transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY CONTAINER WITH TWO COLUMNS */}
        <div ref={contentRef} className="flex-1 overflow-y-auto p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* LEFT: CHAPTER SELECTOR LIST */}
          <div className="md:col-span-4 border-r border-[#c9a84c]/20 pr-0 md:pr-4 space-y-2">
            <span className="text-xs font-['Cinzel'] text-[#c9a84c]/80 tracking-[0.2em] uppercase block mb-3">
              Geological Waypoints
            </span>
            {JOURNAL_ENTRIES.map((entry, idx) => {
              const isCurrent = currentCheckpoint?.id === entry.id;
              return (
                <button
                  key={entry.id}
                  id={`journal-tab-${entry.id}`}
                  onClick={() => scrollToCheckpoint(entry.id)}
                  className={`w-full text-left p-3 rounded-sm text-xs font-['Cinzel'] transition-all flex items-center justify-between ${
                    isCurrent
                      ? 'bg-[#c9a84c]/20 border-l-2 border-[#c9a84c] text-[#f2e6c9]'
                      : 'hover:bg-white/5 text-[#a09075] hover:text-[#f2e6c9]'
                  }`}
                >
                  <span className="truncate">
                    <strong className="text-[#c9a84c] mr-2">#{idx}</strong> {entry.title}
                  </span>
                  <span className="text-[10px] opacity-70 ml-2 font-mono">{CHECKPOINTS[idx]?.depth}</span>
                </button>
              );
            })}
          </div>

          {/* RIGHT: DETAILED ACTIVE LOG ENTRY */}
          <div className="md:col-span-8 space-y-5 pl-0 md:pl-2">
            <div className="journal-anim-item flex items-start justify-between border-b border-[#c9a84c]/20 pb-4">
              <div>
                <span className="text-xs font-['Cinzel'] text-[#c9a84c] tracking-[0.25em] uppercase">
                  {activeEntry.author}
                </span>
                <h2 className="text-2xl font-['Cinzel_Decorative'] text-[#f2e6c9] mt-1 font-bold">
                  {activeEntry.title}
                </h2>
              </div>
              <div className="text-right">
                <span className="inline-block px-2.5 py-1 text-xs border border-[#c9a84c]/40 text-[#c9a84c] rounded-sm font-mono">
                  {CHECKPOINTS[currentCheckpoint?.id || 0]?.depth}
                </span>
              </div>
            </div>

            {/* TELEMETRY GAUGES */}
            <div className="journal-anim-item grid grid-cols-3 gap-3">
              <div className="p-3 bg-[#0d0906] border border-[#c9a84c]/20 rounded-sm">
                <div className="flex items-center gap-1.5 text-xs text-[#a09075] mb-1">
                  <Thermometer className="w-3.5 h-3.5 text-[#c9a84c]" />
                  <span>Temperature</span>
                </div>
                <div className="text-sm font-mono font-bold text-[#f2e6c9]">{activeEntry.temp}</div>
              </div>

              <div className="p-3 bg-[#0d0906] border border-[#c9a84c]/20 rounded-sm">
                <div className="flex items-center gap-1.5 text-xs text-[#a09075] mb-1">
                  <Compass className="w-3.5 h-3.5 text-[#c9a84c]" />
                  <span>Pressure</span>
                </div>
                <div className="text-sm font-mono font-bold text-[#f2e6c9]">{activeEntry.pressure}</div>
              </div>

              <div className="p-3 bg-[#0d0906] border border-[#c9a84c]/20 rounded-sm">
                <div className="flex items-center gap-1.5 text-xs text-[#a09075] mb-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#c9a84c]" />
                  <span>Strata</span>
                </div>
                <div className="text-xs font-mono font-bold text-[#f2e6c9] truncate">{activeEntry.strata}</div>
              </div>
            </div>

            {/* LOG TEXT */}
            <div className="journal-anim-item p-4 bg-[#0d0906]/80 border border-[#c9a84c]/20 rounded-sm">
              <span className="text-[11px] font-['Cinzel'] tracking-widest text-[#c9a84c] uppercase block mb-2">
                Manuscript Transcript
              </span>
              <p className="font-['EB_Garamond'] text-base md:text-lg italic leading-relaxed text-[#f2e6c9]/95">
                "{activeEntry.note}"
              </p>
            </div>

            {/* SPECIMEN & CIPHER */}
            <div className="journal-anim-item grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 bg-[#0d0906] border border-[#c9a84c]/20 rounded-sm">
                <span className="text-[10px] font-['Cinzel'] tracking-widest text-[#a09075] uppercase block mb-1">
                  Geological Specimen
                </span>
                <span className="text-xs text-[#f2e6c9] font-serif">{activeEntry.specimen}</span>
              </div>

              <div className="p-3.5 bg-[#0d0906] border border-[#c9a84c]/20 rounded-sm flex flex-col justify-between">
                <span className="text-[10px] font-['Cinzel'] tracking-widest text-[#a09075] uppercase block mb-1">
                  Runic Inscription
                </span>
                <span className="text-base text-[#c9a84c] font-['Cinzel_Decorative'] tracking-widest">
                  {activeEntry.runes}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-3 border-t border-[#c9a84c]/20 bg-[#1a120d] flex items-center justify-between text-xs text-[#a09075]">
          <span>Use mouse wheel or depth meter to continue descent</span>
          <button
            onClick={() => setJournalOpen(false)}
            className="px-4 py-1.5 border border-[#c9a84c]/50 text-[#c9a84c] font-['Cinzel'] uppercase tracking-wider text-xs hover:bg-[#c9a84c]/10 rounded-sm transition-colors"
          >
            Close Journal
          </button>
        </div>
      </div>
    </div>
  );
}
