import { logEvent } from 'firebase/analytics'
import { getAnalyticsInstance } from '@/lib/firebase'
import type { Category } from '@/exercises/types'

function log(eventName: string, params: Record<string, string | number>) {
  const instance = getAnalyticsInstance()
  if (!instance) return
  logEvent(instance, eventName, params)
}

export function trackSessionStart(category: Category, difficulty: 1 | 2 | 3, rounds: number) {
  log('exercise_session_start', { category, difficulty, rounds })
}

export function trackSessionComplete(
  category: Category,
  score: number,
  totalRounds: number,
  sessionXP: number,
) {
  log('exercise_session_complete', {
    category,
    score,
    total_rounds: totalRounds,
    session_xp: sessionXP,
    accuracy: totalRounds > 0 ? Math.round((score / totalRounds) * 100) : 0,
  })
}
