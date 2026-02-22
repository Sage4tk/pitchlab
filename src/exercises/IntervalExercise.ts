import type { Exercise } from './types'
import { randomNote, applyInterval } from '@/audio/noteUtils'
import { playInterval } from '@/audio/AudioEngine'

export interface IntervalQuestion {
  root: string
  target: string
  semitones: number
  label: string
  ascending: boolean
}

const ALL_INTERVALS = [
  { semitones: 0, label: 'Unison' },
  { semitones: 1, label: 'm2' },
  { semitones: 2, label: 'M2' },
  { semitones: 3, label: 'm3' },
  { semitones: 4, label: 'M3' },
  { semitones: 5, label: 'P4' },
  { semitones: 6, label: 'Tritone' },
  { semitones: 7, label: 'P5' },
  { semitones: 8, label: 'm6' },
  { semitones: 9, label: 'M6' },
  { semitones: 10, label: 'm7' },
  { semitones: 11, label: 'M7' },
  { semitones: 12, label: 'P8' },
]

const D1 = ALL_INTERVALS.filter((i) => [3, 4, 5, 7, 9, 12].includes(i.semitones))
const D2 = ALL_INTERVALS
const D3 = ALL_INTERVALS

function getPool(difficulty: 1 | 2 | 3) {
  if (difficulty === 1) return D1
  if (difficulty === 2) return D2
  return D3
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export const IntervalExercise: Exercise<IntervalQuestion> = {
  generate(difficulty) {
    const pool = getPool(difficulty)
    const interval = pick(pool)
    const ascending = difficulty < 3 ? true : Math.random() > 0.5
    const semitones = ascending ? interval.semitones : -interval.semitones
    const root = randomNote('C3', 'C5')
    const target = applyInterval(root, semitones)

    void playInterval(root, target)

    return { root, target, semitones: interval.semitones, label: interval.label, ascending }
  },

  check(question, answer) {
    return question.label === answer
  },

  hint(question) {
    return `The interval is ${question.semitones} semitone${question.semitones !== 1 ? 's' : ''}.`
  },

  options(_question, difficulty) {
    return getPool(difficulty).map((i) => i.label)
  },
}
