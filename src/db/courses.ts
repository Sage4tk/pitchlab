import { doc, setDoc, collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { CourseProgress } from '@/courses/types'

export async function saveCourseProgress(userId: string, progress: CourseProgress): Promise<void> {
  const ref = doc(db, 'users', userId, 'courses', progress.courseId)
  await setDoc(ref, progress, { merge: true })
}

export async function getAllCourseProgress(userId: string): Promise<Record<string, CourseProgress>> {
  const colRef = collection(db, 'users', userId, 'courses')
  const snap = await getDocs(colRef)
  const result: Record<string, CourseProgress> = {}
  snap.forEach((d) => {
    const data = d.data() as CourseProgress
    result[data.courseId] = data
  })
  return result
}
