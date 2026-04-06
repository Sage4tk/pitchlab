import type { LessonDefinition } from './types'
import type { Category } from '@/exercises/types'
import { ALL_INTERVALS } from '@/exercises/IntervalExercise'
import type { IntervalQuestion } from '@/exercises/IntervalExercise'
import { CHORDS } from '@/exercises/ChordExercise'
import type { ChordQuestion } from '@/exercises/ChordExercise'
import {
  EASY_PROGRESSIONS, MEDIUM_PROGRESSIONS, HARD_PROGRESSIONS,
  buildChordNotes, toLabel,
} from '@/exercises/ChordProgressionExercise'
import type { ChordProgressionQuestion } from '@/exercises/ChordProgressionExercise'
import type { MelodyQuestion } from '@/exercises/MelodyExercise'
import { MelodyExercise } from '@/exercises/MelodyExercise'
import type { RhythmQuestion } from '@/exercises/RhythmExercise'
import { RhythmExercise } from '@/exercises/RhythmExercise'
import { randomNote, applyInterval } from '@/audio/noteUtils'
import { playInterval, playChord, playChordProgression, playMelody, playRhythm } from '@/audio/AudioEngine'

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

// --- Interval lessons ---

function createIntervalGenerator(lesson: LessonDefinition) {
  const pool = lesson.pool
    ? ALL_INTERVALS.filter((i) => lesson.pool!.includes(i.label))
    : ALL_INTERVALS

  const generate = (difficulty: 1 | 2 | 3): IntervalQuestion => {
    const interval = pick(pool)
    const ascending = difficulty < 3 ? true : Math.random() > 0.5
    const semitones = ascending ? interval.semitones : -interval.semitones
    const root = randomNote('C3', 'C5')
    const target = applyInterval(root, semitones)
    void playInterval(root, target)
    return { root, target, semitones: interval.semitones, label: interval.label, ascending }
  }

  const check = (q: IntervalQuestion, a: string) => q.label === a
  const options = () => pool.map((i) => i.label)
  const replay = (q: IntervalQuestion) => { void playInterval(q.root, q.target) }
  const getItemLabel = (q: IntervalQuestion) => q.label

  return { generate, check, options, replay, getItemLabel, category: 'interval' as Category }
}

// --- Chord lessons ---

function createChordGenerator(lesson: LessonDefinition) {
  const pool = lesson.pool
    ? Object.keys(CHORDS).filter((k) => lesson.pool!.includes(k))
    : Object.keys(CHORDS)

  const generate = (_difficulty: 1 | 2 | 3): ChordQuestion => {
    const quality = pick(pool)
    const root = randomNote('C3', 'G4')
    const intervals = CHORDS[quality]
    const notes = intervals.map((s) => applyInterval(root, s))
    void playChord(notes, '2n')
    return { root, notes, quality, inversion: 0 }
  }

  const check = (q: ChordQuestion, a: string) => q.quality === a
  const options = () => pool
  const replay = (q: ChordQuestion) => { void playChord(q.notes, '2n') }
  const getItemLabel = (q: ChordQuestion) => q.quality

  return { generate, check, options, replay, getItemLabel, category: 'chord' as Category }
}

// --- Progression lessons ---

function createProgressionGenerator(lesson: LessonDefinition) {
  const allProgressions = [...EASY_PROGRESSIONS, ...MEDIUM_PROGRESSIONS, ...HARD_PROGRESSIONS]
  // dedupe by label
  const seen = new Set<string>()
  const uniqueProgressions = allProgressions.filter((p) => {
    const l = toLabel(p)
    if (seen.has(l)) return false
    seen.add(l)
    return true
  })

  const pool = lesson.pool
    ? uniqueProgressions.filter((p) => lesson.pool!.includes(toLabel(p)))
    : uniqueProgressions

  const generate = (_difficulty: 1 | 2 | 3): ChordProgressionQuestion => {
    const progression = pick(pool)
    const key = randomNote('C3', 'E3')
    const chords = progression.map((roman) => ({
      roman,
      notes: buildChordNotes(key, roman),
    }))
    const label = toLabel(progression)
    void playChordProgression(chords.map((c) => c.notes))
    return { key, chords, label }
  }

  const check = (q: ChordProgressionQuestion, a: string) => q.label === a
  const options = () => [...new Set(pool.map(toLabel))]
  const replay = (q: ChordProgressionQuestion) => {
    void playChordProgression(q.chords.map((c) => c.notes))
  }
  const getItemLabel = (q: ChordProgressionQuestion) => q.label

  return { generate, check, options, replay, getItemLabel, category: 'progression' as Category }
}

// --- Melody lessons ---

function createMelodyGenerator(lesson: LessonDefinition) {
  const generate = (difficulty: 1 | 2 | 3): MelodyQuestion => {
    return MelodyExercise.generate(difficulty)
  }
  const check = (q: MelodyQuestion, a: string[]) => MelodyExercise.check(q, a)
  const options = () => [] as string[]
  const replay = (q: MelodyQuestion) => { void playMelody(q.notes) }

  return { generate, check, options, replay, getItemLabel: undefined, category: 'melody' as Category, difficulty: lesson.difficulty }
}

// --- Rhythm lessons ---

function createRhythmGenerator(lesson: LessonDefinition) {
  const generate = (difficulty: 1 | 2 | 3): RhythmQuestion => {
    return RhythmExercise.generate(difficulty)
  }
  const check = (q: RhythmQuestion, a: boolean[]) => RhythmExercise.check(q, a)
  const options = () => [] as string[]
  const replay = (q: RhythmQuestion) => { void playRhythm(q.pattern, q.bpm) }

  return { generate, check, options, replay, getItemLabel: undefined, category: 'rhythm' as Category, difficulty: lesson.difficulty }
}

// --- Public API ---

export type LessonGenerator = ReturnType<typeof createIntervalGenerator>
  | ReturnType<typeof createChordGenerator>
  | ReturnType<typeof createProgressionGenerator>
  | ReturnType<typeof createMelodyGenerator>
  | ReturnType<typeof createRhythmGenerator>

export function createLessonGenerator(lesson: LessonDefinition): LessonGenerator {
  switch (lesson.exerciseType) {
    case 'interval': return createIntervalGenerator(lesson)
    case 'chord': return createChordGenerator(lesson)
    case 'progression': return createProgressionGenerator(lesson)
    case 'melody': return createMelodyGenerator(lesson)
    case 'rhythm': return createRhythmGenerator(lesson)
    default: throw new Error(`Unsupported exercise type: ${lesson.exerciseType}`)
  }
}
