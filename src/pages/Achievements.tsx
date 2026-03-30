import { useAchievementStore } from '@/store/useAchievementStore'
import { ACHIEVEMENTS, type Achievement } from '@/lib/achievements'

const GROUP_LABELS: Record<string, string> = {
  milestones: '♩ Milestones',
  streaks:    '♭ Streaks',
  mastery:    '✦ Mastery',
  level:      '★ Level & XP',
  special:    '𝄢 Special',
}

const GROUPS = ['milestones', 'streaks', 'mastery', 'level', 'special'] as const

function BadgeCard({ achievement, unlockedAt }: { achievement: Achievement; unlockedAt: number | undefined }) {
  const locked = unlockedAt === undefined

  return (
    <div style={{
      background: locked ? 'var(--bg-surface)' : 'var(--bg-surface-2)',
      border: locked ? '1px solid var(--border)' : '1px solid var(--accent)',
      borderRadius: '10px',
      padding: '20px 16px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
      textAlign: 'center',
      opacity: locked ? 0.45 : 1,
      boxShadow: locked ? 'none' : '0 0 16px rgba(212,146,58,0.12)',
      transition: 'opacity 0.2s',
    }}>
      <div style={{
        width: '52px',
        height: '52px',
        background: locked ? 'var(--bg)' : 'var(--accent-dim)',
        border: `1px solid ${locked ? 'var(--border)' : 'var(--accent)'}`,
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '26px',
        color: locked ? 'var(--text-faint)' : 'var(--accent)',
        fontFamily: 'Georgia, serif',
        filter: locked ? 'grayscale(1)' : 'none',
      }}>
        {achievement.symbol}
      </div>

      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '15px',
        fontWeight: 700,
        color: locked ? 'var(--text-faint)' : 'var(--text)',
        lineHeight: 1.2,
      }}>
        {achievement.name}
      </div>

      <div style={{
        fontFamily: 'var(--font-body)',
        fontSize: '11px',
        color: 'var(--text-muted)',
        lineHeight: 1.5,
      }}>
        {achievement.description}
      </div>

      {!locked && (
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: '10px',
          color: 'var(--accent)',
          letterSpacing: '0.05em',
          marginTop: '2px',
        }}>
          {new Date(unlockedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      )}

      {locked && (
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: '10px',
          color: 'var(--text-faint)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginTop: '2px',
        }}>
          Locked
        </div>
      )}
    </div>
  )
}

export function Achievements() {
  const unlocked = useAchievementStore((s) => s.unlocked)
  const unlockedCount = Object.keys(unlocked).length
  const total = ACHIEVEMENTS.length

  return (
    <div style={{
      maxWidth: '860px',
      margin: '0 auto',
      padding: '40px 24px 80px',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(28px, 5vw, 38px)',
          fontWeight: 700,
          color: 'var(--text)',
          marginBottom: '8px',
        }}>
          𝄞 Achievements
        </h1>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            color: 'var(--text-muted)',
          }}>
            {unlockedCount} of {total} unlocked
          </span>
          {/* Progress bar */}
          <div style={{
            flex: 1,
            maxWidth: '200px',
            height: '4px',
            background: 'var(--border)',
            borderRadius: '2px',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${(unlockedCount / total) * 100}%`,
              background: 'var(--accent)',
              borderRadius: '2px',
              transition: 'width 0.5s ease',
            }} />
          </div>
        </div>
      </div>

      {/* Groups */}
      {GROUPS.map((group) => {
        const items = ACHIEVEMENTS.filter((a) => a.group === group)
        return (
          <div key={group} style={{ marginBottom: '48px' }}>
            <h2 style={{
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: '16px',
              paddingBottom: '8px',
              borderBottom: '1px solid var(--border)',
            }}>
              {GROUP_LABELS[group]}
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: '14px',
            }}>
              {items.map((a) => (
                <BadgeCard
                  key={a.id}
                  achievement={a}
                  unlockedAt={unlocked[a.id]}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
