import * as Tone from "tone";

export type SoundPreset = OscillatorType | "piano" | "guitar";

let currentPreset: SoundPreset = "piano";

// ── Synth (oscillator presets) ──────────────────────────────────────────────
let polySynth: Tone.PolySynth | null = null;

function getPolySynth(): Tone.PolySynth {
  if (!polySynth) {
    polySynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: currentPreset as OscillatorType },
      envelope: { attack: 0.02, decay: 0.1, sustain: 0.5, release: 0.8 },
    }).toDestination();
  }
  return polySynth;
}

// ── Piano (Salamander Grand Piano samples) ───────────────────────────────────
let pianoSampler: Tone.Sampler | null = null;
let pianoReady = false;
let pianoFailed = false;
let pianoReadyCbs: (() => void)[] = [];
let pianoErrorCbs: (() => void)[] = [];
let pianoLoadTimeout: ReturnType<typeof setTimeout> | null = null;

function firePianoError() {
  if (pianoLoadTimeout) {
    clearTimeout(pianoLoadTimeout);
    pianoLoadTimeout = null;
  }
  pianoFailed = true;
  pianoErrorCbs.forEach((cb) => cb());
  pianoErrorCbs = [];
  pianoReadyCbs = [];
}

function getPianoSampler(): Tone.Sampler {
  if (!pianoSampler) {
    pianoReady = false;
    pianoFailed = false;
    pianoSampler = new Tone.Sampler({
      urls: {
        A0: "A0.mp3",
        C1: "C1.mp3",
        "F#1": "Fs1.mp3",
        A1: "A1.mp3",
        C2: "C2.mp3",
        "F#2": "Fs2.mp3",
        A2: "A2.mp3",
        C3: "C3.mp3",
        "F#3": "Fs3.mp3",
        A3: "A3.mp3",
        C4: "C4.mp3",
        "F#4": "Fs4.mp3",
        A4: "A4.mp3",
        C5: "C5.mp3",
        "F#5": "Fs5.mp3",
        A5: "A5.mp3",
        C6: "C6.mp3",
        "F#6": "Fs6.mp3",
        A6: "A6.mp3",
        C7: "C7.mp3",
        "F#7": "Fs7.mp3",
        A7: "A7.mp3",
        C8: "C8.mp3",
      },
      baseUrl: "/samples/salamander/",
      onload() {
        if (pianoLoadTimeout) {
          clearTimeout(pianoLoadTimeout);
          pianoLoadTimeout = null;
        }
        pianoReady = true;
        pianoReadyCbs.forEach((cb) => cb());
        pianoReadyCbs = [];
      },
      onerror() {
        firePianoError();
      },
    }).toDestination();

    // 15-second timeout fallback
    pianoLoadTimeout = setTimeout(() => {
      if (!pianoReady) firePianoError();
    }, 15000);
  }
  return pianoSampler;
}

export function isPianoReady(): boolean {
  return pianoReady;
}
export function isPianoFailed(): boolean {
  return pianoFailed;
}

export function onPianoReady(cb: () => void): () => void {
  if (pianoReady) {
    cb();
    return () => {};
  }
  pianoReadyCbs.push(cb);
  return () => {
    const idx = pianoReadyCbs.indexOf(cb);
    if (idx >= 0) pianoReadyCbs.splice(idx, 1);
  };
}

export function onPianoError(cb: () => void): () => void {
  if (pianoFailed) {
    cb();
    return () => {};
  }
  pianoErrorCbs.push(cb);
  return () => {
    const idx = pianoErrorCbs.indexOf(cb);
    if (idx >= 0) pianoErrorCbs.splice(idx, 1);
  };
}

export function preloadPiano(): void {
  getPianoSampler(); // triggers lazy init + async sample loading
}

// ── Guitar (real sample via Sampler) ─────────────────────────────────────────
let guitarSampler: Tone.Sampler | null = null;
let guitarReady = false;
let guitarReadyCbs: (() => void)[] = [];

function getGuitarSampler(): Tone.Sampler {
  if (!guitarSampler) {
    guitarReady = false;
    guitarSampler = new Tone.Sampler({
      urls: { C4: "guitar-sample.wav" },
      baseUrl: "/samples/",
      onload() {
        guitarReady = true;
        guitarReadyCbs.forEach((cb) => cb());
        guitarReadyCbs = [];
      },
    }).toDestination();
  }
  return guitarSampler;
}

export function isGuitarReady(): boolean {
  return guitarReady;
}

