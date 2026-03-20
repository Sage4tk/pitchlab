import type { CourseDefinition } from '../types'

export const rhythmBasics: CourseDefinition = {
  id: 'rhythm-basics',
  title: 'Rhythm Basics',
  description: 'Develop your rhythmic sense from simple quarter-note patterns to syncopated grooves.',
  symbol: '♬',
  category: 'rhythm',
  lessons: [
    {
      id: 'rb-1',
      title: 'Quarter Notes I',
      description: 'Simple 4-beat patterns at a comfortable tempo.',
      rounds: 5,
      difficulty: 1,
      exerciseType: 'rhythm',
      pool: null,
    },
    {
      id: 'rb-2',
      title: 'Quarter Notes II',
      description: 'More practice with basic patterns — build consistency.',
      rounds: 5,
      difficulty: 1,
      exerciseType: 'rhythm',
      pool: null,
    },
    {
      id: 'rb-3',
      title: 'Eighth Notes',
      description: 'Double the subdivisions — 8 slots to fill.',
      rounds: 5,
      difficulty: 2,
      exerciseType: 'rhythm',
      pool: null,
    },
    {
      id: 'rb-4',
      title: 'Syncopation',
      description: 'Off-beat accents and syncopated grooves.',
      rounds: 5,
      difficulty: 3,
      exerciseType: 'rhythm',
      pool: null,
    },
  ],
}
