import type { Exercise } from './types'
import { playRhythm } from '@/audio/AudioEngine'

export interface RhythmQuestion {
  pattern: boolean[] // true = hit, false = rest
  bpm: number
  subdivisions: number // beats in pattern
}

function randomPattern(length: number, density: number): boolean[] {
  return Array.from({ length }, () => Math.random() < density)
}

function generatePattern(difficulty: 1 | 2 | 3): RhythmQuestion {
  if (difficulty === 1) {
    // Quarter and half notes in 4/4 — 4 beats, simple density
    const pattern = randomPattern(4, 0.6).map((_, i, arr) => {
      // ensure at least beat 1 hits
      return i === 0 ? true : arr[i]
    })
    return { pattern, bpm: 80, subdivisions: 4 }
  }
  if (difficulty === 2) {
    // 8 subdivisions (eighth notes) in 4/4
    const pattern = randomPattern(8, 0.55)
    pattern[0] = true
    return { pattern, bpm: 80, subdivisions: 8 }
  }
  // Syncopated — 8 subdivisions, higher off-beat probability
  const pattern = randomPattern(8, 0.5)
  pattern[0] = true
  // boost off-beats
  ;[1, 3, 5, 7].forEach((i) => {
    if (Math.random() > 0.4) pattern[i] = true
  })
  return { pattern, bpm: 90, subdivisions: 8 }
}

function quantize(tapMs: number[], durationMs: number, subdivisions: number): boolean[] {
  const beatMs = durationMs / subdivisions
  const result = Array(subdivisions).fill(false) as boolean[]
  tapMs.forEach((t) => {
    const idx = Math.round(t / beatMs)
    if (idx >= 0 && idx < subdivisions) result[idx] = true
  })
  return result
}

export const RhythmExercise: Exercise<RhythmQuestion, boolean[]> = {
  generate(difficulty) {
    const question = generatePattern(difficulty)
    void playRhythm(question.pattern, question.bpm)
    return question
  },

  check(question, answer) {
    if (answer.length !== question.pattern.length) {
      // quantize if needed
      return false
    }
    return answer.every((hit, i) => hit === question.pattern[i])
  },

  options() {
    return [] // answered via tap pad
  },
}

// Export quantize for use in RhythmPad
export { quantize }
