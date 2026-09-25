import { useEffect, useRef } from 'react';
import { useScrollStore } from '../store/useScrollStore';

// Web Audio API Subterranean Generative Soundscape Engine
export function useSyntheticSoundscape(started = false) {
  const isMuted = useScrollStore((state) => state.isMuted);
  const audioCtxRef = useRef(null);
  const masterGainRef = useRef(null);
  const nodesRef = useRef({});
  const analyserRef = useRef(null);

  useEffect(() => {
    if (!started) return;

    // Initialize AudioContext on user interaction
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    audioCtxRef.current = ctx;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.connect(ctx.destination);
    masterGainRef.current = masterGain;

    // Analyser node for HUD waveform visualizer
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 64;
    masterGain.connect(analyser);
    analyserRef.current = analyser;
    window.__SUBTERRANEAN_ANALYSER__ = analyser;

    // 1. Deep Sub Drone (Continuous tectonic bass)
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(55, ctx.currentTime); // A1
    subGain.gain.setValueAtTime(0.12, ctx.currentTime);
    subOsc.connect(subGain);
    subGain.connect(masterGain);
    subOsc.start();

    // 2. Harmonic Ambient Resonator
    const chordOsc1 = ctx.createOscillator();
    const chordOsc2 = ctx.createOscillator();
    const chordGain = ctx.createGain();
    const chordFilter = ctx.createBiquadFilter();

    chordOsc1.type = 'triangle';
    chordOsc1.frequency.setValueAtTime(110, ctx.currentTime); // A2
    chordOsc2.type = 'sine';
    chordOsc2.frequency.setValueAtTime(164.81, ctx.currentTime); // E3

    chordFilter.type = 'lowpass';
    chordFilter.frequency.setValueAtTime(450, ctx.currentTime);

    chordGain.gain.setValueAtTime(0.08, ctx.currentTime);

    chordOsc1.connect(chordFilter);
    chordOsc2.connect(chordFilter);
    chordFilter.connect(chordGain);
    chordGain.connect(masterGain);

    chordOsc1.start();
    chordOsc2.start();

    // 3. Subterranean Wind Noise Generator
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(280, ctx.currentTime);
    noiseFilter.Q.setValueAtTime(3.0, ctx.currentTime);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.06, ctx.currentTime);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);
    whiteNoise.start();

    // 4. Periodic Cavern Water Drips / Crystal Echoes
    let dripInterval = setInterval(() => {
      if (ctx.state !== 'running' || masterGain.gain.value < 0.01) return;
      const progress = useScrollStore.getState().scrollProgress;
      if (progress < 0.25 || progress > 0.85) return;

      try {
        const dripOsc = ctx.createOscillator();
        const dripGain = ctx.createGain();
        const freq = 600 + Math.random() * 800;
        
        dripOsc.type = 'sine';
        dripOsc.frequency.setValueAtTime(freq, ctx.currentTime);
        dripOsc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.08);

        dripGain.gain.setValueAtTime(0.04, ctx.currentTime);
        dripGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);

        dripOsc.connect(dripGain);
        dripGain.connect(masterGain);

        dripOsc.start();
        dripOsc.stop(ctx.currentTime + 0.45);
      } catch (e) {
        // Ignore audio cleanup ticks
      }
    }, 2400);

    nodesRef.current = {
      ctx,
      masterGain,
      subOsc,
      subGain,
      chordOsc1,
      chordOsc2,
      chordFilter,
      noiseFilter,
      noiseGain,
      dripInterval,
    };

    return () => {
      clearInterval(dripInterval);
      try {
        ctx.close();
      } catch (e) {}
    };
  }, [started]);

  // Handle Mute & Master Volume
  useEffect(() => {
    if (!audioCtxRef.current || !masterGainRef.current) return;
    const ctx = audioCtxRef.current;
    
    if (ctx.state === 'suspended' && !isMuted) {
      ctx.resume();
    }

    const targetGain = isMuted ? 0 : 0.85;
    masterGainRef.current.gain.setTargetAtTime(targetGain, ctx.currentTime, 0.2);
  }, [isMuted]);

  // Dynamic Frequency Modulations based on Scroll Depth
  useEffect(() => {
    return useScrollStore.subscribe(
      (state) => state.scrollProgress,
      (p) => {
        const nodes = nodesRef.current;
        if (!nodes || !nodes.ctx) return;
        const ctx = nodes.ctx;
        const t = ctx.currentTime;

        try {
          // Adjust sub-bass frequency based on depth (rumbles deeper as we plunge)
          const targetSubFreq = 65 - p * 30; // 65Hz at surface -> 35Hz at core
          nodes.subOsc.frequency.setTargetAtTime(Math.max(28, targetSubFreq), t, 0.3);

          // Modulate chord frequency and filter
          if (p < 0.25) {
            // Library / Study: Warm harmonic resonance
            nodes.chordFilter.frequency.setTargetAtTime(600, t, 0.4);
            nodes.chordOsc1.frequency.setTargetAtTime(110, t, 0.4);
            nodes.chordOsc2.frequency.setTargetAtTime(164.81, t, 0.4);
            nodes.noiseFilter.frequency.setTargetAtTime(180, t, 0.4);
          } else if (p < 0.55) {
            // Caves & Tunnels: Hollow wind acoustics
            nodes.chordFilter.frequency.setTargetAtTime(320, t, 0.4);
            nodes.chordOsc1.frequency.setTargetAtTime(82.41, t, 0.4); // E2
            nodes.chordOsc2.frequency.setTargetAtTime(123.47, t, 0.4); // B2
            nodes.noiseFilter.frequency.setTargetAtTime(420, t, 0.4);
          } else if (p < 0.8) {
            // Lidenbrock Sea & Prehistoric: Crystalline marine shimmers
            nodes.chordFilter.frequency.setTargetAtTime(950, t, 0.4);
            nodes.chordOsc1.frequency.setTargetAtTime(130.81, t, 0.4); // C3
            nodes.chordOsc2.frequency.setTargetAtTime(196.00, t, 0.4); // G3
            nodes.noiseFilter.frequency.setTargetAtTime(560, t, 0.4);
          } else {
            // Stromboli / Magma: Deep volcanic friction & roar
            nodes.chordFilter.frequency.setTargetAtTime(220, t, 0.4);
            nodes.chordOsc1.frequency.setTargetAtTime(55, t, 0.4); // A1
            nodes.chordOsc2.frequency.setTargetAtTime(82.41, t, 0.4); // E2
            nodes.noiseFilter.frequency.setTargetAtTime(150, t, 0.4);
          }
        } catch (e) {}
      }
    );
  }, []);
}
