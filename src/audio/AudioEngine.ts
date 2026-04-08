import * as Tone from 'tone'

export type SoundPreset = OscillatorType | 'piano' | 'guitar'

let currentPreset: SoundPreset = 'piano'

// ── Synth (oscillator presets) ──────────────────────────────────────────────
let polySynth: Tone.PolySynth | null = null

function getPolySynth(): Tone.PolySynth {
  if (!polySynth) {
    polySynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: currentPreset as OscillatorType },
      envelope: { attack: 0.02, decay: 0.1, sustain: 0.5, release: 0.8 },
    }).toDestination()
  }
  return polySynth
}

// ── Piano (Salamander Grand Piano samples) ───────────────────────────────────
let pianoSampler: Tone.Sampler | null = null
let pianoReady = false
let pianoReadyCbs: (() => void)[] = []

function getPianoSampler(): Tone.Sampler {
  if (!pianoSampler) {
    pianoReady = false
    pianoSampler = new Tone.Sampler({
      urls: {
        A0: 'A0.mp3',  C1: 'C1.mp3',  'F#1': 'Fs1.mp3',
        A1: 'A1.mp3',  C2: 'C2.mp3',  'F#2': 'Fs2.mp3',
        A2: 'A2.mp3',  C3: 'C3.mp3',  'F#3': 'Fs3.mp3',
        A3: 'A3.mp3',  C4: 'C4.mp3',  'F#4': 'Fs4.mp3',
        A4: 'A4.mp3',  C5: 'C5.mp3',  'F#5': 'Fs5.mp3',
        A5: 'A5.mp3',  C6: 'C6.mp3',  'F#6': 'Fs6.mp3',
        A6: 'A6.mp3',  C7: 'C7.mp3',  'F#7': 'Fs7.mp3',
        A7: 'A7.mp3',  C8: 'C8.mp3',
      },
      baseUrl: 'https://tonejs.github.io/audio/salamander/',
      onload() {
        pianoReady = true
        pianoReadyCbs.forEach((cb) => cb())
        pianoReadyCbs = []
      },
    }).toDestination()
  }
  return pianoSampler
}

export function isPianoReady(): boolean { return pianoReady }

export function onPianoReady(cb: () => void): () => void {
  if (pianoReady) { cb(); return () => {} }
  pianoReadyCbs.push(cb)
  return () => {
    const idx = pianoReadyCbs.indexOf(cb)
    if (idx >= 0) pianoReadyCbs.splice(idx, 1)
  }
}

export function preloadPiano(): void {
  getPianoSampler() // triggers lazy init + async sample loading
}

// ── Guitar (PluckSynth pool + reverb) ────────────────────────────────────────
const PLUCK_POOL_SIZE = 6
let pluckPool: Tone.PluckSynth[] = []
let pluckIndex = 0
let guitarVerb: Tone.Freeverb | null = null

function getGuitarVerb(): Tone.Freeverb {
  if (!guitarVerb) {
    guitarVerb = new Tone.Freeverb({ roomSize: 0.35, dampening: 3500, wet: 0.28 }).toDestination()
  }
  return guitarVerb
}

