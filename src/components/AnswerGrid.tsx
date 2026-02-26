interface Props {
  options: string[]
  onAnswer: (answer: string) => void
  correct?: string
  selected?: string
  disabled?: boolean
}

function getButtonStyle(
  option: string,
  correct: string | undefined,
  selected: string | undefined,
  base: React.CSSProperties,
): React.CSSProperties {
  const isRevealed = selected !== undefined || correct !== undefined

  if (!isRevealed) return base

  if (option === correct) {
    return {
      ...base,
      background: 'var(--success-dim)',
      borderColor: 'var(--success)',
      color: 'var(--success)',
    }
  }
  if (option === selected && option !== correct) {
    return {
      ...base,
      background: 'var(--error-dim)',
      borderColor: 'var(--error)',
      color: 'var(--error)',
    }
  }
  return {
    ...base,
    opacity: 0.4,
    cursor: 'default',
  }
}

const baseStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  padding: '10px 12px',
  background: 'var(--bg-surface-2)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  color: 'var(--text)',
  fontFamily: 'var(--font-body)',
  fontSize: '13px',
  fontWeight: 500,
  cursor: 'pointer',
  textAlign: 'center',
  transition: 'border-color 0.12s, background 0.12s, color 0.12s',
  letterSpacing: '0.02em',
}

export function AnswerGrid({ options, onAnswer, correct, selected, disabled }: Props) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
      gap: '8px',
      width: '100%',
    }}>
      {options.map((option, i) => {
        const style = getButtonStyle(option, correct, selected, baseStyle)
        return (
          <button
            key={option}
            onClick={() => !disabled && onAnswer(option)}
            disabled={disabled}
            style={style}
            onMouseEnter={e => {
              if (!disabled && !correct && !selected) {
                e.currentTarget.style.borderColor = 'var(--accent)'
                e.currentTarget.style.color = 'var(--accent)'
              }
            }}
            onMouseLeave={e => {
              if (!disabled && !correct && !selected) {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.color = 'var(--text)'
              }
            }}
          >
            {i < 9 && (
              <span style={{
                position: 'absolute',
                top: '4px',
                left: '6px',
                fontSize: '9px',
                color: 'var(--text-faint)',
                fontFamily: 'var(--font-body)',
              }}>
                {i + 1}
              </span>
            )}
            {option}
          </button>
        )
      })}
    </div>
  )
}
