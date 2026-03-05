import { doc, getDoc, setDoc, increment, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface XPData {
  totalXP: number
}

export async function getXP(userId: string): Promise<number> {
  const ref = doc(db, 'users', userId, 'stats', 'xp')
  const snap = await getDoc(ref)
  if (!snap.exists()) return 0
  return (snap.data() as XPData).totalXP ?? 0
}

export async function addXPToFirestore(userId: string, amount: number): Promise<void> {
  const ref = doc(db, 'users', userId, 'stats', 'xp')
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    await setDoc(ref, { totalXP: amount })
  } else {
    await updateDoc(ref, { totalXP: increment(amount) })
  }
}
