import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSession } from '@/hooks/useSession'
import { useProgressStore } from '@/store/useProgressStore'
import { useXPStore } from '@/store/useXPStore'
import { getStreak } from '@/db/streaks'
import { ProgressRing } from '@/components/ProgressRing'
import type { Category } from '@/exercises/types'
import { motion } from 'framer-motion'

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
]

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

export function Dashboard() {
  const { user } = useSession()
  const attempts = useProgressStore((s) => s.attempts)
  const levelInfo = useXPStore((s) => s.levelInfo)
  const [streak, setStreak] = useState<{ current: number; longest: number } | null>(null)

  useEffect(() => {
    if (!user) return
    getStreak(user.uid).then(setStreak).catch(console.error)
  }, [user])

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
