import type { Attempt, Category } from '@/exercises/types'

export interface Achievement {
  id: string
  symbol: string
  name: string
  description: string
  group: 'milestones' | 'streaks' | 'mastery' | 'level' | 'special'
}

export const ACHIEVEMENTS: Achievement[] = [
  // Milestones
  { id: 'first_note',           symbol: '♩', name: 'First Note',           description: 'Complete your first exercise',              group: 'milestones' },
  { id: 'century_interval',     symbol: '𝄞', name: 'Interval Century',     description: '100 correct interval answers',              group: 'milestones' },
  { id: 'century_chord',        symbol: '♫', name: 'Chord Scholar',         description: '100 correct chord answers',                 group: 'milestones' },
  { id: 'century_melody',       symbol: '♪', name: 'Melodic Mind',          description: '100 correct melody answers',                group: 'milestones' },
  { id: 'century_rhythm',       symbol: '♬', name: 'Rhythm Century',        description: '100 correct rhythm answers',                group: 'milestones' },
  { id: 'century_progression',  symbol: '♮', name: 'Progression Pro',       description: '100 correct progression answers',           group: 'milestones' },
  // Streaks
  { id: 'streak_7',             symbol: '♭', name: 'Week Warrior',          description: '7-day practice streak',                    group: 'streaks' },
  { id: 'streak_30',            symbol: '♯', name: 'Month Maestro',         description: '30-day practice streak',                   group: 'streaks' },
  { id: 'streak_100',           symbol: '𝄢', name: 'Century Streak',        description: '100-day practice streak',                  group: 'streaks' },
  // Mastery
  { id: 'accuracy_interval',    symbol: '✦', name: 'Interval Master',       description: '90%+ accuracy on intervals (last 20)',     group: 'mastery' },
  { id: 'accuracy_chord',       symbol: '✦', name: 'Chord Master',          description: '90%+ accuracy on chords (last 20)',        group: 'mastery' },
  { id: 'accuracy_melody',      symbol: '✦', name: 'Melody Master',         description: '90%+ accuracy on melody (last 20)',        group: 'mastery' },
  { id: 'accuracy_rhythm',      symbol: '✦', name: 'Rhythm Master',         description: '90%+ accuracy on rhythm (last 20)',        group: 'mastery' },
  { id: 'accuracy_progression', symbol: '✦', name: 'Progression Master',    description: '90%+ accuracy on progressions (last 20)',  group: 'mastery' },
  // Level
  { id: 'level_5',              symbol: '★', name: 'Rising Star',           description: 'Reach level 5',                            group: 'level' },
  { id: 'level_10',             symbol: '★', name: 'Legend',                description: 'Reach level 10',                           group: 'level' },
  { id: 'xp_1000',              symbol: '𝄞', name: 'Thousand Points',       description: 'Earn 1,000 total XP',                      group: 'level' },
  { id: 'xp_5000',              symbol: '𝄞', name: 'Five Thousand',         description: 'Earn 5,000 total XP',                      group: 'level' },
  // Special
  { id: 'all_rounder',          symbol: '𝄢', name: 'All-Rounder',           description: 'Practice all 6 exercise types',            group: 'special' },
  { id: 'speed_demon',          symbol: '♯', name: 'Speed Demon',           description: '10 correct answers under 2 seconds',       group: 'special' },
  { id: 'perfect_session',      symbol: '♬', name: 'Perfect Session',       description: '100% score in a 10-round session',         group: 'special' },
]

export const ACHIEVEMENT_MAP = new Map(ACHIEVEMENTS.map((a) => [a.id, a]))

export interface AchievementStats {
  correctByCategory: Partial<Record<Category, number>>
  fastCorrectCount: number
  practicedCategories: Partial<Record<Category, true>>
}

export function getNewAchievements(
  stats: AchievementStats,
  recentAttempts: Attempt[],
  totalXP: number,
  level: number,
  streakCurrent: number,
  alreadyUnlocked: Set<string>,
): string[] {
  const newIds: string[] = []

  function check(id: string, condition: boolean) {
    if (!alreadyUnlocked.has(id) && condition) newIds.push(id)
  }

  const correct = (cat: Category) => stats.correctByCategory[cat] ?? 0

  const accuracy = (cat: Category) => {
    const recent = recentAttempts.filter((a) => a.category === cat).slice(-20)
    if (recent.length < 10) return 0
    return (recent.filter((a) => a.correct).length / recent.length) * 100
  }

  const totalAttempts = Object.values(stats.correctByCategory).reduce((s, v) => s + (v ?? 0), 0)

  const ALL_CATEGORIES: Category[] = ['interval', 'chord', 'melody', 'rhythm', 'progression', 'pitch-match']

  check('first_note',           totalAttempts >= 1 || recentAttempts.length >= 1)
  check('century_interval',     correct('interval') >= 100)
  check('century_chord',        correct('chord') >= 100)
  check('century_melody',       correct('melody') >= 100)
  check('century_rhythm',       correct('rhythm') >= 100)
  check('century_progression',  correct('progression') >= 100)
  check('streak_7',             streakCurrent >= 7)
  check('streak_30',            streakCurrent >= 30)
  check('streak_100',           streakCurrent >= 100)
  check('accuracy_interval',    accuracy('interval') >= 90)
  check('accuracy_chord',       accuracy('chord') >= 90)
  check('accuracy_melody',      accuracy('melody') >= 90)
  check('accuracy_rhythm',      accuracy('rhythm') >= 90)
  check('accuracy_progression', accuracy('progression') >= 90)
  check('all_rounder',          ALL_CATEGORIES.every((c) => stats.practicedCategories[c]))
  check('speed_demon',          stats.fastCorrectCount >= 10)
  check('level_5',              level >= 5)
  check('level_10',             level >= 10)
  check('xp_1000',              totalXP >= 1000)
  check('xp_5000',              totalXP >= 5000)

  return newIds
}

export function checkPerfectSession(
  score: number,
  rounds: number,
  alreadyUnlocked: Set<string>,
): string[] {
  if (!alreadyUnlocked.has('perfect_session') && rounds >= 10 && score === rounds) {
    return ['perfect_session']
  }
  return []
}
