import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSession } from '@/hooks/useSession'
import { useProgressStore } from '@/store/useProgressStore'
import { useXPStore } from '@/store/useXPStore'
import { useSpacedRepStore } from '@/store/useSpacedRepStore'
import { getStreak } from '@/db/streaks'
import { ProgressRing } from '@/components/ProgressRing'
import type { Category } from '@/exercises/types'
import { motion } from 'framer-motion'
import { useCourseStore } from '@/store/useCourseStore'
import { COURSES, getCourse } from '@/courses/data'

/* ── Daily Missions ──────────────────────────────────────────── */

interface Mission {
  id: string
  title: string
  category: Category
  difficulty: 1 | 2 | 3
  target: number
  path: string
  symbol: string
}

const MISSION_POOL: Mission[] = [
  { id: 'interval-d1', title: 'Interval Warmup',      category: 'interval',    difficulty: 1, target: 5, path: '/exercises/interval',    symbol: '♩' },
  { id: 'interval-d2', title: 'Interval Challenge',   category: 'interval',    difficulty: 2, target: 5, path: '/exercises/interval',    symbol: '♩' },
  { id: 'chord-d1',    title: 'Chord Recognition',    category: 'chord',       difficulty: 1, target: 5, path: '/exercises/chord',       symbol: '♫' },
  { id: 'chord-d2',    title: 'Advanced Chords',      category: 'chord',       difficulty: 2, target: 5, path: '/exercises/chord',       symbol: '♫' },
  { id: 'melody-d1',   title: 'Melody Phrases',       category: 'melody',      difficulty: 1, target: 3, path: '/exercises/melody',      symbol: '𝄞' },
  { id: 'rhythm-d1',   title: 'Rhythm Drill',         category: 'rhythm',      difficulty: 1, target: 5, path: '/exercises/rhythm',      symbol: '♬' },
  { id: 'prog-d1',     title: 'Progression Read',     category: 'progression', difficulty: 1, target: 5, path: '/exercises/progression', symbol: '♮' },
  { id: 'prog-d2',     title: 'Progression Push',     category: 'progression', difficulty: 2, target: 3, path: '/exercises/progression', symbol: '♮' },
  { id: 'pitch-d1',    title: 'Pitch Tune-up',        category: 'pitch-match', difficulty: 1, target: 5, path: '/exercises/pitch-match', symbol: '𝄢' },
  { id: 'chord-d3',    title: 'Hard Chord Mastery',   category: 'chord',       difficulty: 3, target: 3, path: '/exercises/chord',       symbol: '♫' },
]

function seededRandGen(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0x7fffffff
    return s / 0x7fffffff
  }
}

function todayDateKey(): string {
  const d = new Date()
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
}

function getDailyMissions(): Mission[] {
  const key = todayDateKey()
  let seed = 0
  for (const c of key) seed = (seed * 31 + c.charCodeAt(0)) & 0x7fffffff
  const rand = seededRandGen(seed)
  const pool = [...MISSION_POOL]
  const selected: Mission[] = []
  while (selected.length < 3 && pool.length > 0) {
    const idx = Math.floor(rand() * pool.length)
    selected.push(pool[idx])
    pool.splice(idx, 1)
  }
  return selected
}

const CATEGORY_DISPLAY: Record<Category, string> = {
  interval: 'Intervals', chord: 'Chords', melody: 'Melody',
  rhythm: 'Rhythm', progression: 'Progressions', 'pitch-match': 'Pitch Match',
}
const DIFF_LABEL: Record<1 | 2 | 3, string> = { 1: 'Easy', 2: 'Medium', 3: 'Hard' }

