import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AchievementStats } from '@/lib/achievements'
import type { Attempt, Category } from '@/exercises/types'

interface AchievementState {
  unlocked: Record<string, number> // id → unlock timestamp
  queue: string[]                  // ids waiting to show as toast
  stats: AchievementStats
  unlockMany: (ids: string[]) => void
  dismissQueue: () => void
  load: (ids: Record<string, number>) => void
  recordAttempt: (attempt: Attempt) => void
  reset: () => void
}

const emptyStats = (): AchievementStats => ({
  correctByCategory: {},
  fastCorrectCount: 0,
  practicedCategories: {},
})

export const useAchievementStore = create<AchievementState>()(
  persist(
    (set, get) => ({
      unlocked: {},
      queue: [],
      stats: emptyStats(),

      unlockMany(ids) {
        if (ids.length === 0) return
        const now = Date.now()
        const next = { ...get().unlocked }
        ids.forEach((id) => { next[id] = now })
        set({ unlocked: next, queue: [...get().queue, ...ids] })
      },

      dismissQueue() {
        set({ queue: [] })
      },

      load(ids) {
        set((s) => ({ unlocked: { ...ids, ...s.unlocked } }))
      },

      recordAttempt(attempt) {
        const { stats } = get()
        const cat = attempt.category as Category
        const newStats: AchievementStats = {
          correctByCategory: { ...stats.correctByCategory },
          fastCorrectCount: stats.fastCorrectCount,
          practicedCategories: { ...stats.practicedCategories, [cat]: true },
        }
        if (attempt.correct) {
          newStats.correctByCategory[cat] = (newStats.correctByCategory[cat] ?? 0) + 1
          if (attempt.answerMs < 2000) {
            newStats.fastCorrectCount += 1
          }
        }
        set({ stats: newStats })
      },

      reset() {
        set({ unlocked: {}, queue: [], stats: emptyStats() })
      },
    }),
    { name: 'pitchlab-achievements' },
  ),
)
