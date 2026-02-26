import { useExerciseStore } from '@/store/useExerciseStore'
import { setSynthType } from '@/audio/AudioEngine'
import type { Category } from '@/exercises/types'
import { RadioGroup } from '@chakra-ui/react'

const CATEGORIES: { key: Category; label: string }[] = [
  { key: 'interval', label: 'Intervals' },
  { key: 'chord', label: 'Chords' },
  { key: 'melody', label: 'Melody' },
  { key: 'rhythm', label: 'Rhythm' },
]

const SYNTH_OPTIONS: { value: OscillatorType; label: string; desc: string }[] = [
  { value: 'triangle', label: 'Triangle', desc: 'Warm, mellow tone' },
  { value: 'sine', label: 'Sine', desc: 'Pure, fundamental tone' },
  { value: 'sawtooth', label: 'Sawtooth', desc: 'Bright, buzzy tone' },
]

const KEY_SIGS = ['C', 'G', 'D', 'A', 'E', 'F', 'Bb', 'Eb']

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '14px 20px',
        borderBottom: '1px solid var(--border)',
        fontFamily: 'var(--font-body)',
        fontSize: '10px',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        fontWeight: 500,
      }}>
        {title}
      </div>
      <div style={{ padding: '20px' }}>
        {children}
      </div>
    </div>
  )
}

export function Settings() {
  const {
    difficulty,
    setDifficulty,
    synthType,
    setSynthType: storeSynth,
    keySignature,
    setKeySignature,
  } = useExerciseStore()

  function handleSynthChange(type: OscillatorType) {
    storeSynth(type)
    setSynthType(type)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '48px 24px' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>

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
            Settings
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            color: 'var(--text-muted)',
            margin: '8px 0 0',
            letterSpacing: '0.04em',
          }}>
            Customize your training experience
          </p>
        </div>

        {/* Difficulty */}
        <Section title="Default Difficulty">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              color: 'var(--text-muted)',
              margin: '0 0 8px',
              letterSpacing: '0.02em',
              lineHeight: 1.6,
            }}>
              Applied to all exercises. You can also change difficulty per exercise.
            </p>
            {CATEGORIES.map(({ key, label }) => (
              <div key={key} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: key !== 'rhythm' ? '1px solid var(--border-muted)' : 'none',
              }}>
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  color: 'var(--text)',
                  letterSpacing: '0.02em',
                }}>
                  {label}
                </span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {([1, 2, 3] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      style={{
                        width: '30px',
                        height: '26px',
                        background: difficulty === d ? 'var(--accent)' : 'transparent',
                        color: difficulty === d ? '#0F0D0B' : 'var(--text-muted)',
                        border: '1px solid',
                        borderColor: difficulty === d ? 'var(--accent)' : 'var(--border)',
                        borderRadius: 'var(--radius)',
                        fontFamily: 'var(--font-body)',
                        fontSize: '11px',
                        fontWeight: difficulty === d ? 600 : 400,
                        cursor: 'pointer',
                        transition: 'all 0.12s',
                      }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Synth type */}
        <Section title="Sound Type">
          <RadioGroup.Root
            value={synthType}
            onValueChange={(d) => handleSynthChange(d.value as OscillatorType)}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {SYNTH_OPTIONS.map(({ value, label, desc }) => (
                <RadioGroup.Item
                  key={value}
                  value={value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 0',
                    borderBottom: value !== 'sawtooth' ? '1px solid var(--border-muted)' : 'none',
                    cursor: 'pointer',
                  }}
                >
                  <RadioGroup.ItemHiddenInput />
                  <RadioGroup.ItemIndicator
                    style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      border: `1px solid ${synthType === value ? 'var(--accent)' : 'var(--border)'}`,
                      background: synthType === value ? 'var(--accent)' : 'transparent',
                      flexShrink: 0,
                      transition: 'all 0.12s',
                    }}
                  />
                  <div>
                    <div style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '13px',
                      color: 'var(--text)',
                      letterSpacing: '0.02em',
                    }}>
                      {label}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '11px',
                      color: 'var(--text-muted)',
                      marginTop: '2px',
                    }}>
                      {desc}
                    </div>
                  </div>
                </RadioGroup.Item>
              ))}
            </div>
          </RadioGroup.Root>
        </Section>

        {/* Key signature */}
        <Section title="Key Signature (Melody)">
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
          }}>
            {KEY_SIGS.map((k) => (
              <button
                key={k}
                onClick={() => setKeySignature(k)}
                style={{
                  padding: '7px 14px',
                  background: keySignature === k ? 'var(--accent)' : 'transparent',
                  color: keySignature === k ? '#0F0D0B' : 'var(--text-muted)',
                  border: '1px solid',
                  borderColor: keySignature === k ? 'var(--accent)' : 'var(--border)',
                  borderRadius: 'var(--radius)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  fontWeight: keySignature === k ? 600 : 400,
                  cursor: 'pointer',
                  letterSpacing: '0.04em',
                  transition: 'all 0.12s',
                }}
              >
                {k}
              </button>
            ))}
          </div>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '11px',
            color: 'var(--text-faint)',
            margin: '12px 0 0',
            letterSpacing: '0.03em',
          }}>
            Melody exercises will use notes from this key.
          </p>
        </Section>
      </div>
    </div>
  )
}
