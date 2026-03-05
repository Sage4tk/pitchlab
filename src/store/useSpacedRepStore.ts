import { create } from 'zustand'

interface ItemStats {
  correct: number
  total: number
  lastSeen: number
}

interface SpacedRepState {
  items: Record<string, ItemStats>
  recordResult: (category: string, item: string, correct: boolean) => void
  getWeight: (category: string, item: string) => number
  getWeights: (category: string, items: string[]) => number[]
}

function loadFromStorage(): Record<string, ItemStats> {
  try {
    const raw = localStorage.getItem('pitchlab-spaced-rep')
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveToStorage(items: Record<string, ItemStats>) {
  localStorage.setItem('pitchlab-spaced-rep', JSON.stringify(items))
}

export const useSpacedRepStore = create<SpacedRepState>((set, get) => ({
  items: loadFromStorage(),

  recordResult(category, item, correct) {
    set((state) => {
      const key = `${category}:${item}`
      const prev = state.items[key] || { correct: 0, total: 0, lastSeen: 0 }
      const updated = {
        ...state.items,
        [key]: {
          correct: prev.correct + (correct ? 1 : 0),
          total: prev.total + 1,
          lastSeen: Date.now(),
        },
      }
      saveToStorage(updated)
      return { items: updated }
    })
  },

  getWeight(category, item) {
    const key = `${category}:${item}`
    const stats = get().items[key]
    if (!stats || stats.total === 0) return 1.0
    const accuracy = stats.correct / stats.total
    // Lower accuracy -> higher weight (shown more often)
    // Range: 0.3 (perfect) to 2.3 (always wrong)
    return (1 - accuracy) * 2 + 0.3
  },

  getWeights(category, items) {
    return items.map((item) => get().getWeight(category, item))
  },
}))

export function weightedPick<T>(items: T[], weights: number[]): T {
  const total = weights.reduce((sum, w) => sum + w, 0)
  let r = Math.random() * total
  for (let i = 0; i < items.length; i++) {
    r -= weights[i]
    if (r <= 0) return items[i]
  }
  return items[items.length - 1]
}
