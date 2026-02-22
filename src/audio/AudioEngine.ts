import * as Tone from 'tone'

let synth: Tone.PolySynth | null = null

function getSynth(): Tone.PolySynth {
  if (!synth) {
    synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.02, decay: 0.1, sustain: 0.5, release: 0.8 },
    }).toDestination()
  }
  return synth
}

export async function playNote(note: string, duration = '2n'): Promise<void> {
  await Tone.start()
  getSynth().triggerAttackRelease(note, duration)
}

export async function playInterval(root: string, target: string, duration = '4n'): Promise<void> {
  await Tone.start()
  const s = getSynth()
  const now = Tone.now()
  const durationSec = Tone.Time(duration).toSeconds()
  s.triggerAttackRelease(root, duration, now)
  s.triggerAttackRelease(target, duration, now + durationSec)
}

export async function playChord(notes: string[], duration = '2n'): Promise<void> {
  await Tone.start()
  getSynth().triggerAttackRelease(notes, duration)
}

export async function playMelody(notes: string[], bpm = 120): Promise<void> {
  await Tone.start()
  Tone.getTransport().bpm.value = bpm
  const s = getSynth()
  const now = Tone.now()
  const beatDuration = 60 / bpm
  notes.forEach((note, i) => {
    s.triggerAttackRelease(note, '4n', now + i * beatDuration)
  })
}

export async function playRhythm(pattern: boolean[], bpm = 80): Promise<void> {
  await Tone.start()
  const beatDuration = 60 / bpm
  const now = Tone.now()
  const s = getSynth()
  pattern.forEach((hit, i) => {
    if (hit) {
      s.triggerAttackRelease('C3', '8n', now + i * beatDuration)
    }
  })
}

export function setSynthType(type: OscillatorType): void {
  synth = null // force recreation
  synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type },
    envelope: { attack: 0.02, decay: 0.1, sustain: 0.5, release: 0.8 },
  }).toDestination()
}
