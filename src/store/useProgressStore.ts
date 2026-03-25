import { create } from 'zustand'
import type { Attempt, Category } from '@/exercises/types'

interface ProgressState {
  attempts: Attempt[]
  practiceDays: Record<string, number> | null
  addAttempt: (a: Attempt) => void
  loadAttempts: (attempts: Attempt[]) => void
  setPracticeDays: (days: Record<string, number>) => void
  incrementToday: () => void
  getAccuracy: (category: Category) => number
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  attempts: [],
  practiceDays: null,

  addAttempt(a) {
    set((state) => ({ attempts: [...state.attempts, a] }))
    get().incrementToday()
  },

  loadAttempts(attempts) {
    set({ attempts })
  },

  setPracticeDays(days) {
    set({ practiceDays: days })
  },

  incrementToday() {
    const today = new Date().toISOString().slice(0, 10)
    set((state) => ({
      practiceDays: {
        ...state.practiceDays,
        [today]: ((state.practiceDays ?? {})[today] ?? 0) + 1,
      },
    }))
  },

  getAccuracy(category) {
    const recent = get()
      .attempts.filter((a) => a.category === category)
      .slice(-20)
    if (recent.length === 0) return 0
    return (recent.filter((a) => a.correct).length / recent.length) * 100
  },
}))
