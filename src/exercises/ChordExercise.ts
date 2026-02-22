import type { Exercise } from './types'
import { randomNote, applyInterval } from '@/audio/noteUtils'
import { playChord } from '@/audio/AudioEngine'

export interface ChordQuestion {
  root: string
  notes: string[]
  quality: string
}

const CHORDS: Record<string, number[]> = {
  Major: [0, 4, 7],
  Minor: [0, 3, 7],
  Diminished: [0, 3, 6],
  Augmented: [0, 4, 8],
  'Sus2': [0, 2, 7],
  'Sus4': [0, 5, 7],
  'Dom7': [0, 4, 7, 10],
  'Maj7': [0, 4, 7, 11],
  'Min7': [0, 3, 7, 10],
  'Dim7': [0, 3, 6, 9],
}

function optionsByDifficulty(difficulty: 1 | 2 | 3): string[] {
  if (difficulty === 1) return ['Major', 'Minor']
  if (difficulty === 2) return ['Major', 'Minor', 'Diminished', 'Augmented', 'Sus2', 'Sus4']
  return Object.keys(CHORDS)
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export const ChordExercise: Exercise<ChordQuestion> = {
  generate(difficulty) {
    const available = optionsByDifficulty(difficulty)
    const quality = pick(available)
    const root = randomNote('C3', 'G4')
    const intervals = CHORDS[quality]
    const notes = intervals.map((s) => applyInterval(root, s))
    void playChord(notes, '2n')
    return { root, notes, quality }
  },

  check(question, answer) {
    return question.quality === answer
  },

  hint(question) {
    return `Root note: ${question.root}`
  },

  options(_question, difficulty) {
    return optionsByDifficulty(difficulty)
  },
}
