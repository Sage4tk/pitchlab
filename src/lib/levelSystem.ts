export interface LevelInfo {
  level: number
  title: string
  currentXP: number       // XP earned within this level
  xpForLevel: number      // Total XP needed to complete this level
  totalXP: number         // All-time XP
  nextLevelAt: number     // Cumulative XP needed for next level
  progressPct: number     // 0–100 within current level
}

const LEVEL_THRESHOLDS = [0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200, 4000]

const LEVEL_TITLES: Record<number, string> = {
  1:  'Novice',
  2:  'Student',
  3:  'Apprentice',
  4:  'Practitioner',
  5:  'Musician',
  6:  'Expert',
  7:  'Virtuoso',
  8:  'Master',
  9:  'Grand Master',
  10: 'Legend',
}

const MAX_LEVEL = LEVEL_THRESHOLDS.length - 1

export function getLevelInfo(totalXP: number): LevelInfo {
  let level = 1
  for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
    if (totalXP >= LEVEL_THRESHOLDS[i]) level = i + 1
    else break
  }
  level = Math.min(level, MAX_LEVEL)

  const levelStart = LEVEL_THRESHOLDS[level - 1]
  const levelEnd = level < MAX_LEVEL ? LEVEL_THRESHOLDS[level] : LEVEL_THRESHOLDS[level - 1] + 1000

  const currentXP = totalXP - levelStart
  const xpForLevel = levelEnd - levelStart
  const progressPct = level >= MAX_LEVEL ? 100 : Math.min(100, Math.round((currentXP / xpForLevel) * 100))

  return {
    level,
    title: LEVEL_TITLES[level] ?? 'Legend',
    currentXP,
    xpForLevel,
    totalXP,
    nextLevelAt: levelEnd,
    progressPct,
  }
}

export function calcXP(difficulty: 1 | 2 | 3, answerMs: number): number {
  const base = difficulty === 1 ? 10 : difficulty === 2 ? 20 : 35
  const speedBonus = answerMs < 3000 ? 5 : 0
  return base + speedBonus
}
