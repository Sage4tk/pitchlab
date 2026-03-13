import { create } from 'zustand'
import type { Category } from '@/exercises/types'
import type { SoundPreset } from '@/audio/AudioEngine'

interface ExerciseState {
  category: Category
  difficulty: 1 | 2 | 3
  soundPreset: SoundPreset
  keySignature: string
  setCategory: (c: Category) => void
  setDifficulty: (d: 1 | 2 | 3) => void
  setSoundPreset: (t: SoundPreset) => void
  setKeySignature: (k: string) => void
}

export const useExerciseStore = create<ExerciseState>((set) => ({
  category: 'interval',
  difficulty: 1,
  soundPreset: 'piano',
  keySignature: 'C',

  setCategory: (category) => set({ category }),
  setDifficulty: (difficulty) => set({ difficulty }),
  setSoundPreset: (soundPreset) => set({ soundPreset }),
  setKeySignature: (keySignature) => set({ keySignature }),
}))
