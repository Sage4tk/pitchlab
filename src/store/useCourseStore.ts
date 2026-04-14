import { create } from 'zustand'
import type { CourseProgress } from '@/courses/types'
import { getCourse } from '@/courses/data'
import { saveCourseProgress, getAllCourseProgress } from '@/db/courses'

interface CourseStore {
  progress: Record<string, CourseProgress>
  loaded: boolean
  startCourse: (courseId: string, userId?: string) => void
  completeLesson: (courseId: string, lessonId: string, userId?: string) => void
  isLessonUnlocked: (courseId: string, lessonId: string) => boolean
  isLessonCompleted: (courseId: string, lessonId: string) => boolean
  loadProgress: (userId: string) => Promise<void>
  resetProgress: () => void
}

export const useCourseStore = create<CourseStore>()((set, get) => ({
  progress: {},
  loaded: false,

  startCourse(courseId, userId) {
    const course = getCourse(courseId)
    if (!course || get().progress[courseId]) return

    const cp: CourseProgress = {
      courseId,
      completedLessons: [],
      currentLessonId: course.lessons[0].id,
      startedAt: Date.now(),
    }

    set((s) => ({ progress: { ...s.progress, [courseId]: cp } }))
    if (userId) saveCourseProgress(userId, cp).catch(console.error)
  },

  completeLesson(courseId, lessonId, userId) {
    const course = getCourse(courseId)
    if (!course) return

    const prev = get().progress[courseId]
    if (!prev) return

    const completed = prev.completedLessons.includes(lessonId)
      ? prev.completedLessons
      : [...prev.completedLessons, lessonId]

    const nextLesson = course.lessons.find((l) => !completed.includes(l.id))
    const allDone = completed.length >= course.lessons.length

    const updated: CourseProgress = {
      ...prev,
      completedLessons: completed,
      currentLessonId: nextLesson?.id ?? prev.currentLessonId,
      ...(allDone ? { completedAt: Date.now() } : {}),
    }

    set((s) => ({ progress: { ...s.progress, [courseId]: updated } }))

    if (userId) {
      saveCourseProgress(userId, updated).catch(console.error)
    } else {
      console.warn('[CourseStore] completeLesson called without userId — progress will not persist')
    }
  },

  isLessonUnlocked(courseId, lessonId) {
    const course = getCourse(courseId)
    if (!course) return false

    const cp = get().progress[courseId]
    const idx = course.lessons.findIndex((l) => l.id === lessonId)
    if (idx === 0) return true
    if (!cp) return false

    const prevLessonId = course.lessons[idx - 1].id
    return cp.completedLessons.includes(prevLessonId)
  },

  isLessonCompleted(courseId, lessonId) {
    const cp = get().progress[courseId]
    if (!cp) return false
    return cp.completedLessons.includes(lessonId)
  },

  async loadProgress(userId) {
    const data = await getAllCourseProgress(userId)
    set({ progress: data, loaded: true })
  },

  resetProgress() {
    set({ progress: {}, loaded: false })
  },
}))
