# Pitchlab

An ear training web app for musicians. Practice identifying intervals, chords, melodies, and rhythms — with adaptive difficulty, progress tracking, and a daily streak system.

## Features

- **Intervals** — Identify the distance between two notes across all 13 interval types (m2 through P8). Difficulty 3 introduces descending intervals.
- **Chords** — Distinguish chord qualities (Major, Minor, Diminished, Augmented, Dominant 7th, and more) played as polyphonic audio.
- **Melody** — Transcribe short melodic phrases by clicking an interactive SVG piano keyboard. Correct notes are highlighted during feedback.
- **Rhythm** — Listen to a rhythmic pattern and tap along to reproduce it. Answers are quantized to the nearest subdivision before scoring.
- **Adaptive difficulty** — Three levels per exercise. The last 20 attempts per category are tracked; accuracy above 85% unlocks harder variants.
- **Daily streak** — Firestore tracks consecutive active days and all-time longest streak.
- **Progress page** — Radar chart of accuracy by category and a per-category accuracy-over-time line chart.
- **Settings** — Set default difficulty, synth type (triangle / sine / sawtooth), and key signature for melody exercises.

## Tech Stack

| Layer | Library |
|---|---|
| Framework | React 19 + TypeScript (strict) |
| Build | Vite 7 |
| UI | Chakra UI v3 + Framer Motion |
| Audio | Tone.js 15 (PolySynth) |
| State | Zustand |
| Auth | Firebase Auth (email/password + Google OAuth) |
| Database | Firestore (per-user subcollections) |
| Charts | Recharts |
| Routing | React Router v7 |

## Project Structure

```
src/
  main.tsx                    # Entry — ChakraProvider + ReactDOM
  App.tsx                     # BrowserRouter + all routes
  index.css                   # Minimal reset + Inter font
  pages/
    Landing.tsx               # Public homepage
    Login.tsx / Signup.tsx / ForgotPassword.tsx
    Dashboard.tsx             # Protected — exercise cards + streak badge
    Progress.tsx              # Protected — charts + streak stats
    Settings.tsx              # Protected — difficulty, synth, key
    exercises/
      Interval.tsx / Chord.tsx / Melody.tsx / Rhythm.tsx
  components/
    ProtectedRoute.tsx        # Reads useSession, redirects if no user
    Navbar.tsx                # Sticky nav — visible on protected pages only
    AuthForm.tsx              # Reusable email/password form
    GoogleButton.tsx          # Google OAuth button
    AnswerGrid.tsx            # Colour-coded answer buttons (correct/wrong/default)
    PlayButton.tsx            # Pulsing animated play circle (Framer Motion)
    PianoKeyboard.tsx         # SVG two-octave keyboard (C3–B4)
    ProgressRing.tsx          # SVG circular progress indicator
    RhythmPad.tsx             # Tap-to-record rhythm input
  hooks/
    useSession.ts             # onAuthStateChanged wrapper → { user, loading }
    useExercise.ts            # Exercise state machine: idle → answering → feedback
    useKeyboard.ts            # Number key shortcuts mapped to answer options
    useAudio.ts
  exercises/                  # Pure logic — no UI, no React
    types.ts                  # Exercise<TQuestion, TAnswer> interface + Attempt type
    IntervalExercise.ts
    ChordExercise.ts
    MelodyExercise.ts
    RhythmExercise.ts
  audio/
    AudioEngine.ts            # Tone.js PolySynth wrapper (playNote/Interval/Chord/Melody/Rhythm)
    noteUtils.ts              # randomNote, applyInterval helpers
  store/
    useExerciseStore.ts       # Zustand — difficulty, synthType, keySignature
    useProgressStore.ts       # Zustand — in-memory attempt history + getAccuracy()
  lib/
    firebase.ts               # initializeApp, exports auth/db
    firebaseAuth.ts           # signUp, signIn, signInWithGoogle, resetPassword, logOut
  db/
    progress.ts               # saveAttempt, getRecentAttempts (Firestore)
    streaks.ts                # updateStreak, getStreak (Firestore)
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Firebase

Create a project at [console.firebase.google.com](https://console.firebase.google.com), enable **Authentication** (Email/Password and Google providers) and **Firestore**, then add your config to `.env.local`:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### 3. Run the dev server

```bash
npm run dev
```

Opens at `http://localhost:5173` with hot module replacement.

## Commands

```bash
npm run dev       # Start dev server (HMR)
npm run build     # Type-check then bundle for production
npm run lint      # ESLint across all TS/TSX files
npm run preview   # Serve the production build locally
```

## Firestore Data Model

All data is scoped to the authenticated user:

```
/users/{userId}/
  progress/{docId}    # { category, difficulty, correct, answerMs, createdAt }
  streak/current      # { current, longest, lastSession }
```

## Audio

All audio goes through `AudioEngine.ts`, a thin wrapper around a shared Tone.js `PolySynth`. `Tone.start()` is called inside every play function to satisfy the browser autoplay policy — no separate user-gesture handling is needed in components. Each exercise's `generate()` method calls the appropriate play function immediately so audio plays the moment a question is created.

## Key Design Decisions

**Exercise logic is UI-free.** All four exercise types live in `src/exercises/` and implement the `Exercise<TQuestion, TAnswer>` interface (`generate`, `check`, `hint?`, `options`). Pages consume them through the `useExercise` hook which owns the state machine.

**Auth is component-level.** `ProtectedRoute` wraps protected routes in `App.tsx` and uses `useSession` (wrapping `onAuthStateChanged`) to gate access. No middleware or server-side checks.

**Tone.js bundle size.** The production bundle is large (~1.8 MB unminified) because Tone.js is heavyweight. This is expected. To reduce initial load, Tone.js can be code-split into a separate chunk via `build.rollupOptions.output.manualChunks` in `vite.config.ts`.
