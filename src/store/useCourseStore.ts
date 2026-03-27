import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CourseProgress } from '@/courses/types'
import { getCourse } from '@/courses/data'
import { saveCourseProgress, getAllCourseProgress } from '@/db/courses'

interface CourseStore {
  progress: Record<string, CourseProgress>
  startCourse: (courseId: string, userId?: string) => void
  completeLesson: (courseId: string, lessonId: string, userId?: string) => void
  isLessonUnlocked: (courseId: string, lessonId: string) => boolean
  isLessonCompleted: (courseId: string, lessonId: string) => boolean
  loadProgress: (userId: string) => Promise<void>
  resetProgress: () => void
}

export const useCourseStore = create<CourseStore>()(
  persist(
    (set, get) => ({
      progress: {},

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
        if (userId) void saveCourseProgress(userId, cp)
      },

      completeLesson(courseId, lessonId, userId) {
        const course = getCourse(courseId)
        if (!course) return

        set((s) => {
          const prev = s.progress[courseId]
          if (!prev) return s

          const completed = prev.completedLessons.includes(lessonId)
            ? prev.completedLessons
            : [...prev.completedLessons, lessonId]

          // Find next uncompleted lesson
          const nextLesson = course.lessons.find((l) => !completed.includes(l.id))
          const allDone = completed.length >= course.lessons.length

          const updated: CourseProgress = {
            ...prev,
            completedLessons: completed,
            currentLessonId: nextLesson?.id ?? prev.currentLessonId,
            completedAt: allDone ? Date.now() : undefined,
          }

          if (userId) void saveCourseProgress(userId, updated)

          return { progress: { ...s.progress, [courseId]: updated } }
        })
      },

      isLessonUnlocked(courseId, lessonId) {
        const course = getCourse(courseId)
        if (!course) return false

        const cp = get().progress[courseId]
        // First lesson is always unlocked
        const idx = course.lessons.findIndex((l) => l.id === lessonId)
        if (idx === 0) return true
        if (!cp) return false

        // Lesson is unlocked if previous lesson is completed
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
        if (Object.keys(data).length > 0) {
          set({ progress: data })
        }
      },

      resetProgress() {
        set({ progress: {} })
      },
    }),
    {
      name: 'pitchlab-courses',
    },
  ),
)
