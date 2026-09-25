# Saknussemm 🧭🌋

> *"Descend, bold traveler, into the crater of the jökull of Snæfells, which the shadow of Scartaris caresses before the calends of July, and you will reach the center of the earth. I have done it. — Arne Saknussemm."*

An immersive, scroll-driven subterranean exploration web experience created as a tribute to Jules Verne’s legendary 1864 masterpiece, **"A Journey to the Center of the Earth"** (*Voyage au centre de la Terre*).

---

## 🌌 Experience Overview

**Saknussemm** invites the traveler to embark on an atmospheric descent through the hollowed arteries of the planet. Guided only by a flickering lantern, the explorer journeys from the study in Hamburg to the crater of Snæfellsjökull, plunging tens of kilometers through granite fissures, bioluminescent mushroom forests, and subterranean oceans, before being violently ejected through the volcanic mouth of Stromboli.

---

## ✨ Features

- **2.5D Generative Cavern Tunnel Engine (`Canvas 2D`)**:
  - Concentric jagged rock strata rings projected with perspective depth, expanding dynamically outward as you scroll downward.
  - Organic cavern silhouettes synthesizing stalactites, rugged fissures, and cathedral-like vaulted ceilings.
  - 3D-to-2D projected atmospheric particles (ambient dust, glowing spores, and magma embers) rushing toward the viewer.
- **Dynamic Biome Color Transitions**:
  - Real-time environmental palette shifting across 8 geological depths (glacier slate $\rightarrow$ granite chasm $\rightarrow$ phosphorescent fungi $\rightarrow$ Lidenbrock sea $\rightarrow$ molten magma).
- **Interactive Adventurer's Lantern**:
  - The cursor acts as a lantern light source, illuminating uneven rock strata, revealing hidden runic carvings, and gently tilting the cavern's vanishing point for head-tracking parallax.
- **Procedural Web Audio Soundscape**:
  - Synthesized via the native Web Audio API without heavy external audio files:
    - Sub-bass tectonic drone (A1 / 55 Hz descending to 28 Hz rumbles).
    - Subterranean wind noise generator with depth-reactive bandpass filtering.
    - Cavern water droplets and crystalline acoustic echoes.
- **Narrative Checkpoints & Visual Choreography**:
  - 8 distinct story milestones featuring animated classical engravings, micro-scroll parallax vectors, and rich literary prose.
- **Expedition Journal & Runic Cipher**:
  - Interactive field notes modal recording discoveries at each depth.
  - Fully interactive Runic Cipher Decoder allowing travelers to decipher Saknussemm's ancient Icelandic cryptograms.

---

## 🗺️ The Eight Strata

| ID | Depth | Location | Atmosphere |
|:---:|:---:|:---|:---|
| **0** | `0 km` | **The Book of Echoes** | Weathered parchment, dusty library study in Hamburg |
| **1** | `0 km` | **Shadows of the Past** | Runic cryptogram and Saknussemm's parchment reveal |
| **2** | `−1.5 km` | **Scartaris Pointing** | The frozen basalt crater mouth of Snæfellsjökull, Iceland |
| **3** | `−30 km` | **The Whispering Gallery** | Cold granite chasm and acoustic echo chambers |
| **4** | `−60 km` | **The Sea of Mushrooms** | Towering pale fungi and bioluminescent subterranean flora |
| **5** | `−80 km` | **The Lidenbrock Sea** | Vast subterranean ocean under a living rock vault |
| **6** | `−40 km` | **The Leviathan Duel** | Churning primordial combat between ancient sea monsters |
| **7** | `0 km` | **The Ascent of Stromboli** | Blinding magma surge and volcanic eruption into the Mediterranean |
| **8** | `0 km` | **Epilogue** | Emergence into sunlight, forever changed by the abyss |

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Smooth Virtual Scroll**: [Lenis](https://github.com/darkroomengineering/lenis)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Animation Choreography**: [GSAP](https://greensock.com/gsap/) & [Motion](https://motion.dev/)
- **Audio Engine**: Pure [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) (procedural synthesis)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/devpryan7792/saknussemm.git
   cd saknussemm
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to begin the descent.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📜 License

Inspired by Jules Verne's *Voyage au centre de la Terre* (1864).
Open source under the [MIT License](LICENSE).
