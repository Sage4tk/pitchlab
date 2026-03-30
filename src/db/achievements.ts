import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function saveAchievements(userId: string, ids: string[]): Promise<void> {
  if (ids.length === 0) return
  const ref = doc(db, 'users', userId, 'achievements', 'unlocked')
  const snap = await getDoc(ref)
  const existing: Record<string, number> = snap.exists()
    ? (snap.data() as Record<string, number>)
    : {}
  const now = Date.now()
  ids.forEach((id) => { existing[id] = now })
  await setDoc(ref, existing)
}

export async function getAchievements(userId: string): Promise<Record<string, number>> {
  const ref = doc(db, 'users', userId, 'achievements', 'unlocked')
  const snap = await getDoc(ref)
  if (!snap.exists()) return {}
  return snap.data() as Record<string, number>
}
