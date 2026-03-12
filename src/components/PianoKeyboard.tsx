interface Props {
  onKeyPress: (note: string) => void
  highlightNotes?: string[]
  activeNotes?: string[]
  disabled?: boolean
  keyMap?: Record<string, string> // note → keyboard key label
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

export function PianoKeyboard({ onKeyPress, highlightNotes = [], activeNotes = [], disabled, keyMap = {} }: Props) {
  const highlighted = new Set(highlightNotes)
  const active = new Set(activeNotes)

  function whiteKeyFill(note: string): string {
    if (active.has(note)) return '#D4923A'
    if (highlighted.has(note)) return '#a5b4fc'
    return 'white'
  }

  function blackKeyFill(note: string): string {
    if (active.has(note)) return '#b87830'
    if (highlighted.has(note)) return '#6366f1'
    return '#1f2937'
  }

  return (
    <svg
      width={SVG_WIDTH}
      height={SVG_HEIGHT}
      viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
      className="touch-none select-none"
    >
      {/* White keys */}
      {WHITE_NOTES.map((note, i) => (
        <g key={note} onClick={() => !disabled && onKeyPress(note)} style={{ cursor: disabled ? 'default' : 'pointer' }}>
          <rect
            x={i * WHITE_KEY_W}
            y={0}
            width={WHITE_KEY_W - 1}
            height={WHITE_KEY_H}
            rx={3}
            fill={whiteKeyFill(note)}
            stroke="#d1d5db"
            strokeWidth={1}
          />
          {keyMap[note] && (
            <text
              x={i * WHITE_KEY_W + (WHITE_KEY_W - 1) / 2}
              y={WHITE_KEY_H - 10}
              textAnchor="middle"
              fontSize={9}
              fontFamily="monospace"
              fill="#9ca3af"
              style={{ pointerEvents: 'none', userSelect: 'none' }}
            >
              {keyMap[note]}
            </text>
          )}
        </g>
      ))}
      {/* Black keys */}
      {WHITE_NOTES.map((note, i) => {
        const black = BLACK_NOTE_MAP[note]
        if (!black) return null
        return (
          <g key={black} onClick={() => !disabled && onKeyPress(black)} style={{ cursor: disabled ? 'default' : 'pointer' }}>
            <rect
              x={blackKeyX(i)}
              y={0}
              width={BLACK_KEY_W}
              height={BLACK_KEY_H}
              rx={2}
              fill={blackKeyFill(black)}
            />
            {keyMap[black] && (
              <text
                x={blackKeyX(i) + BLACK_KEY_W / 2}
                y={BLACK_KEY_H - 8}
                textAnchor="middle"
                fontSize={8}
                fontFamily="monospace"
                fill="#9ca3af"
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                {keyMap[black]}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}
