import type { CourseDefinition } from '../types'

export const melodicDictation: CourseDefinition = {
  id: 'melodic-dictation',
  title: 'Melodic Dictation',
  description: 'Train your ear to transcribe melodies of increasing length and complexity.',
  symbol: '𝄞',
  category: 'melody',
  lessons: [
    {
      id: 'md-1',
      title: '3-Note Diatonic',
      description: 'Short diatonic phrases — the building blocks.',
      rounds: 5,
      difficulty: 1,
      exerciseType: 'melody',
      pool: null,
    },
    {
      id: 'md-2',
      title: '4-Note Diatonic',
      description: 'Slightly longer phrases within the major scale.',
      rounds: 5,
      difficulty: 1,
      exerciseType: 'melody',
      pool: null,
    },
    {
      id: 'md-3',
      title: '5-Note Chromatic',
      description: 'Chromatic notes and longer phrases test your precision.',
      rounds: 5,
      difficulty: 2,
      exerciseType: 'melody',
      pool: null,
    },
    {
      id: 'md-4',
      title: '7-Note Challenge',
      description: 'Extended phrases with full chromatic freedom.',
      rounds: 5,
      difficulty: 3,
      exerciseType: 'melody',
      pool: null,
    },
  ],
}
