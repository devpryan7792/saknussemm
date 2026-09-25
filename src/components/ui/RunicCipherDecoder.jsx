import React, { useState, useEffect, useRef } from 'react';
import { animate } from 'animejs';
import confetti from 'canvas-confetti';
import { useScrollStore } from '../../store/useScrollStore';
import { Key, Sparkles, X, Check, RefreshCw } from 'lucide-react';

const RUNIC_ALPHABET = [
  { char: 'ᚠ', latin: 'F', name: 'Fehu' },
  { char: 'ᚢ', latin: 'U', name: 'Uruz' },
  { char: 'ᚦ', latin: 'TH', name: 'Thurisaz' },
  { char: 'ᚨ', latin: 'A', name: 'Ansuz' },
  { char: 'ᚱ', latin: 'R', name: 'Raidho' },
  { char: 'ᚲ', latin: 'K', name: 'Kenaz' },
  { char: 'ᚷ', latin: 'G', name: 'Gebo' },
  { char: 'ᚹ', latin: 'W', name: 'Wunjo' },
  { char: 'ᚺ', latin: 'H', name: 'Hagalaz' },
  { char: 'ᚾ', latin: 'N', name: 'Nauthiz' },
  { char: 'ᛁ', latin: 'I', name: 'Isa' },
  { char: 'ᛃ', latin: 'J', name: 'Jera' },
  { char: 'ᛈ', latin: 'P', name: 'Perthro' },
  { char: 'ᛇ', latin: 'EI', name: 'Eihwaz' },
  { char: 'ᛉ', latin: 'Z', name: 'Algiz' },
  { char: 'ᛊ', latin: 'S', name: 'Sowilo' },
  { char: 'ᛏ', latin: 'T', name: 'Tiwaz' },
  { char: 'ᛒ', latin: 'B', name: 'Berkano' },
  { char: 'ᛖ', latin: 'E', name: 'Ehwaz' },
  { char: 'ᛗ', latin: 'M', name: 'Mannaz' },
  { char: 'ᛚ', latin: 'L', name: 'Laguz' },
  { char: 'ᛜ', latin: 'ING', name: 'Ingwaz' },
  { char: 'ᛟ', latin: 'O', name: 'Othala' },
  { char: 'ᛞ', latin: 'D', name: 'Dagaz' },
];

const CIPHERS = [
  {
    targetRunic: 'ᛁᛟᚲᚢᛚᛁᛊ',
    solution: 'JOKULIS',
    hint: 'The icy glacier chimney of Snæfellsjökull',
  },
  {
    targetRunic: 'ᛊᚲᚨᚱᛏᚨᚱᛁᛊ',
    solution: 'SCARTARIS',
    hint: 'The mountain whose shadow points to the crater entrance at summer solstice',
  },
  {
    targetRunic: 'ᚨᚢᛞᚨᛊ',
    solution: 'AUDAS',
    hint: 'Saknussemm\'s command: "Audax viator" (Bold traveler)',
  },
];

