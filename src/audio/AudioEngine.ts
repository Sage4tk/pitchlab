import * as Tone from 'tone'

export type SoundPreset = OscillatorType | 'piano' | 'guitar'

let currentPreset: SoundPreset = 'triangle'
let polySynth: Tone.PolySynth | null = null

// Pool of PluckSynths for guitar polyphony
const PLUCK_POOL_SIZE = 6
let pluckPool: Tone.PluckSynth[] = []
let pluckIndex = 0

function getPolySynth(): Tone.PolySynth {
  if (!polySynth) {
    if (currentPreset === 'piano') {
      polySynth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.002, decay: 0.4, sustain: 0.05, release: 1.5 },
      }).toDestination()
    } else {
      polySynth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: currentPreset as OscillatorType },
        envelope: { attack: 0.02, decay: 0.1, sustain: 0.5, release: 0.8 },
      }).toDestination()
    }
  }
  return polySynth
}

function getNextPluck(): Tone.PluckSynth {
  if (pluckPool.length === 0) {
    for (let i = 0; i < PLUCK_POOL_SIZE; i++) {
      pluckPool.push(
        new Tone.PluckSynth({ attackNoise: 1, dampening: 4000, resonance: 0.98 }).toDestination()
      )
    }
  }
  const p = pluckPool[pluckIndex % PLUCK_POOL_SIZE]
  pluckIndex++
  return p
}

function isGuitar(): boolean {
  return currentPreset === 'guitar'
}

export async function playNote(note: string, duration = '2n'): Promise<void> {
  await Tone.start()
  if (isGuitar()) {
    getNextPluck().triggerAttack(note, Tone.now())
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
      getNextPluck().triggerAttack(note, now + i * 0.03) // strum effect
    })
  } else {
    getPolySynth().triggerAttackRelease(notes, duration)
  }
}

export async function playMelody(notes: string[], bpm = 120): Promise<void> {
  await Tone.start()
  Tone.getTransport().bpm.value = bpm
  const now = Tone.now()
  const beatDuration = 60 / bpm
  if (isGuitar()) {
    notes.forEach((note, i) => {
      getNextPluck().triggerAttack(note, now + i * beatDuration)
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
  } else {
    const s = getPolySynth()
    pattern.forEach((hit, i) => {
      if (hit) s.triggerAttackRelease('C3', '8n', now + i * beatDuration)
    })
  }
}

export function setSoundPreset(preset: SoundPreset): void {
  currentPreset = preset
  if (polySynth) {
    polySynth.dispose()
    polySynth = null
  }
  if (pluckPool.length > 0) {
    pluckPool.forEach((p) => p.dispose())
    pluckPool = []
    pluckIndex = 0
  }
}
