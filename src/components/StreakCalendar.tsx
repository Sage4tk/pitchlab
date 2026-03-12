import { useMemo, useState } from 'react'

interface Props {
  practiceDays: Record<string, number>
  weeks?: number
}

function dateStr(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function cellColor(count: number): string {
  if (count === 0) return 'var(--bg-highlight)'
  if (count <= 5) return 'rgba(212, 146, 58, 0.28)'
  if (count <= 15) return 'rgba(212, 146, 58, 0.62)'
  return '#D4923A'
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const SHOW_LABEL = [false, true, false, true, false, true, false]
const CELL = 13
const GAP = 3

export function StreakCalendar({ practiceDays, weeks = 16 }: Props) {
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null)

  const { grid, monthLabels } = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const dayOfWeek = today.getDay()
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - dayOfWeek)

    const gridStart = new Date(weekStart)
    gridStart.setDate(weekStart.getDate() - (weeks - 1) * 7)

    const grid: Array<Array<{ date: string; count: number; isToday: boolean; isFuture: boolean }>> = []
    const monthLabels: Array<{ label: string; colIndex: number }> = []
    const seenMonths = new Set<string>()

    for (let w = 0; w < weeks; w++) {
      const week = []
      for (let d = 0; d < 7; d++) {
        const date = new Date(gridStart)
        date.setDate(gridStart.getDate() + w * 7 + d)
        const ds = dateStr(date)
        const monthKey = ds.slice(0, 7)
        if (!seenMonths.has(monthKey) && date <= today) {
          seenMonths.add(monthKey)
          monthLabels.push({
            label: date.toLocaleDateString('en-US', { month: 'short' }),
            colIndex: w,
          })
        }
        week.push({
          date: ds,
          count: practiceDays[ds] ?? 0,
          isToday: ds === dateStr(today),
          isFuture: date > today,
        })
      }
      grid.push(week)
    }

    return { grid, monthLabels }
  }, [practiceDays, weeks])

  const gridWidth = weeks * (CELL + GAP) - GAP
  const dayLabelWidth = 28

  return (
    <div style={{ position: 'relative', overflowX: 'auto' }}>
      {/* Month labels */}
      <div style={{ paddingLeft: `${dayLabelWidth}px`, position: 'relative', height: '18px', minWidth: `${dayLabelWidth + gridWidth}px` }}>
        {monthLabels.map(({ label, colIndex }) => (
          <span
            key={label + colIndex}
            style={{
              position: 'absolute',
              left: `${dayLabelWidth + colIndex * (CELL + GAP)}px`,
              fontFamily: 'var(--font-body)',
              fontSize: '9px',
              color: 'var(--text-muted)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'flex', gap: `${GAP}px`, minWidth: `${dayLabelWidth + gridWidth}px` }}>
        {/* Day labels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: `${GAP}px`, width: `${dayLabelWidth}px`, flexShrink: 0 }}>
          {DAY_LABELS.map((label, i) => (
            <div
              key={label}
              style={{
                height: `${CELL}px`,
                fontFamily: 'var(--font-body)',
                fontSize: '9px',
                color: SHOW_LABEL[i] ? 'var(--text-muted)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                letterSpacing: '0.04em',
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Week columns */}
        {grid.map((week, w) => (
          <div key={w} style={{ display: 'flex', flexDirection: 'column', gap: `${GAP}px` }}>
            {week.map(({ date, count, isToday, isFuture }) => (
              <div
                key={date}
                style={{
                  width: `${CELL}px`,
                  height: `${CELL}px`,
                  borderRadius: '3px',
                  background: isFuture ? 'transparent' : cellColor(count),
                  border: isToday ? '1px solid var(--accent)' : '1px solid transparent',
                  opacity: isFuture ? 0 : 1,
                  cursor: count > 0 ? 'pointer' : 'default',
                  transition: 'opacity 0.1s',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  if (isFuture) return
                  const rect = e.currentTarget.getBoundingClientRect()
                  const parentRect = e.currentTarget.closest('[data-calendar]')?.getBoundingClientRect()
                  const text = count === 0
                    ? `${date} — no practice`
                    : `${date} — ${count} attempt${count !== 1 ? 's' : ''}`
                  setTooltip({
                    text,
                    x: rect.left - (parentRect?.left ?? 0) + CELL / 2,
                    y: rect.top - (parentRect?.top ?? 0) - 6,
                  })
                }}
                onMouseLeave={() => setTooltip(null)}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Floating tooltip */}
      {tooltip && (
        <div
          style={{
            position: 'absolute',
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: 'translate(-50%, -100%)',
            background: 'var(--bg-surface-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '4px 8px',
            fontFamily: 'var(--font-body)',
            fontSize: '10px',
            color: 'var(--text)',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 10,
            letterSpacing: '0.02em',
          }}
        >
          {tooltip.text}
        </div>
      )}

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', paddingLeft: `${dayLabelWidth}px` }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '9px', color: 'var(--text-faint)', letterSpacing: '0.04em' }}>Less</span>
        {[0, 3, 10, 20].map((count, i) => (
          <div
            key={i}
            style={{
              width: `${CELL}px`,
              height: `${CELL}px`,
              borderRadius: '3px',
              background: cellColor(count),
            }}
          />
        ))}
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '9px', color: 'var(--text-faint)', letterSpacing: '0.04em' }}>More</span>
      </div>
    </div>
  )
}
