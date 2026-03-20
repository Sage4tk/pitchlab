import type { Category } from '@/exercises/types'

export interface LessonDefinition {
  id: string
  title: string
  description: string
  rounds: 3 | 5 | 10
  difficulty: 1 | 2 | 3
  exerciseType: Category
  pool: string[] | null
  passingScore?: number
}

export interface CourseDefinition {
  id: string
  title: string
  description: string
  symbol: string
  category: Category
  lessons: LessonDefinition[]
}

export interface CourseProgress {
  courseId: string
  completedLessons: string[]
  currentLessonId: string
  startedAt: number
  completedAt?: number
}
