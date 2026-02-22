import {
  addDoc,
  collection,
  query,
  orderBy,
  limit,
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
  const q = query(
    collection(db, 'users', userId, 'progress'),
    where('category', '==', category),
    orderBy('createdAt', 'desc'),
    limit(n),
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Attempt, 'id'>) }))
}
