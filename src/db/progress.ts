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

// Fetches the most recent attempts across ALL categories — used to hydrate
// the in-memory store on login so accuracy rings survive page refreshes.
export async function getAllRecentAttempts(userId: string, n = 100): Promise<Attempt[]> {
  const q = query(
    collection(db, 'users', userId, 'progress'),
    orderBy('createdAt', 'desc'),
    limit(n),
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Attempt, 'id'>) }))
}

export async function getPracticeDays(userId: string): Promise<Record<string, number>> {
  const q = query(
    collection(db, 'users', userId, 'progress'),
    orderBy('createdAt', 'desc'),
    limit(500),
  )
  const snap = await getDocs(q)
  const counts: Record<string, number> = {}
  snap.docs.forEach((d) => {
    const data = d.data() as Omit<Attempt, 'id'>
    const date = new Date(data.createdAt).toISOString().slice(0, 10)
    counts[date] = (counts[date] ?? 0) + 1
  })
  return counts
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
