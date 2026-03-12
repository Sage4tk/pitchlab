export interface PitchMatchQuestion {
  targetNote: string
  targetFreq: number
}

const POOL_D1 = ['C4', 'D4', 'E4', 'G4', 'A4']
const POOL_D2 = [
  'C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3',
  'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4',
]
const POOL_D3 = [
  'C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3',
  'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4',
  'C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5',
]

export function noteToFreq(note: string): number {
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  const match = note.match(/^([A-G]#?)(\d)$/)
  if (!match) return 440
  const [, name, octStr] = match
  const octave = parseInt(octStr)
  const semitone = noteNames.indexOf(name)
  const midi = (octave + 1) * 12 + semitone
  return 440 * Math.pow(2, (midi - 69) / 12)
}

export const PitchMatchExercise = {
  generate(difficulty: 1 | 2 | 3): PitchMatchQuestion {
    const pool = difficulty === 1 ? POOL_D1 : difficulty === 2 ? POOL_D2 : POOL_D3
    const targetNote = pool[Math.floor(Math.random() * pool.length)]
    return { targetNote, targetFreq: noteToFreq(targetNote) }
  },

  check(targetNote: string, detectedNote: string | null, detectedCents: number): boolean {
    if (!detectedNote) return false
    const targetName = targetNote.replace(/\d/, '')
    const detectedName = detectedNote.replace(/\d/, '')
    return targetName === detectedName && Math.abs(detectedCents) <= 25
  },
}