function getNextPluck(): Tone.PluckSynth {
  if (pluckPool.length === 0) {
    const verb = getGuitarVerb()
    for (let i = 0; i < PLUCK_POOL_SIZE; i++) {
      pluckPool.push(
        new Tone.PluckSynth({ attackNoise: 1, dampening: 3200, resonance: 0.985 }).connect(verb)
      )
    }
  }
  const p = pluckPool[pluckIndex % PLUCK_POOL_SIZE]
  pluckIndex++
  return p
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function isPiano(): boolean { return currentPreset === 'piano' }
function isGuitar(): boolean { return currentPreset === 'guitar' }

// ── Public API ───────────────────────────────────────────────────────────────
export async function playNote(note: string, duration = '2n'): Promise<void> {
  await Tone.start()
  if (isGuitar()) {
    getNextPluck().triggerAttack(note, Tone.now())
  } else if (isPiano()) {
    getPianoSampler().triggerAttackRelease(note, duration)
  } else {
    getPolySynth().triggerAttackRelease(note, duration)
  }
}

export async function playInterval(root: string, target: string, duration = '4n'): Promise<void> {
  await Tone.start()
  const now = Tone.now()
  const durationSec = Tone.Time(duration).toSeconds()
  if (isGuitar()) {
    getNextPluck().triggerAttack(root, now)
    getNextPluck().triggerAttack(target, now + durationSec)
  } else if (isPiano()) {
    const s = getPianoSampler()
    s.triggerAttackRelease(root, duration, now)
    s.triggerAttackRelease(target, duration, now + durationSec)
  } else {
    const s = getPolySynth()
    s.triggerAttackRelease(root, duration, now)
    s.triggerAttackRelease(target, duration, now + durationSec)
  }
}

export async function playChord(notes: string[], duration = '2n'): Promise<void> {
  await Tone.start()
  if (isGuitar()) {
    const now = Tone.now()
    notes.forEach((note, i) => {
      getNextPluck().triggerAttack(note, now + i * 0.04) // strum
    })
  } else if (isPiano()) {
    getPianoSampler().triggerAttackRelease(notes, duration)
  } else {
    getPolySynth().triggerAttackRelease(notes, duration)
  }
}

export async function playMelody(notes: string[], bpm = 120): Promise<void> {
  await Tone.start()
  const now = Tone.now()
  const beatDuration = 60 / bpm
  if (isGuitar()) {
    notes.forEach((note, i) => {
      getNextPluck().triggerAttack(note, now + i * beatDuration)
    })
  } else if (isPiano()) {
    const s = getPianoSampler()
    notes.forEach((note, i) => {
      s.triggerAttackRelease(note, '4n', now + i * beatDuration)
    })
  } else {
    const s = getPolySynth()
    notes.forEach((note, i) => {
      s.triggerAttackRelease(note, '4n', now + i * beatDuration)
    })
  }
}

export async function playRhythm(pattern: boolean[], bpm = 80): Promise<void> {
  await Tone.start()
  const beatDuration = 60 / bpm
  const now = Tone.now()
  if (isGuitar()) {
    pattern.forEach((hit, i) => {
      if (hit) getNextPluck().triggerAttack('C3', now + i * beatDuration)
    })
  } else if (isPiano()) {
    const s = getPianoSampler()
    pattern.forEach((hit, i) => {
      if (hit) s.triggerAttackRelease('C3', '8n', now + i * beatDuration)
    })
  } else {
    const s = getPolySynth()
    pattern.forEach((hit, i) => {
      if (hit) s.triggerAttackRelease('C3', '8n', now + i * beatDuration)
    })
  }
}

export async function playChordProgression(chordNotes: string[][], bpm = 70): Promise<void> {
  await Tone.start()
  const now = Tone.now()
  const beatDuration = (60 / bpm) * 2 // 2 beats per chord
  if (isGuitar()) {
    chordNotes.forEach((notes, i) => {
      const startTime = now + i * beatDuration
      notes.forEach((note, j) => {
        getNextPluck().triggerAttack(note, startTime + j * 0.04)
      })
    })
  } else if (isPiano()) {
    const s = getPianoSampler()
    chordNotes.forEach((notes, i) => {
      s.triggerAttackRelease(notes, '2n', now + i * beatDuration)
    })
  } else {
    const s = getPolySynth()
    chordNotes.forEach((notes, i) => {
      s.triggerAttackRelease(notes, '2n', now + i * beatDuration)
    })
  }
}

export function setSoundPreset(preset: SoundPreset): void {
  currentPreset = preset
  if (polySynth) { polySynth.dispose(); polySynth = null }
  if (pianoSampler) { pianoSampler.dispose(); pianoSampler = null; pianoReady = false; pianoReadyCbs = [] }
  if (pluckPool.length > 0) {
    pluckPool.forEach((p) => p.dispose())
    pluckPool = []
    pluckIndex = 0
  }
  if (guitarVerb) { guitarVerb.dispose(); guitarVerb = null }
  if (preset === 'piano') getPianoSampler() // restart loading when switching back to piano
}
