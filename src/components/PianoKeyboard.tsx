interface Props {
  onKeyPress: (note: string) => void
  highlightNotes?: string[]
  disabled?: boolean
}

// Two octaves: C3–B4
const WHITE_NOTES = [
  'C3','D3','E3','F3','G3','A3','B3',
  'C4','D4','E4','F4','G4','A4','B4',
]

const BLACK_NOTE_MAP: Record<string, string | null> = {
  C3: 'C#3', D3: 'D#3', E3: null, F3: 'F#3', G3: 'G#3', A3: 'A#3', B3: null,
  C4: 'C#4', D4: 'D#4', E4: null, F4: 'F#4', G4: 'G#4', A4: 'A#4', B4: null,
}

const WHITE_KEY_W = 36
const WHITE_KEY_H = 120
const BLACK_KEY_W = 22
const BLACK_KEY_H = 75
const SVG_WIDTH = WHITE_NOTES.length * WHITE_KEY_W
const SVG_HEIGHT = WHITE_KEY_H

function blackKeyX(whiteIdx: number): number {
  return whiteIdx * WHITE_KEY_W + WHITE_KEY_W - BLACK_KEY_W / 2
}

export function PianoKeyboard({ onKeyPress, highlightNotes = [], disabled }: Props) {
  const highlighted = new Set(highlightNotes)

  return (
    <svg
      width={SVG_WIDTH}
      height={SVG_HEIGHT}
      viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
      className="touch-none select-none"
    >
      {/* White keys */}
      {WHITE_NOTES.map((note, i) => (
        <rect
          key={note}
          x={i * WHITE_KEY_W}
          y={0}
          width={WHITE_KEY_W - 1}
          height={WHITE_KEY_H}
          rx={3}
          fill={highlighted.has(note) ? '#a5b4fc' : 'white'}
          stroke="#d1d5db"
          strokeWidth={1}
          style={{ cursor: disabled ? 'default' : 'pointer' }}
          onClick={() => !disabled && onKeyPress(note)}
        />
      ))}
      {/* Black keys */}
      {WHITE_NOTES.map((note, i) => {
        const black = BLACK_NOTE_MAP[note]
        if (!black) return null
        return (
          <rect
            key={black}
            x={blackKeyX(i)}
            y={0}
            width={BLACK_KEY_W}
            height={BLACK_KEY_H}
            rx={2}
            fill={highlighted.has(black) ? '#6366f1' : '#1f2937'}
            style={{ cursor: disabled ? 'default' : 'pointer' }}
            onClick={() => !disabled && onKeyPress(black)}
          />
        )
      })}
    </svg>
  )
}
