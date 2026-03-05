import { create } from 'zustand'
import { getLevelInfo } from '@/lib/levelSystem'
import type { LevelInfo } from '@/lib/levelSystem'

interface XPState {
  totalXP: number
  levelInfo: LevelInfo
  addXP: (amount: number) => void
  loadXP: (total: number) => void
}

export const useXPStore = create<XPState>((set, get) => ({
  totalXP: 0,
  levelInfo: getLevelInfo(0),

  addXP(amount) {
    const next = get().totalXP + amount
    set({ totalXP: next, levelInfo: getLevelInfo(next) })
  },

  loadXP(total) {
    set({ totalXP: total, levelInfo: getLevelInfo(total) })
  },
}))
