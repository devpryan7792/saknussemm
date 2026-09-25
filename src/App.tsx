import React, { useState } from 'react';
import { ScrollProvider } from './context/ScrollContext';
import { TunnelCavern2D } from './components/scene2d/TunnelCavern2D';
import { HUD } from './components/ui/HUD';
import { useSyntheticSoundscape } from './hooks/useSyntheticSoundscape';
import { VelvetFade } from './components/ui/VelvetFade';
import { CustomCursor } from './components/ui/CustomCursor';
import { CheckpointOverlay } from './components/checkpoints/CheckpointOverlay';
import { ProgressBar } from './components/ui/ProgressBar';
import { StartScreen } from './components/ui/StartScreen';
import { ExpeditionJournal } from './components/ui/ExpeditionJournal';
import { RunicCipherDecoder } from './components/ui/RunicCipherDecoder';
import { ExpeditionCertificate } from './components/ui/ExpeditionCertificate';
import { MobileGateScreen } from './components/ui/MobileGateScreen';
import { useScrollStore } from './store/useScrollStore';
import { CHECKPOINTS } from './data/checkpoints';
import './App.css';

// Proportional snap heights ensuring every checkpoint locks precisely into optimal view
const CHECKPOINT_SNAP_HEIGHTS: Record<number, number> = {
  0: 140, // Checkpoint 0: Library / The Book of Echoes
  1: 108, // Checkpoint 1: Study / Shadows of the Past
  2: 104, // Checkpoint 2: Iceland / Scartaris Pointing
  3: 96,  // Checkpoint 3: Whispering Gallery / Tunnels
  4: 96,  // Checkpoint 4: Sea of Mushrooms
  5: 96,  // Checkpoint 5: The Lidenbrock Sea
  6: 84,  // Checkpoint 6: Leviathan Duel
  7: 76,  // Checkpoint 7: The Ascent of Stromboli
  8: 100, // Checkpoint 8: Epilogue
};

function SoundscapeRunner({ started }: { started: boolean }) {
  useSyntheticSoundscape(started);
  return null;
}

function AppContent({ started }: { started: boolean }) {
  const isCertificateOpen = useScrollStore((state) => state.isCertificateOpen);
  const setCertificateOpen = useScrollStore((state) => state.setCertificateOpen);

  return (
    <>
      {started && <SoundscapeRunner started={started} />}

      {/* 2.5D Generative Subterranean Tunnel & Cavern Canvas Engine */}
      <TunnelCavern2D />

      <div className="app-container relative bg-transparent min-h-screen text-white overflow-x-hidden selection:bg-white/30 z-10 w-full pointer-events-none">
        <VelvetFade />

        {/* 2D CSS Scroll-Snap Track for Eight Geological Checkpoints */}
        <div
          id="scroll-track"
          className="scroll-track"
          style={{
            position: 'relative',
            height: '900vh',
            width: '100%',
            pointerEvents: started ? 'auto' : 'none',
          }}
        >
          {CHECKPOINTS.map((cp) => {
            const heightVh = CHECKPOINT_SNAP_HEIGHTS[cp.id] ?? 100;
            return (
              <section
                key={`checkpoint-snap-${cp.id}`}
                id={`checkpoint-snap-${cp.id}`}
                className="checkpoint-snap-section"
                data-checkpoint-id={cp.id}
                data-checkpoint-title={cp.card?.title || cp.envLabel}
                style={{
                  height: `${heightVh}vh`,
                }}
              >
                <div
                  className="checkpoint-snap-anchor"
                  data-checkpoint={cp.id}
                />
              </section>
            );
          })}
        </div>

        <div className="fixed inset-0 pointer-events-none z-50">
          <ProgressBar />

          <div className="pointer-events-auto">
            <HUD />
          </div>

          <CheckpointOverlay />

          {/* Interactive Modal Engines */}
          <ExpeditionJournal />
          <RunicCipherDecoder />
          <ExpeditionCertificate
            isOpen={isCertificateOpen}
            onClose={() => setCertificateOpen(false)}
          />
        </div>
      </div>
    </>
  );
}

function App() {
  const [started, setStarted] = useState(false);

  return (
    <ScrollProvider>
      <MobileGateScreen />
      <StartScreen started={started} onStart={() => setStarted(true)} />
      <AppContent started={started} />
      <CustomCursor />
    </ScrollProvider>
  );
}

export default App;
