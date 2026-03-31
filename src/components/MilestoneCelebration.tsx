import { useEffect, useState } from 'react'
import { useAchievementStore } from '@/store/useAchievementStore'
import type { Category } from '@/exercises/types'

const CATEGORY_LABELS: Record<Category, string> = {
  'interval':    'intervals',
  'chord':       'chords',
  'melody':      'melodies',
  'rhythm':      'rhythms',
  'progression': 'progressions',
  'pitch-match': 'pitches',
}

const CATEGORY_SYMBOLS: Record<Category, string> = {
  'interval':    '𝄞',
  'chord':       '♫',
  'melody':      '♪',
  'rhythm':      '♬',
  'progression': '♮',
  'pitch-match': '♩',
}

const MILESTONE_MESSAGES: Record<number, string> = {
  10:   'The ear is waking up.',
  25:   'Finding your groove.',
  50:   'Building real intuition.',
  100:  'A solid century. Keep pushing.',
  250:  'Your ears are truly sharpening.',
  500:  "That's dedication.",
  1000: 'Legendary. Your ear is trained.',
}

export function MilestoneCelebration() {
  const milestoneQueue = useAchievementStore((s) => s.milestoneQueue)
  const dismissMilestone = useAchievementStore((s) => s.dismissMilestone)
  const [visible, setVisible] = useState(false)

  const current = milestoneQueue[0] ?? null

  useEffect(() => {
    if (!current) return
    setVisible(true)
    const hideTimer = setTimeout(() => setVisible(false), 2600)
    const dismissTimer = setTimeout(() => dismissMilestone(), 3000)
    return () => {
      clearTimeout(hideTimer)
      clearTimeout(dismissTimer)
    }
  }, [current?.category, current?.count]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!current) return null

  const label = CATEGORY_LABELS[current.category]
  const symbol = CATEGORY_SYMBOLS[current.category]
  const suffix = MILESTONE_MESSAGES[current.count] ?? ''

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          background: 'var(--bg-surface-2)',
          border: '1px solid var(--accent)',
          borderRadius: '16px',
          padding: '36px 48px',
          textAlign: 'center',
          boxShadow: '0 8px 64px rgba(212,146,58,0.30)',
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.92) translateY(8px)',
          transition: 'opacity 0.4s ease, transform 0.4s ease',
          maxWidth: '380px',
          width: '90vw',
        }}
      >
        {/* Symbol */}
        <div style={{
          fontSize: '40px',
          color: 'var(--accent)',
          fontFamily: 'Georgia, serif',
          marginBottom: '16px',
          lineHeight: 1,
        }}>
          {symbol}
        </div>

        {/* Count line */}
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(22px, 5vw, 30px)',
          fontWeight: 700,
          color: 'var(--text)',
          lineHeight: 1.15,
          marginBottom: '8px',
        }}>
          You've nailed{' '}
          <span style={{ color: 'var(--accent)' }}>
            {current.count.toLocaleString()}
          </span>{' '}
          {label}!
        </div>

        {/* Suffix */}
        {suffix && (
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            color: 'var(--text-muted)',
            letterSpacing: '0.04em',
          }}>
            {suffix}
          </div>
        )}
      </div>
    </div>
  )
}
