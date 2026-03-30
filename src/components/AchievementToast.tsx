import { useEffect, useRef, useState } from 'react'
import { useAchievementStore } from '@/store/useAchievementStore'
import { ACHIEVEMENT_MAP } from '@/lib/achievements'

export function AchievementToast() {
  const queue = useAchievementStore((s) => s.queue)
  const dismissQueue = useAchievementStore((s) => s.dismissQueue)
  const [pending, setPending] = useState<string[]>([])
  const [current, setCurrent] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)
  const processingRef = useRef(false)

  // Absorb new items from the store into local pending list
  useEffect(() => {
    if (queue.length > 0) {
      setPending((prev) => [...prev, ...queue])
      dismissQueue()
    }
  }, [queue, dismissQueue])

  // Process pending queue one at a time
  useEffect(() => {
    if (processingRef.current || pending.length === 0) return
    processingRef.current = true
    const [next, ...rest] = pending
    setPending(rest)
    setCurrent(next)
    setVisible(true)

    const hideTimer = setTimeout(() => setVisible(false), 3800)
    const clearTimer = setTimeout(() => {
      setCurrent(null)
      processingRef.current = false
    }, 4200)

    return () => {
      clearTimeout(hideTimer)
      clearTimeout(clearTimer)
    }
  }, [pending])

  if (!current) return null
  const achievement = ACHIEVEMENT_MAP.get(current)
  if (!achievement) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '28px',
        right: '28px',
        zIndex: 9999,
        maxWidth: '320px',
        background: 'var(--bg-surface-2)',
        border: '1px solid var(--accent)',
        borderRadius: '10px',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        boxShadow: '0 4px 32px rgba(212,146,58,0.22)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.35s ease, transform 0.35s ease',
        pointerEvents: 'none',
      }}
    >
      {/* Symbol */}
      <div style={{
        width: '48px',
        height: '48px',
        flexShrink: 0,
        background: 'var(--accent-dim)',
        border: '1px solid var(--accent)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        color: 'var(--accent)',
        fontFamily: 'Georgia, serif',
      }}>
        {achievement.symbol}
      </div>

      {/* Text */}
      <div>
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: '10px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--accent)',
          fontWeight: 600,
          marginBottom: '3px',
        }}>
          Achievement Unlocked
        </div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '17px',
          fontWeight: 700,
          color: 'var(--text)',
          lineHeight: 1.2,
          marginBottom: '2px',
        }}>
          {achievement.name}
        </div>
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: '11px',
          color: 'var(--text-muted)',
          lineHeight: 1.4,
        }}>
          {achievement.description}
        </div>
      </div>
    </div>
  )
}