export function RunicCipherDecoder() {
  const isDecoderOpen = useScrollStore((state) => state.isRunicDecoderOpen);
  const setDecoderOpen = useScrollStore((state) => state.setRunicDecoderOpen);

  const [cipherIndex, setCipherIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isSolved, setIsSolved] = useState(false);
  const modalRef = useRef(null);

  const activeCipher = CIPHERS[cipherIndex];

  useEffect(() => {
    if (isDecoderOpen && modalRef.current) {
      animate(modalRef.current, {
        opacity: [0, 1],
        scale: [0.92, 1],
        duration: 400,
        ease: 'outCubic',
      });
    }
  }, [isDecoderOpen]);

  const handleCharClick = (latin) => {
    if (userInput.length < activeCipher.solution.length) {
      const next = (userInput + latin).slice(0, activeCipher.solution.length);
      setUserInput(next);
      if (next.toUpperCase() === activeCipher.solution) {
        triggerSuccess();
      }
    }
  };

  const handleBackspace = () => {
    setUserInput((prev) => prev.slice(0, -1));
    setIsSolved(false);
  };

  const triggerSuccess = () => {
    setIsSolved(true);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#c9a84c', '#e4cf8e', '#88c999', '#ffffff'],
    });
  };

  const nextPuzzle = () => {
    setCipherIndex((prev) => (prev + 1) % CIPHERS.length);
    setUserInput('');
    setIsSolved(false);
  };

  if (!isDecoderOpen) return null;

  return (
    <div
      id="runic-decoder-backdrop"
      className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
      onClick={() => setDecoderOpen(false)}
    >
      <div
        ref={modalRef}
        id="runic-decoder-modal"
        className="relative w-full max-w-2xl bg-[#140e0a] border border-[#c9a84c]/50 rounded-sm shadow-[0_25px_60px_rgba(0,0,0,0.95)] text-[#f2e6c9] p-6 md:p-8 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 10%, rgba(201, 168, 76, 0.12) 0%, transparent 80%)',
        }}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-[#c9a84c]/30 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <Key className="w-5 h-5 text-[#c9a84c]" />
            <div>
              <h3 className="font-['Cinzel_Decorative'] text-lg text-[#c9a84c] font-bold">
                Arne Saknussemm’s Cryptographic Slate
              </h3>
              <p className="text-xs text-[#a09075] font-['Cinzel'] tracking-widest uppercase">
                Elder Futhark Cryptanalysis
              </p>
            </div>
          </div>
          <button
            id="close-decoder-btn"
            onClick={() => setDecoderOpen(false)}
            className="p-1.5 text-[#a09075] hover:text-[#c9a84c] hover:bg-[#c9a84c]/10 rounded-sm transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ACTIVE CIPHER DISPLAY */}
        <div className="bg-[#0b0805] border border-[#c9a84c]/30 p-6 rounded-sm text-center mb-6">
          <span className="text-[11px] font-['Cinzel'] tracking-[0.25em] text-[#a09075] uppercase block mb-2">
            Inscribed Runic Word
          </span>
          <div className="text-4xl md:text-5xl font-['Cinzel_Decorative'] text-[#c9a84c] tracking-widest my-3">
            {activeCipher.targetRunic}
          </div>
          <p className="text-xs text-[#d8c8a8] font-['EB_Garamond'] italic max-w-md mx-auto">
            Hint: {activeCipher.hint}
          </p>

          {/* INPUT SLOTS */}
          <div className="flex justify-center gap-2 mt-5">
            {Array.from({ length: activeCipher.solution.length }).map((_, i) => {
              const letter = userInput[i] || '';
              return (
                <div
                  key={i}
                  className={`w-10 h-12 md:w-12 md:h-14 border rounded-sm flex items-center justify-center font-['Cinzel'] text-xl font-bold transition-all ${
                    isSolved
                      ? 'border-[#88c999] bg-[#88c999]/15 text-[#88c999]'
                      : letter
                      ? 'border-[#c9a84c] bg-[#c9a84c]/15 text-[#f2e6c9]'
                      : 'border-[#c9a84c]/30 bg-black/40 text-transparent'
                  }`}
                >
                  {letter}
                </div>
              );
            })}
          </div>

          {isSolved && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-[#88c999] font-['Cinzel'] font-bold">
              <Check className="w-4 h-4" />
              <span>Cipher Deciphered! The Way Is Cleared.</span>
            </div>
          )}
        </div>

        {/* INTERACTIVE RUNIC KEYBOARD */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-[#a09075] font-['Cinzel']">
            <span>Tap glyphs to transcribe latin translation</span>
            <div className="flex gap-2">
              <button
                onClick={handleBackspace}
                className="px-2.5 py-1 border border-[#c9a84c]/30 hover:border-[#c9a84c] rounded text-[11px] hover:text-[#f2e6c9]"
              >
                Backspace
              </button>
              <button
                onClick={nextPuzzle}
                className="px-2.5 py-1 border border-[#c9a84c]/30 hover:border-[#c9a84c] rounded text-[11px] flex items-center gap-1 hover:text-[#f2e6c9]"
              >
                <RefreshCw className="w-3 h-3" /> Next Slate
              </button>
            </div>
          </div>

          <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
            {RUNIC_ALPHABET.map((r) => (
              <button
                key={r.char}
                onClick={() => handleCharClick(r.latin)}
                className="p-2 border border-[#c9a84c]/25 hover:border-[#c9a84c] bg-[#0f0a07] hover:bg-[#c9a84c]/15 rounded flex flex-col items-center justify-center transition-all group active:scale-95"
              >
                <span className="text-xl font-['Cinzel_Decorative'] text-[#c9a84c] group-hover:scale-110 transition-transform">
                  {r.char}
                </span>
                <span className="text-[10px] text-[#a09075] font-mono mt-0.5">{r.latin}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
