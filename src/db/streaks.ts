import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface StreakData {
  current: number
  longest: number
  lastSession: string // ISO date string YYYY-MM-DD
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

function yesterdayStr(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

export async function updateStreak(userId: string): Promise<StreakData> {
  const ref = doc(db, 'users', userId, 'streak', 'current')
  const snap = await getDoc(ref)
  const today = todayStr()
  const yesterday = yesterdayStr()

  let data: StreakData = { current: 0, longest: 0, lastSession: '' }

  if (snap.exists()) {
    data = snap.data() as StreakData
  }

  if (data.lastSession === today) {
    // already updated today
    return data
  }

  if (data.lastSession === yesterday) {
    data.current += 1
  } else {
    data.current = 1
  }

  if (data.current > data.longest) {
    data.longest = data.current
  }

  data.lastSession = today
  await setDoc(ref, data)
  return data
}

export async function getStreak(userId: string): Promise<StreakData> {
  const ref = doc(db, 'users', userId, 'streak', 'current')
  const snap = await getDoc(ref)
  if (!snap.exists()) return { current: 0, longest: 0, lastSession: '' }
  return snap.data() as StreakData
}
