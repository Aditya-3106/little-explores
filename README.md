# Little Explorers • खेळून शिका 🎈

> **Final Product Requirements Document (PRD) v2.0 Implementation**  
> Early Childhood Education / EdTech platform for Nursery and LKG children (3–5 years) and their parents.  
> Supports **English** and **Marathi** with guided play, educational games, puzzles, stories, and offline activities.

---

## 🌟 Key Architecture & Highlights

### 1. Reusable Activity Engine
- **Extensible Activity Registry** (`src/js/activities/activity-registry.js`)
- **18 Interactive Templates Implemented**:
  - `ACT-01`: Tap and Select
  - `ACT-02`: Listen and Choose
  - `ACT-03`: Drag and Drop (with tap-to-move fallback)
  - `ACT-04`: Matching Pairs
  - `ACT-05`: Count and Collect
  - `ACT-06`: Sorting Game
  - `ACT-07`: Complete the Pattern
  - `ACT-08`: Number Sequence
  - `ACT-09`: Picture Sequence
  - `ACT-10`: Find the Difference
  - `ACT-11`: Memory Match
  - `ACT-12`: Shadow Matching
  - `ACT-13`: Missing Piece Puzzle
  - `ACT-14`: Picture Puzzle (2x2 Jigsaw)
  - `ACT-15`: Story and Respond
  - `ACT-16`: Trace and Draw (HTML5 Canvas)
  - `ACT-17`: Colour and Create (Palette Canvas)
  - `ACT-18`: Explore and Discover (Interactive hotspots)

### 2. Child Learning Playground (`play.html`)
- **Six Learning Worlds**:
  1. 🔤 **Letter Land** (Language and Literacy)
  2. 🔢 **Number Town** (Early Mathematics)
  3. 🔷 **Shape Garden** (Shapes and Patterns)
  4. 🐾 **Animal World** (Environment and General Awareness)
  5. 🧩 **Puzzle Planet** (Logical Thinking & Memory)
  6. 💛 **Feelings & Friends** (Socio-Emotional Development)
- **Milo the Mascot**: Expressive inline SVG animations, hints, and friendly celebrations.
- **Child-Friendly Feedback**: Non-punitive, positive reinforcement, no negative labels or lost lives.

### 3. Parent Studio (`parent.html`)
- **Parent Access Gate**: 4-digit PIN protection with cognitive math challenge fallback.
- **10-Step Question Creator Wizard**:
  - Step 1: Learning Group (Nursery / LKG / Both)
  - Step 2: Learning Domain (Literacy, Numeracy, Spatial, Nature, Cognitive, Social)
  - Step 3: Learning Objective (Curriculum or custom parent objective)
  - Step 4: Activity Type selection
  - Step 5: Dynamic Question Content (rendered directly by template editor)
  - Step 6: Bilingual Content (English + Marathi)
  - Step 7: Media Management (Images & Audio)
  - Step 8: Hints & Encouragements
  - Step 9: Child Mode Live Preview
  - Step 10: Save Draft or Publish to Family Playground
- **Content Management**: Search, filter, duplicate, edit, delete, and group into themed collections.
- **JSON Import / Export**: Safe schema-validated import without executable code injection.
- **Progress Report**: Holistic tracking with real-world offline home activity suggestions.

### 4. Storage & Offline Persistence
- **IndexedDB**: Local database (`little-explorers-db`) storing activities, collections, child profiles, history, and progress.
- **Zero Advertising & DPDP Act 2023 Compliance**: Minimal child profile data (nickname only), no voice recording, no location tracking.

---

## 🚀 How to Run Locally

You can serve the application using any static HTTP server or open directly:

### Option A: Using Python built-in server
```bash
python -m http.server 3000
```
Then visit:
- **Landing Page**: `http://localhost:3000/index.html`
- **Child Playground**: `http://localhost:3000/play.html`
- **Parent Studio**: `http://localhost:3000/parent.html`

### Option B: Using Node http-server (when Node.js is installed)
```bash
npx http-server . -p 3000 -o
```

---

## 📂 Project Directory Structure

```text
LKG/
├── index.html                   # Public introduction & landing page
├── play.html                    # Child Learning Playground SPA
├── parent.html                  # Parent Studio SPA
├── privacy.html                 # Privacy policy & child safety
├── manifest.json                # PWA manifest
├── package.json                 # Project configuration
├── data/
│   ├── activity-schemas/        # Validation schemas for all 18 types
│   ├── learning-domains/        # NCF-FS 2022 developmental domain mappings
│   └── seed-activities/         # Bilingual default seed activities for 6 worlds
└── src/
    ├── css/input.css            # Tailwind CSS source
    └── js/
        ├── app.js               # Main bootstrap, router & lifecycle
        ├── activities/          # Activity Engine & 18 template implementations
        ├── child/               # Milo mascot, worlds, sessions, feedback
        ├── parent/              # Question wizard, library, collections, progress
        ├── core/                # Config, router, event bus, reactive state
        ├── i18n/                # Language manager, English & Marathi dictionaries
        ├── learning/            # Hints, progression, offline recommendations
        ├── storage/             # IndexedDB adapter, cloud adapter, repositories
        └── utils/               # DOM helpers, audio/TTS, media, validation
```

