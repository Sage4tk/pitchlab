import { useState } from 'react'

interface Props {
  subdivisions: number
  bpm: number
  onSubmit: (pattern: boolean[]) => void
  disabled?: boolean
}

export function RhythmPad({ subdivisions, onSubmit, disabled }: Props) {
  const [selected, setSelected] = useState<boolean[]>(Array(subdivisions).fill(false))

  function toggleBeat(i: number) {
    if (disabled) return
    setSelected((prev) => prev.map((v, idx) => (idx === i ? !v : v)))
  }

  function handleSubmit() {
    onSubmit(selected)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '11px',
        color: 'var(--text-muted)',
        margin: 0,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
      }}>
        Click the beats you heard
      </p>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {selected.map((hit, i) => (
          <button
            key={i}
            onClick={() => toggleBeat(i)}
            disabled={disabled}
            style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius)',
              background: hit ? 'var(--accent)' : 'var(--bg-surface-2)',
              border: `1px solid ${hit ? 'var(--accent)' : 'var(--border)'}`,
              cursor: disabled ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              fontWeight: hit ? '500' : '400',
              color: hit ? '#1a1208' : 'var(--text-muted)',
              transition: 'background 0.12s, border-color 0.12s, box-shadow 0.12s',
              boxShadow: hit ? '0 2px 10px var(--accent-glow)' : 'none',
              outline: 'none',
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={disabled}
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '12px',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          padding: '8px 28px',
          borderRadius: 'var(--radius)',
          background: 'var(--accent)',
          border: 'none',
          color: '#1a1208',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          transition: 'opacity 0.15s',
        }}
      >
        Submit
      </button>
    </div>
  )
}