const EXERCISES: {
  category: Category
  label: string
  symbol: string
  path: string
  desc: string
}[] = [
  { category: 'interval', label: 'Intervals', symbol: '♩', path: '/exercises/interval', desc: 'Note distances by ear' },
  { category: 'chord', label: 'Chords', symbol: '♫', path: '/exercises/chord', desc: 'Major, minor, and beyond' },
  { category: 'melody', label: 'Melody', symbol: '𝄞', path: '/exercises/melody', desc: 'Transcribe melodic phrases' },
  { category: 'rhythm', label: 'Rhythm', symbol: '♬', path: '/exercises/rhythm', desc: 'Tap rhythmic patterns' },
  { category: 'progression', label: 'Progressions', symbol: '♮', path: '/exercises/progression', desc: 'Identify chord sequences' },
  { category: 'pitch-match', label: 'Pitch Match', symbol: '𝄢', path: '/exercises/pitch-match', desc: 'Sing notes back in tune' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

export function Dashboard() {
  const { user } = useSession()
  const attempts = useProgressStore((s) => s.attempts)
  const levelInfo = useXPStore((s) => s.levelInfo)
  const spacedRepItems = useSpacedRepStore((s) => s.items)
  const [streak, setStreak] = useState<{ current: number; longest: number } | null>(null)

  useEffect(() => {
    if (!user) return
    getStreak(user.uid).then(setStreak).catch(console.error)
  }, [user])

  // Daily missions
  const dailyMissions = getDailyMissions()
  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0)
  const todayStartMs = todayStart.getTime()
  const correctToday = attempts.filter((a) => a.correct && a.createdAt >= todayStartMs)
  const correctByCategory = correctToday.reduce((acc, a) => {
    acc[a.category] = (acc[a.category] ?? 0) + 1
    return acc
  }, {} as Partial<Record<Category, number>>)

  // Weak spots from spaced rep (items with enough data, sorted by accuracy)
  const weakSpots = Object.entries(spacedRepItems)
    .filter(([, stats]) => stats.total >= 5)
    .map(([key, stats]) => {
      const colonIdx = key.indexOf(':')
      const category = key.slice(0, colonIdx) as Category
      const label = key.slice(colonIdx + 1)
      return { category, label, accuracy: stats.correct / stats.total, total: stats.total }
    })
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 5)

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      padding: '48px 24px',
    }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
          className="dashboard-header"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '40px',
            gap: '16px',
          }}
        >
          <div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '40px',
              fontWeight: 600,
              color: 'var(--text)',
              letterSpacing: '-0.01em',
              margin: 0,
              lineHeight: 1.1,
            }}>
              Dashboard
            </h1>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              color: 'var(--text-muted)',
              margin: '8px 0 0',
              letterSpacing: '0.04em',
            }}>
              Choose a discipline to practice
            </p>
          </div>

          {/* Streak badge */}
          {streak && streak.current > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 18px',
              flexShrink: 0,
            }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '28px',
                color: 'var(--accent)',
                lineHeight: 1,
              }}>
                ♩
              </div>
              <div>
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '22px',
                  fontWeight: 500,
                  color: 'var(--accent)',
                  lineHeight: 1,
                }}>
                  {streak.current}
                </div>
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '10px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  marginTop: '2px',
                }}>
                  Day Streak
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Continue Course Widget */}
        <CourseWidget fadeUp={fadeUp} />

        {/* Daily Missions */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.08 }}
          style={{ marginBottom: '24px' }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            marginBottom: '12px',
          }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '20px',
              fontWeight: 600,
              color: 'var(--text)',
              letterSpacing: '-0.01em',
            }}>
              Today's Missions
            </div>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: '10px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--text-faint)',
            }}>
              Resets at midnight
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {dailyMissions.map((m) => {
              const done = (correctByCategory[m.category] ?? 0) >= m.target
              return (
                <Link key={m.id} to={m.path} style={{ textDecoration: 'none' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '14px 18px',
                    background: done ? 'var(--bg-surface-2)' : 'var(--bg-surface)',
                    border: '1px solid',
                    borderColor: done ? 'var(--success)' : 'var(--border)',
                    borderRadius: 'var(--radius-md)',
                    transition: 'border-color 0.15s, background 0.15s',
                    opacity: done ? 0.75 : 1,
                  }}
                    onMouseEnter={e => {
                      if (!done) (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--accent)'
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = done ? 'var(--success)' : 'var(--border)'
                    }}
                  >
                    {/* Completion dot */}
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      border: '1.5px solid',
                      borderColor: done ? 'var(--success)' : 'var(--border)',
                      background: done ? 'var(--success)' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: '10px',
                      color: '#fff',
                      fontWeight: 700,
                    }}>
                      {done ? '✓' : ''}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '18px',
                      color: 'var(--accent)',
                      lineHeight: 1,
                      flexShrink: 0,
                      opacity: 0.8,
                    }}>
                      {m.symbol}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '12px',
                        fontWeight: 500,
                        color: done ? 'var(--text-muted)' : 'var(--text)',
                        textDecoration: done ? 'line-through' : 'none',
                        marginBottom: '2px',
                      }}>
                        {m.title}
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '10px',
                        color: 'var(--text-faint)',
                        letterSpacing: '0.04em',
                      }}>
                        {CATEGORY_DISPLAY[m.category]} · {DIFF_LABEL[m.difficulty]}
                      </div>
                    </div>
                    {/* Progress counter */}
                    <div style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: done ? 'var(--success)' : 'var(--accent)',
                      letterSpacing: '0.04em',
                      flexShrink: 0,
                    }}>
                      {Math.min(correctByCategory[m.category] ?? 0, m.target)}/{m.target}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </motion.div>

        {/* Exercise grid */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(380px, 100%), 1fr))',
            gap: '1px',
            background: 'var(--border)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            marginBottom: '24px',
          }}
        >
          {EXERCISES.map(({ category, label, symbol, path, desc }) => {
            const recent = attempts.filter((a) => a.category === category).slice(-20)
            const accuracy = recent.length === 0 ? 0 : (recent.filter((a) => a.correct).length / recent.length) * 100
            return (
              <Link key={category} to={path} style={{ textDecoration: 'none', display: 'block' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    padding: '24px 28px',
                    background: 'var(--bg-surface)',
                    transition: 'background 0.15s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-surface-2)'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-surface)'
                  }}
                >
                  {/* Symbol */}
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '32px',
                    color: 'var(--accent)',
                    lineHeight: 1,
                    width: '40px',
                    flexShrink: 0,
                    opacity: 0.85,
                  }}>
                    {symbol}
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '13px',
                      fontWeight: 500,
                      color: 'var(--text)',
                      marginBottom: '3px',
                      letterSpacing: '0.02em',
                    }}>
                      {label}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '11px',
                      color: 'var(--text-muted)',
                      letterSpacing: '0.02em',
                    }}>
                      {desc}
                    </div>
                  </div>

                  {/* Progress ring */}
                  <ProgressRing value={accuracy} label="" size={52} />
                </div>
              </Link>
            )
          })}
        </motion.div>

        {/* Weak Spot Panel */}
        {weakSpots.length > 0 && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.14 }}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              marginBottom: '24px',
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '20px',
                fontWeight: 600,
                color: 'var(--text)',
                letterSpacing: '-0.01em',
              }}>
                Weak Spots
              </div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: '10px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--text-faint)',
              }}>
                Drill these to improve
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {weakSpots.map((spot) => {
                const pct = Math.round(spot.accuracy * 100)
                const path = spot.category === 'progression'
                  ? '/exercises/progression'
                  : spot.category === 'pitch-match'
                    ? '/exercises/pitch-match'
                    : `/exercises/${spot.category}`
                return (
                  <Link key={`${spot.category}:${spot.label}`} to={path} style={{ textDecoration: 'none' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 14px',
                      background: 'var(--bg-surface-2)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      transition: 'border-color 0.15s',
                    }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--accent)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)' }}
                    >
                      <div style={{ flex: 1 }}>
                        <span style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '12px',
                          fontWeight: 500,
                          color: 'var(--text)',
                        }}>
                          {spot.label}
                        </span>
                        <span style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '10px',
                          color: 'var(--text-faint)',
                          marginLeft: '8px',
                          letterSpacing: '0.04em',
                        }}>
                          {CATEGORY_DISPLAY[spot.category]}
                        </span>
                      </div>
                      {/* Accuracy bar */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                        <div style={{ width: '80px', height: '4px', background: 'var(--bg-highlight)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{
                            height: '100%',
                            width: `${pct}%`,
                            background: pct < 40 ? 'var(--error)' : pct < 65 ? 'var(--accent)' : 'var(--success)',
                            borderRadius: '2px',
                          }} />
                        </div>
                        <span style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '11px',
                          fontWeight: 600,
                          color: pct < 40 ? 'var(--error)' : pct < 65 ? 'var(--accent)' : 'var(--success)',
                          minWidth: '32px',
                          textAlign: 'right',
                        }}>
                          {pct}%
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* XP / Level bar */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.16 }}
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            marginBottom: '0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: '10px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--accent)',
                fontWeight: 600,
                background: 'var(--accent-dim)',
                border: '1px solid var(--accent)',
                borderRadius: 'var(--radius)',
                padding: '3px 8px',
              }}>
                Lv {levelInfo.level}
              </span>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '17px',
                fontWeight: 500,
                color: 'var(--text)',
                letterSpacing: '-0.01em',
              }}>
                {levelInfo.title}
              </span>
            </div>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              color: 'var(--text-muted)',
              letterSpacing: '0.04em',
            }}>
              {levelInfo.totalXP.toLocaleString()} XP
            </span>
          </div>

          {/* Progress bar */}
          <div style={{
            height: '6px',
            background: 'var(--bg-highlight)',
            borderRadius: '3px',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${levelInfo.progressPct}%`,
              background: 'var(--accent)',
              borderRadius: '3px',
              transition: 'width 0.4s ease',
              boxShadow: '0 0 6px var(--accent-glow)',
            }} />
          </div>

          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: '10px',
            color: 'var(--text-faint)',
            letterSpacing: '0.04em',
          }}>
            {levelInfo.progressPct < 100
              ? `${levelInfo.currentXP} / ${levelInfo.xpForLevel} XP to level ${levelInfo.level + 1}`
              : 'Max level reached'}
          </div>
        </motion.div>

        {/* Accuracy explainer */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.18 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 20px',
          }}
        >
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: '1.5px solid var(--accent)',
            color: 'var(--accent)',
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            %
          </div>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            color: 'var(--text-muted)',
            margin: 0,
            lineHeight: 1.7,
            letterSpacing: '0.02em',
          }}>
            Each ring shows your <span style={{ color: 'var(--text)' }}>correct answer rate over your last 20 attempts</span> in that discipline. It updates as you practice.
          </p>
        </motion.div>

        {/* Quick practice CTA */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.26 }}
          className="quick-practice-card"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '20px 24px',
          }}
        >
          <div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '20px',
              fontWeight: 600,
              color: 'var(--text)',
              marginBottom: '4px',
            }}>
              Quick Practice
            </div>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              color: 'var(--text-muted)',
              letterSpacing: '0.02em',
            }}>
              Jump straight into interval training to keep your skills sharp.
            </div>
          </div>
          <Link to="/exercises/interval" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <button style={{
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontWeight: 600,
              background: 'var(--accent)',
              color: '#0F0D0B',
              border: 'none',
              borderRadius: 'var(--radius)',
              padding: '10px 20px',
              cursor: 'pointer',
              boxShadow: '0 2px 12px var(--accent-glow)',
              whiteSpace: 'nowrap',
              transition: 'background 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-bright)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)' }}
            >
              Start Intervals →
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

function CourseWidget({ fadeUp }: { fadeUp: { hidden: { opacity: number; y: number }; visible: { opacity: number; y: number } } }) {
  const courseProgress = useCourseStore((s) => s.progress)

  // Find active (in-progress, not completed) course
  const activeCourse = COURSES.find((c) => {
    const cp = courseProgress[c.id]
    return cp && !cp.completedAt
  })

  if (!activeCourse) {
    // No active course — show CTA
    return (
      <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.5, delay: 0.06 }} style={{ marginBottom: '24px' }}>
        <Link to="/courses" style={{ textDecoration: 'none' }}>
          <div
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
              padding: '18px 22px', background: 'var(--bg-surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)', transition: 'border-color 0.15s', cursor: 'pointer',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--accent)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)' }}
          >
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: 600, color: 'var(--text)', marginBottom: '3px' }}>
                Start a Course
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.02em' }}>
                Structured lessons to build your ear step by step
              </div>
            </div>
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600,
              letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent)',
              whiteSpace: 'nowrap',
            }}>
              Browse →
            </span>
          </div>
        </Link>
      </motion.div>
    )
  }

  const cp = courseProgress[activeCourse.id]!
  const course = getCourse(activeCourse.id)!
  const completedCount = cp.completedLessons.length
  const totalLessons = course.lessons.length
  const pct = Math.round((completedCount / totalLessons) * 100)
  const currentLesson = course.lessons.find((l) => !cp.completedLessons.includes(l.id))

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.5, delay: 0.06 }} style={{ marginBottom: '24px' }}>
      <Link to={currentLesson ? `/courses/${course.id}/${currentLesson.id}` : `/courses/${course.id}`} style={{ textDecoration: 'none' }}>
        <div
          style={{
            padding: '18px 22px', background: 'var(--bg-surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)', transition: 'border-color 0.15s', cursor: 'pointer',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--accent)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--accent)', lineHeight: 1, opacity: 0.85 }}>
                {course.symbol}
              </span>
              <div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>
                  {course.title}
                </div>
                {currentLesson && (
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.04em', marginTop: '2px' }}>
                    Next: {currentLesson.title}
                  </div>
                )}
              </div>
            </div>
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600,
              letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent)',
              whiteSpace: 'nowrap',
            }}>
              Continue →
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ flex: 1, height: '4px', background: 'var(--bg-highlight)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: 'var(--accent)', borderRadius: '2px', transition: 'width 0.3s ease' }} />
            </div>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'var(--text-faint)', letterSpacing: '0.04em' }}>
              {completedCount}/{totalLessons}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
