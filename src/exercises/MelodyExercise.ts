import type { Exercise } from './types'
import { playMelody } from '@/audio/AudioEngine'
import { applyInterval } from '@/audio/noteUtils'

export interface MelodyQuestion {
  notes: string[]
}

// C major scale intervals from C
const DIATONIC = [0, 2, 4, 5, 7, 9, 11, 12]
const CHROMATIC = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

function pickScale(difficulty: 1 | 2 | 3) {
  return difficulty === 1 ? DIATONIC : CHROMATIC
}

function noteCount(difficulty: 1 | 2 | 3): number {
  if (difficulty === 1) return 3 + Math.floor(Math.random() * 2) // 3–4
  if (difficulty === 2) return 5 + Math.floor(Math.random() * 2) // 5–6
  return 7 + Math.floor(Math.random() * 2) // 7–8
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateMelody(difficulty: 1 | 2 | 3): string[] {
  const scale = pickScale(difficulty)
  const count = noteCount(difficulty)
  const root = 'C4'
  const notes: string[] = []
  for (let i = 0; i < count; i++) {
    const interval = pick(scale)
    // allow some descent
    const dir = Math.random() > 0.4 ? 1 : -1
    const offset = dir * interval
    const base = notes.length > 0 ? notes[notes.length - 1] : root
    try {
      notes.push(applyInterval(base, offset))
    } catch {
      notes.push(root)
    }
  }
  return notes
}

export const MelodyExercise: Exercise<MelodyQuestion, string[]> = {
  generate(difficulty) {
    const notes = generateMelody(difficulty)
    void playMelody(notes)
    return { notes }
  },

  check(question, answer) {
    if (answer.length !== question.notes.length) return false
    return answer.every((n, i) => n === question.notes[i])
  },

  options() {
    return [] // answered via piano keyboard, not grid
  },
}
