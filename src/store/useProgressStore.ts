import { create } from 'zustand'
import type { Attempt, Category } from '@/exercises/types'

interface ProgressState {
  attempts: Attempt[]
  addAttempt: (a: Attempt) => void
  getAccuracy: (category: Category) => number
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  attempts: [],

  addAttempt(a) {
    set((state) => ({ attempts: [...state.attempts, a] }))
  },

  getAccuracy(category) {
    const recent = get()
      .attempts.filter((a) => a.category === category)
      .slice(-20)
    if (recent.length === 0) return 0
    return (recent.filter((a) => a.correct).length / recent.length) * 100
  },
}))