export function onGuitarReady(cb: () => void): () => void {
  if (guitarReady) {
    cb();
    return () => {};
  }
  guitarReadyCbs.push(cb);
  return () => {
    const idx = guitarReadyCbs.indexOf(cb);
    if (idx >= 0) guitarReadyCbs.splice(idx, 1);
  };
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function isPiano(): boolean {
  return currentPreset === "piano";
}
function isGuitar(): boolean {
  return currentPreset === "guitar";
}

export function preloadGuitar(): void {
  getGuitarSampler();
}

// ── Public API ───────────────────────────────────────────────────────────────
export async function playNote(note: string, duration = "2n"): Promise<void> {
  await Tone.start();
  if (isGuitar()) {
    getGuitarSampler().triggerAttackRelease(note, duration);
  } else if (isPiano()) {
    getPianoSampler().triggerAttackRelease(note, duration);
  } else {
    getPolySynth().triggerAttackRelease(note, duration);
  }
}

export async function playInterval(
  root: string,
  target: string,
  duration = "4n",
): Promise<void> {
  await Tone.start();
  const now = Tone.now();
  const durationSec = Tone.Time(duration).toSeconds();
  if (isGuitar()) {
    const g = getGuitarSampler();
    g.triggerAttackRelease(root, duration, now);
    g.triggerAttackRelease(target, duration, now + durationSec);
  } else if (isPiano()) {
    const s = getPianoSampler();
    s.triggerAttackRelease(root, duration, now);
    s.triggerAttackRelease(target, duration, now + durationSec);
  } else {
    const s = getPolySynth();
    s.triggerAttackRelease(root, duration, now);
    s.triggerAttackRelease(target, duration, now + durationSec);
  }
}

export async function playChord(
  notes: string[],
  duration = "2n",
): Promise<void> {
  await Tone.start();
  if (isGuitar()) {
    const now = Tone.now();
    const g = getGuitarSampler();
    notes.forEach((note, i) => {
      g.triggerAttackRelease(note, duration, now + i * 0.04); // strum
    });
  } else if (isPiano()) {
    getPianoSampler().triggerAttackRelease(notes, duration);
  } else {
    getPolySynth().triggerAttackRelease(notes, duration);
  }
}

export async function playMelody(notes: string[], bpm = 120): Promise<void> {
  await Tone.start();
  const now = Tone.now();
  const beatDuration = 60 / bpm;
  if (isGuitar()) {
    const g = getGuitarSampler();
    notes.forEach((note, i) => {
      g.triggerAttackRelease(note, "4n", now + i * beatDuration);
    });
  } else if (isPiano()) {
    const s = getPianoSampler();
    notes.forEach((note, i) => {
      s.triggerAttackRelease(note, "4n", now + i * beatDuration);
    });
  } else {
    const s = getPolySynth();
    notes.forEach((note, i) => {
      s.triggerAttackRelease(note, "4n", now + i * beatDuration);
    });
  }
}

export async function playRhythm(pattern: boolean[], bpm = 80): Promise<void> {
  await Tone.start();
  const beatDuration = 60 / bpm;
  const now = Tone.now();
  if (isGuitar()) {
    const g = getGuitarSampler();
    pattern.forEach((hit, i) => {
      if (hit) g.triggerAttackRelease("C3", "8n", now + i * beatDuration);
    });
  } else if (isPiano()) {
    const s = getPianoSampler();
    pattern.forEach((hit, i) => {
      if (hit) s.triggerAttackRelease("C3", "8n", now + i * beatDuration);
    });
  } else {
    const s = getPolySynth();
    pattern.forEach((hit, i) => {
      if (hit) s.triggerAttackRelease("C3", "8n", now + i * beatDuration);
    });
  }
}

export async function playChordProgression(
  chordNotes: string[][],
  bpm = 70,
): Promise<void> {
  await Tone.start();
  const now = Tone.now();
  const beatDuration = (60 / bpm) * 2; // 2 beats per chord
  if (isGuitar()) {
    const g = getGuitarSampler();
    chordNotes.forEach((notes, i) => {
      const startTime = now + i * beatDuration;
      notes.forEach((note, j) => {
        g.triggerAttackRelease(note, "2n", startTime + j * 0.04);
      });
    });
  } else if (isPiano()) {
    const s = getPianoSampler();
    chordNotes.forEach((notes, i) => {
      s.triggerAttackRelease(notes, "2n", now + i * beatDuration);
    });
  } else {
    const s = getPolySynth();
    chordNotes.forEach((notes, i) => {
      s.triggerAttackRelease(notes, "2n", now + i * beatDuration);
    });
  }
}

export function setSoundPreset(preset: SoundPreset): void {
  currentPreset = preset;
  if (polySynth) {
    polySynth.dispose();
    polySynth = null;
  }
  if (pianoSampler) {
    if (pianoLoadTimeout) {
      clearTimeout(pianoLoadTimeout);
      pianoLoadTimeout = null;
    }
    pianoSampler.dispose();
    pianoSampler = null;
    pianoReady = false;
    pianoFailed = false;
    pianoReadyCbs = [];
    pianoErrorCbs = [];
  }
  if (guitarSampler) {
    guitarSampler.dispose();
    guitarSampler = null;
    guitarReady = false;
    guitarReadyCbs = [];
  }
  if (preset === "piano") getPianoSampler();
  if (preset === "guitar") getGuitarSampler();
}
