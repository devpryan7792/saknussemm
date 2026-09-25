import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Award, Compass, Copy, Check, Download, X, Sparkles } from 'lucide-react';
import { useScrollStore } from '../../store/useScrollStore';

export function ExpeditionCertificate({ isOpen, onClose }) {
  const [explorerName, setExplorerName] = useState('Professor Otto Lidenbrock & Axel');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleConfetti = () => {
    confetti({
      particleCount: 85,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#c9a84c', '#e6c875', '#a37c2c', '#ffffff', '#e05a30'],
    });
  };

  const handleCopy = () => {
    const text = `📜 EXPEDITION TESTAMENT: JOURNEY TO THE CENTER OF THE EARTH\nExplorer: ${explorerName}\nPenetration: −80 km (Lidenbrock Sea Abyss)\nDescent: Snæfellsjökull, Iceland\nAscent: Mount Stromboli, Sicily\nCertified by Arne Saknussemm & The Royal Geographic Senate.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    handleConfetti();
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-[#0e0906] border-2 border-[#c9a84c] rounded-lg p-6 sm:p-10 shadow-[0_0_80px_rgba(201,168,76,0.35)] text-center text-[#f2e6c9]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#c9a84c]/70 hover:text-[#fff] p-1 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Vintage Header */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <Compass className="w-5 h-5 text-[#c9a84c]" />
          <span className="font-['Cinzel'] text-[0.65rem] tracking-[0.3em] uppercase text-[#c9a84c]">
            Royal Subterranean Geological Senate
          </span>
          <Compass className="w-5 h-5 text-[#c9a84c]" />
        </div>

        <h1 className="font-['Cinzel'] text-2xl sm:text-3xl font-bold tracking-widest text-[#f5ebd2] mb-1">
          EXPEDITION CERTIFICATE
        </h1>
        <p className="font-['Cinzel'] text-[0.7rem] tracking-widest text-[#c9a84c]/80 uppercase mb-6">
          Testament of Planetary Penetration
        </p>

        {/* Ornate Gold Border Line */}
        <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent mx-auto mb-6" />

        <p className="font-serif italic text-sm text-[#d4be9b] max-w-md mx-auto mb-4">
          Be it known across all academies that the bearer hath walked where the sun abdicates its throne, venturing through the marrow of the Earth:
        </p>

        {/* Explorer Name Input */}
        <div className="mb-6">
          <input
            type="text"
            value={explorerName}
            onChange={(e) => setExplorerName(e.target.value)}
            className="w-full max-w-md bg-[#18110b] border-b-2 border-[#c9a84c] text-center font-['Cinzel'] text-lg sm:text-xl text-[#ffdf88] px-3 py-1.5 focus:outline-none focus:border-[#fff]"
            placeholder="Enter Explorer Name"
          />
          <p className="text-[0.65rem] font-sans text-[#c9a84c]/60 mt-1 uppercase tracking-wider">
            (Click to edit explorer name)
          </p>
        </div>

        {/* Route Details Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-md mx-auto mb-6 text-left font-['Cinzel'] text-xs">
          <div className="bg-[#140d08] border border-[#c9a84c]/30 p-2.5 rounded">
            <span className="text-[0.6rem] text-[#c9a84c] block uppercase tracking-wider">Descent Chasm</span>
            <span className="text-white font-semibold">Snæfellsjökull, Iceland</span>
          </div>
          <div className="bg-[#140d08] border border-[#c9a84c]/30 p-2.5 rounded">
            <span className="text-[0.6rem] text-[#c9a84c] block uppercase tracking-wider">Volcanic Emergence</span>
            <span className="text-white font-semibold">Stromboli, Sicily</span>
          </div>
          <div className="bg-[#140d08] border border-[#c9a84c]/30 p-2.5 rounded">
            <span className="text-[0.6rem] text-[#c9a84c] block uppercase tracking-wider">Greatest Depth</span>
            <span className="text-white font-semibold">−80 km (Lidenbrock Sea)</span>
          </div>
          <div className="bg-[#140d08] border border-[#c9a84c]/30 p-2.5 rounded">
            <span className="text-[0.6rem] text-[#c9a84c] block uppercase tracking-wider">Status</span>
            <span className="text-[#a4f0b2] font-semibold">Survived & Immortalized</span>
          </div>
        </div>

        {/* Saknussemm Runic Seal */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full border border-[#c9a84c] flex items-center justify-center bg-[#211107] text-[#c9a84c] text-xl font-['Cinzel_Decorative']">
            ᛊ
          </div>
          <div className="text-left font-['Cinzel']">
            <p className="text-[0.7rem] font-bold text-[#c9a84c] tracking-wider uppercase">Arne Saknussemm</p>
            <p className="text-[0.6rem] text-[#a4917a] italic">Alchemist & First Explorer</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={handleCopy}
            className="px-4 py-2 border border-[#c9a84c] bg-[#c9a84c]/20 hover:bg-[#c9a84c]/40 text-[#f5ebd2] rounded text-xs font-['Cinzel'] tracking-widest uppercase flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(201,168,76,0.2)]"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-[#c9a84c]" />}
            <span>{copied ? 'Dispatch Copied!' : 'Copy Dispatch'}</span>
          </button>

          <button
            onClick={handleConfetti}
            className="px-4 py-2 border border-[#c9a84c]/50 hover:border-[#c9a84c] bg-[#1a120b] hover:bg-[#281a10] text-[#f5ebd2] rounded text-xs font-['Cinzel'] tracking-widest uppercase flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-4 h-4 text-[#c9a84c]" />
            <span>Celebrate</span>
          </button>
        </div>

      </div>
    </div>
  );
}
