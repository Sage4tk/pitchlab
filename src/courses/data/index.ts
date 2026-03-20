import type { CourseDefinition, LessonDefinition } from '../types'
import { intervalFoundations } from './intervalFoundations'
import { chordEarTraining } from './chordEarTraining'
import { rhythmBasics } from './rhythmBasics'
import { melodicDictation } from './melodicDictation'
import { harmonicProgressions } from './harmonicProgressions'

export const COURSES: CourseDefinition[] = [
  intervalFoundations,
  chordEarTraining,
  rhythmBasics,
  melodicDictation,
  harmonicProgressions,
]

export function getCourse(courseId: string): CourseDefinition | undefined {
  return COURSES.find((c) => c.id === courseId)
}

export function getLesson(courseId: string, lessonId: string): LessonDefinition | undefined {
  const course = getCourse(courseId)
  if (!course) return undefined
  return course.lessons.find((l) => l.id === lessonId)
}
