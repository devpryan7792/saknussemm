import React, { useState, useEffect } from 'react';
import { Compass, Monitor, Smartphone, AlertTriangle, ArrowRight } from 'lucide-react';

export function MobileGateScreen() {
  const [isMobilePhone, setIsMobilePhone] = useState(false);
  const [bypassed, setBypassed] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const checkDimensions = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setDimensions({ width: w, height: h });

      // Threshold: Under 768px width is typically a phone in portrait
      // Tablets (iPad Mini / 768px+, iPad 810px+, laptops 1024px+) pass through
      if (w < 768) {
        setIsMobilePhone(true);
      } else {
        setIsMobilePhone(false);
      }
    };

    checkDimensions();
    window.addEventListener('resize', checkDimensions);
    return () => window.removeEventListener('resize', checkDimensions);
  }, []);

  if (!isMobilePhone || bypassed) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-[#080503] text-[#f2e6c9] overflow-hidden select-none">
      {/* Background vignette & ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,168,76,0.12)_0%,rgba(0,0,0,0.95)_75%)] pointer-events-none" />

      {/* Decorative runic border container */}
      <div className="relative w-full max-w-sm border border-[#c9a84c]/60 bg-[#0e0906]/95 backdrop-blur-xl rounded-lg p-7 text-center shadow-[0_0_60px_rgba(0,0,0,0.95),inset_0_0_30px_rgba(201,168,76,0.1)]">
        
        {/* Runic Corner accents */}
        <span className="absolute top-2 left-2 text-[#c9a84c]/40 font-['Cinzel_Decorative'] text-sm">ᛊ</span>
        <span className="absolute top-2 right-2 text-[#c9a84c]/40 font-['Cinzel_Decorative'] text-sm">ᚱ</span>
        <span className="absolute bottom-2 left-2 text-[#c9a84c]/40 font-['Cinzel_Decorative'] text-sm">ᚨ</span>
        <span className="absolute bottom-2 right-2 text-[#c9a84c]/40 font-['Cinzel_Decorative'] text-sm">ᚦ</span>

        {/* Animated Compass Seal */}
        <div className="w-16 h-16 rounded-full border border-[#c9a84c] flex items-center justify-center mx-auto mb-4 bg-[#18100a] shadow-[0_0_20px_rgba(201,168,76,0.25)]">
          <Compass className="w-8 h-8 text-[#c9a84c] animate-[spin_18s_linear_infinite]" />
        </div>

        {/* Headings */}
        <span className="font-['Cinzel'] text-[0.62rem] tracking-[0.3em] uppercase text-[#c9a84c] block mb-1">
          Subterranean Cartography Notice
        </span>
        <h2 className="font-['Cinzel'] text-xl font-bold tracking-wider text-[#f5ebd2] mb-3">
          DESKTOP / TABLET REQUIRED
        </h2>

        {/* Gold divider */}
        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent mx-auto mb-4" />

        {/* Thematic Message */}
        <p className="font-serif italic text-sm text-[#d4be9b] leading-relaxed mb-5">
          "Bold traveler, the depths of the Earth cannot be charted through so narrow a fissure. The acoustic resonance, 2.5D cavern perspective, and ancient runic ciphers require a broader horizon."
        </p>

        {/* Device Requirements Telemetry */}
        <div className="bg-[#140d08] border border-[#c9a84c]/30 rounded p-3 mb-5 text-left font-['Cinzel'] text-[0.7rem] space-y-1.5">
          <div className="flex items-center justify-between text-[#c9a84c]/80">
            <span className="flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Current Viewport</span>
            </span>
            <span className="text-[#e29388] font-mono">{dimensions.width} × {dimensions.height} px</span>
          </div>

          <div className="flex items-center justify-between text-[#c9a84c]/80">
            <span className="flex items-center gap-1.5">
              <Monitor className="w-3.5 h-3.5 text-[#c9a84c]" />
              <span>Required Canvas</span>
            </span>
            <span className="text-[#a4f0b2] font-mono">≥ 768 px (Tablet/Desktop)</span>
          </div>
        </div>

        {/* Recommendation tip */}
        <p className="font-sans text-[0.65rem] text-[#c9a84c]/70 tracking-wider uppercase mb-5">
          Please revisit on a Laptop, Desktop, or rotate to Tablet landscape mode.
        </p>

        {/* Optional Override button */}
        <button
          onClick={() => setBypassed(true)}
          className="w-full py-2 border border-[#c9a84c]/30 hover:border-[#c9a84c] bg-[#1a120b] hover:bg-[#281a10] text-[#c9a84c] hover:text-[#fff] text-[0.65rem] font-['Cinzel'] tracking-widest uppercase rounded flex items-center justify-center gap-1.5 transition-all"
        >
          <span>Proceed Anyway (Sub-Optimal)</span>
          <ArrowRight className="w-3 h-3" />
        </button>

      </div>
    </div>
  );
}
