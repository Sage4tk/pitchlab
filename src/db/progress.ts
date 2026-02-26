import {
  addDoc,
  collection,
  query,
  getDocs,
  where,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Attempt, Category } from '@/exercises/types'

export async function saveAttempt(
  userId: string,
  data: Omit<Attempt, 'id'>,
): Promise<void> {
  await addDoc(collection(db, 'users', userId, 'progress'), data)
}

export async function getRecentAttempts(
  userId: string,
  category: Category,
  n = 20,
): Promise<Attempt[]> {
  // Omit orderBy to avoid requiring a composite Firestore index —
  // sort client-side instead.
  const q = query(
    collection(db, 'users', userId, 'progress'),
    where('category', '==', category),
  )
  const snap = await getDocs(q)
  const all = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Attempt, 'id'>) }))
  return all.sort((a, b) => b.createdAt - a.createdAt).slice(0, n)
}
