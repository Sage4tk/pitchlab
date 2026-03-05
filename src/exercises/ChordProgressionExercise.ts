import type { Exercise } from './types'
import { applyInterval, randomNote } from '@/audio/noteUtils'
import { playChordProgression } from '@/audio/AudioEngine'
import { useSpacedRepStore, weightedPick } from '@/store/useSpacedRepStore'

export interface ChordProgressionQuestion {
  key: string
  chords: { roman: string; notes: string[] }[]
  label: string
}

// Semitone offsets from key root for each diatonic triad
const DIATONIC_CHORDS: Record<string, number[]> = {
  'I':    [0, 4, 7],
  'ii':   [2, 5, 9],
  'iii':  [4, 7, 11],
  'IV':   [5, 9, 12],
  'V':    [7, 11, 14],
  'vi':   [9, 12, 16],
  'vii\u00B0': [11, 14, 17],
}

const EASY_PROGRESSIONS = [
  ['I', 'IV', 'V', 'I'],
  ['I', 'V', 'vi', 'IV'],
  ['I', 'vi', 'IV', 'V'],
  ['I', 'V', 'IV', 'I'],
]

const MEDIUM_PROGRESSIONS = [
  ['I', 'IV', 'V', 'I'],
  ['I', 'V', 'vi', 'IV'],
  ['I', 'vi', 'IV', 'V'],
  ['I', 'vi', 'ii', 'V'],
  ['vi', 'IV', 'I', 'V'],
  ['ii', 'V', 'I'],
]

const HARD_PROGRESSIONS = [
  ['I', 'V', 'vi', 'IV'],
  ['I', 'vi', 'ii', 'V'],
  ['vi', 'IV', 'I', 'V'],
  ['ii', 'V', 'I'],
  ['I', 'iii', 'vi', 'IV'],
  ['I', 'IV', 'vii\u00B0', 'iii'],
  ['vi', 'ii', 'V', 'I'],
  ['IV', 'V', 'iii', 'vi'],
]

function getPool(difficulty: 1 | 2 | 3): string[][] {
  if (difficulty === 1) return EASY_PROGRESSIONS
  if (difficulty === 2) return MEDIUM_PROGRESSIONS
  return HARD_PROGRESSIONS
}

function buildChordNotes(key: string, roman: string): string[] {
  const intervals = DIATONIC_CHORDS[roman]
  if (!intervals) throw new Error(`Unknown chord: ${roman}`)
  return intervals.map((s) => applyInterval(key, s))
}

function toLabel(progression: string[]): string {
  return progression.join(' \u2013 ')
}

export const ChordProgressionExercise: Exercise<ChordProgressionQuestion> = {
  generate(difficulty) {
    const pool = getPool(difficulty)
    const labels = pool.map(toLabel)
    const { getWeights } = useSpacedRepStore.getState()
    const weights = getWeights('progression', labels)
    const progression = weightedPick(pool, weights)

    const key = randomNote('C3', 'E3')
    const chords = progression.map((roman) => ({
      roman,
      notes: buildChordNotes(key, roman),
    }))
    const label = toLabel(progression)

    void playChordProgression(chords.map((c) => c.notes))

    return { key, chords, label }
  },

  check(question, answer) {
    return question.label === answer
  },

  hint(question) {
    return `First chord: ${question.chords[0].roman}`
  },

  options(_question, difficulty) {
    const pool = getPool(difficulty)
    return [...new Set(pool.map(toLabel))]
  },
}
