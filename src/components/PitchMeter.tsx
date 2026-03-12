interface PitchMeterProps {
  targetNote: string
  detectedNote: string | null
  detectedCents: number
  isCorrect: boolean
}

export function PitchMeter({ targetNote, detectedNote, detectedCents, isCorrect }: PitchMeterProps) {
  const absC = Math.abs(detectedCents)
  const meterColor = detectedNote == null
    ? 'var(--border)'
    : isCorrect
      ? 'var(--success)'
      : absC <= 30
        ? 'var(--accent)'
        : 'var(--text-muted)'

  // Map cents (-50..+50) to 0..100%
  const clampedCents = Math.max(-50, Math.min(50, detectedCents))
  const indicatorPct = ((clampedCents + 50) / 100) * 100

  const statusText =
    detectedNote == null
      ? 'Sing a note...'
      : isCorrect
        ? 'In tune!'
        : detectedCents > 0
          ? 'Too high'
          : 'Too low'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '8px 0' }}>
      {/* Target note */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: '10px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
        }}>
          Target Note
        </div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '56px',
          fontWeight: 600,
          color: 'var(--accent)',
          lineHeight: 1,
          letterSpacing: '-0.02em',
        }}>
          {targetNote}
        </div>
      </div>

      {/* Detected note */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: '10px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
        }}>
          You
        </div>
        <div style={{
          fontFamily: 'var(--font-mono, var(--font-body))',
          fontSize: '32px',
          fontWeight: 500,
          color: detectedNote ? meterColor : 'var(--text-faint)',
          lineHeight: 1,
          minWidth: '60px',
          textAlign: 'center',
          transition: 'color 0.15s',
        }}>
          {detectedNote ?? '—'}
        </div>
      </div>

      {/* Meter bar */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ position: 'relative', height: '20px', background: 'var(--bg-surface-2)', borderRadius: 'var(--radius)', overflow: 'visible', border: '1px solid var(--border)' }}>
          {/* Center tick */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: '2px',
            transform: 'translateX(-50%)',
            background: 'var(--border)',
          }} />
          {/* ±15 cent zone markers */}
          <div style={{
            position: 'absolute',
            left: 'calc(50% - 15%)',
            top: '25%',
            bottom: '25%',
            right: 'calc(50% - 15%)',
            background: 'var(--success)',
            opacity: 0.12,
            borderRadius: '2px',
          }} />
          {/* Moving indicator */}
          {detectedNote && (
            <div style={{
              position: 'absolute',
              left: `${indicatorPct}%`,
              top: '50%',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: meterColor,
              transform: 'translate(-50%, -50%)',
              boxShadow: `0 0 8px ${meterColor}`,
              transition: 'left 0.08s, background 0.15s',
            }} />
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-body)', fontSize: '9px', color: 'var(--text-faint)', letterSpacing: '0.06em' }}>
          <span>-50</span>
          <span>0</span>
          <span>+50</span>
        </div>
      </div>

      {/* Status text */}
      <div style={{
        fontFamily: 'var(--font-body)',
        fontSize: '13px',
        fontWeight: 500,
        letterSpacing: '0.04em',
        color: meterColor,
        transition: 'color 0.15s',
        minHeight: '20px',
      }}>
        {statusText}
      </div>
    </div>
  )
}
