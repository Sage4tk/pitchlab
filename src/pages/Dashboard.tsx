import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSession } from '@/hooks/useSession'
import { useProgressStore } from '@/store/useProgressStore'
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
]

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

export function Dashboard() {
  const { user } = useSession()
  const getAccuracy = useProgressStore((s) => s.getAccuracy)
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
            gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
            gap: '1px',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            marginBottom: '24px',
          }}
        >
          {EXERCISES.map(({ category, label, symbol, path, desc }, i) => {
            const accuracy = getAccuracy(category)
            return (
              <Link key={category} to={path} style={{ textDecoration: 'none', display: 'block' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    padding: '24px 28px',
                    background: 'var(--bg-surface)',
                    borderRight: i % 2 === 0 ? '1px solid var(--border)' : 'none',
                    borderBottom: i < 2 ? '1px solid var(--border)' : 'none',
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

        {/* Quick practice CTA */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.2 }}
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
