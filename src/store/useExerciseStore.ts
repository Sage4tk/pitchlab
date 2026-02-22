import { create } from 'zustand'
import type { Category } from '@/exercises/types'

interface ExerciseState {
  category: Category
  difficulty: 1 | 2 | 3
  synthType: OscillatorType
  keySignature: string
  setCategory: (c: Category) => void
  setDifficulty: (d: 1 | 2 | 3) => void
  setSynthType: (t: OscillatorType) => void
  setKeySignature: (k: string) => void
}

export const useExerciseStore = create<ExerciseState>((set) => ({
  category: 'interval',
  difficulty: 1,
  synthType: 'triangle',
  keySignature: 'C',

  setCategory: (category) => set({ category }),
  setDifficulty: (difficulty) => set({ difficulty }),
  setSynthType: (synthType) => set({ synthType }),
  setKeySignature: (keySignature) => set({ keySignature }),
}))
