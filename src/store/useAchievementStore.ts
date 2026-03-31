import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AchievementStats } from '@/lib/achievements'
import type { Attempt, Category } from '@/exercises/types'

export interface MilestoneEvent {
  category: Category
  count: number
}

const MILESTONE_THRESHOLDS = [10, 25, 50, 100, 250, 500, 1000]

interface AchievementState {
  unlocked: Record<string, number> // id → unlock timestamp
  queue: string[]                  // ids waiting to show as toast
  milestoneQueue: MilestoneEvent[] // milestone celebrations pending display
  stats: AchievementStats
  unlockMany: (ids: string[]) => void
  dismissQueue: () => void
  dismissMilestone: () => void
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
      milestoneQueue: [],
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

      dismissMilestone() {
        set((s) => ({ milestoneQueue: s.milestoneQueue.slice(1) }))
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
        const newMilestones: MilestoneEvent[] = []
        if (attempt.correct) {
          const prev = newStats.correctByCategory[cat] ?? 0
          const next = prev + 1
          newStats.correctByCategory[cat] = next
          if (attempt.answerMs < 2000) {
            newStats.fastCorrectCount += 1
          }
          if (MILESTONE_THRESHOLDS.includes(next)) {
            newMilestones.push({ category: cat, count: next })
          }
        }
        set((s) => ({
          stats: newStats,
          milestoneQueue: newMilestones.length > 0
            ? [...s.milestoneQueue, ...newMilestones]
            : s.milestoneQueue,
        }))
      },

      reset() {
        set({ unlocked: {}, queue: [], stats: emptyStats() })
      },
    }),
    { name: 'pitchlab-achievements' },
  ),
)
