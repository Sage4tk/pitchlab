import { randomNote, applyInterval } from '@/audio/noteUtils'
import { playChord } from '@/audio/AudioEngine'
import { useSpacedRepStore, weightedPick } from '@/store/useSpacedRepStore'

export interface ChordQuestion {
  root: string
  notes: string[]
  quality: string
  inversion: number
}

export const INVERSION_LABELS: Record<number, string> = {
  0: '',
  1: '1st inv.',
  2: '2nd inv.',
  3: '3rd inv.',
}

function applyInversion(notes: string[], inversion: number): string[] {
  const result = [...notes]
  for (let i = 0; i < inversion; i++) {
    const bottom = result.shift()!
    result.push(applyInterval(bottom, 12))
  }
  return result
}

export const CHORDS: Record<string, number[]> = {
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

export const ChordExercise = {
  generate(difficulty: 1 | 2 | 3, includeInversions = false) {
    const available = optionsByDifficulty(difficulty)
    const { getWeights } = useSpacedRepStore.getState()
    const weights = getWeights('chord', available)
    const quality = weightedPick(available, weights)
    const root = randomNote('C3', 'G4')
    const intervals = CHORDS[quality]
    const rootNotes = intervals.map((s) => applyInterval(root, s))
    const maxInversion = rootNotes.length - 1
    const inversion = includeInversions ? Math.floor(Math.random() * (maxInversion + 1)) : 0
    const notes = applyInversion(rootNotes, inversion)
    void playChord(notes, '2n')
    return { root, notes, quality, inversion }
  },

  check(question: ChordQuestion, answer: string) {
    return question.quality === answer
  },

  hint(question: ChordQuestion) {
    return `Root note: ${question.root}`
  },

  options(_question: ChordQuestion, difficulty: 1 | 2 | 3) {
    return optionsByDifficulty(difficulty)
  },
}
