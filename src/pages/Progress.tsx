import { useEffect, useState } from 'react'
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { useSession } from '@/hooks/useSession'
import { useProgressStore } from '@/store/useProgressStore'
import { getStreak } from '@/db/streaks'
import { getRecentAttempts } from '@/db/progress'
import type { Category } from '@/exercises/types'

const CATEGORIES: Category[] = ['interval', 'chord', 'melody', 'rhythm']

interface LinePoint {
  date: string
  accuracy: number
}

const SYMBOLS: Record<Category, string> = {
  interval: '♩',
  chord: '♫',
  melody: '𝄞',
  rhythm: '♬',
}

export function Progress() {
  const { user } = useSession()
  const getAccuracy = useProgressStore((s) => s.getAccuracy)
  const [streak, setStreak] = useState<{ current: number; longest: number } | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<Category>('interval')
  const [lineData, setLineData] = useState<LinePoint[]>([])

  const radarData = CATEGORIES.map((c) => ({
    category: c.charAt(0).toUpperCase() + c.slice(1),
    accuracy: getAccuracy(c),
  }))

  useEffect(() => {
    if (!user) return
    getStreak(user.uid).then(setStreak).catch(console.error)
  }, [user])

  useEffect(() => {
    if (!user) return
    getRecentAttempts(user.uid, selectedCategory, 20)
      .then((attempts) => {
        const points: LinePoint[] = attempts.reverse().map((a) => ({
          date: new Date(a.createdAt).toLocaleDateString(),
          accuracy: a.correct ? 100 : 0,
        }))
        setLineData(points)
      })
      .catch(console.error)
  }, [user, selectedCategory])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '48px 24px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Title */}
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
            Progress
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            color: 'var(--text-muted)',
            margin: '8px 0 0',
            letterSpacing: '0.04em',
          }}>
            Your ear training history
          </p>
        </div>

        {/* Streak card */}
        {streak && (
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '24px',
            display: 'flex',
            gap: '1px',
          }}>
            {[
              { label: 'Current streak', value: streak.current },
              { label: 'Longest streak', value: streak.longest },
            ].map(({ label, value }, i) => (
              <div key={label} style={{
                flex: 1,
                textAlign: 'center',
                paddingLeft: i > 0 ? '24px' : 0,
                borderLeft: i > 0 ? '1px solid var(--border)' : 'none',
                marginLeft: i > 0 ? '24px' : 0,
              }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '48px',
                  fontWeight: 600,
                  color: 'var(--accent)',
                  lineHeight: 1,
                }}>
                  {value}
                </div>
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '10px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  marginTop: '6px',
                }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Radar chart */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '24px',
        }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '20px',
            fontWeight: 600,
            color: 'var(--text)',
            marginBottom: '20px',
          }}>
            Accuracy by Category
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis
                dataKey="category"
                tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-body)' }}
              />
              <Radar
                name="Accuracy"
                dataKey="accuracy"
                stroke="var(--accent)"
                fill="var(--accent)"
                fillOpacity={0.15}
                strokeWidth={1.5}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Line chart */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '24px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
          }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '20px',
              fontWeight: 600,
              color: 'var(--text)',
            }}>
              Accuracy Over Time
            </div>

            {/* Category selector */}
            <div style={{ display: 'flex', gap: '4px' }}>
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  title={c.charAt(0).toUpperCase() + c.slice(1)}
                  style={{
                    width: '30px',
                    height: '26px',
                    background: selectedCategory === c ? 'var(--accent)' : 'transparent',
                    color: selectedCategory === c ? '#0F0D0B' : 'var(--text-muted)',
                    border: '1px solid',
                    borderColor: selectedCategory === c ? 'var(--accent)' : 'var(--border)',
                    borderRadius: 'var(--radius)',
                    fontFamily: 'var(--font-display)',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.12s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {SYMBOLS[c]}
                </button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: 'var(--text-faint)', fontSize: 10, fontFamily: 'var(--font-body)' }}
                axisLine={{ stroke: 'var(--border)' }}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: 'var(--text-faint)', fontSize: 10, fontFamily: 'var(--font-body)' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-surface-2)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  color: 'var(--text)',
                }}
              />
              <Line
                type="monotone"
                dataKey="accuracy"
                stroke="var(--accent)"
                dot={false}
                strokeWidth={1.5}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
