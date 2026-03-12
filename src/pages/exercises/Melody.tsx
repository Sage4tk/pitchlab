import { useCallback, useEffect, useRef, useState } from 'react'
import { useExercise } from '@/hooks/useExercise'
import { MelodyExercise } from '@/exercises/MelodyExercise'
import type { MelodyQuestion } from '@/exercises/MelodyExercise'
import { PianoKeyboard } from '@/components/PianoKeyboard'
import { PlayButton } from '@/components/PlayButton'
import { playMelody, playNote } from '@/audio/AudioEngine'
import { motion, AnimatePresence } from 'framer-motion'
import { ExerciseShell, FeedbackRow, ReplayButton } from '@/pages/exercises/Interval'

// Standard two-row DAW piano layout (C3 = bottom row, C4 = top row)
const KEY_NOTE_MAP: Record<string, string> = {
  z: 'C3', s: 'C#3', x: 'D3', d: 'D#3', c: 'E3',
  v: 'F3', g: 'F#3', b: 'G3', h: 'G#3', n: 'A3', j: 'A#3', m: 'B3',
  q: 'C4', '2': 'C#4', w: 'D4', '3': 'D#4', e: 'E4',
  r: 'F4', '5': 'F#4', t: 'G4', '6': 'G#4', y: 'A4', '7': 'A#4', u: 'B4',
}

// Invert: note → key label shown on the piano
const NOTE_KEY_LABEL: Record<string, string> = Object.fromEntries(
  Object.entries(KEY_NOTE_MAP).map(([k, n]) => [n, k.toUpperCase()])
)

export function Melody() {
  const [inputNotes, setInputNotes] = useState<string[]>([])
  const inputNotesRef = useRef<string[]>([])
  const [activeNotes, setActiveNotes] = useState<string[]>([])
  const activeTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  const generate = useCallback((d: 1 | 2 | 3) => MelodyExercise.generate(d), [])
  const check = useCallback((q: MelodyQuestion, a: string[]) => MelodyExercise.check(q, a), [])

  const {
    phase, question, isCorrect, xpEarned,
    difficulty, currentRound, totalRounds, score,
    startSession, play, submit, next, reset,
  } = useExercise<MelodyQuestion, string[]>({ category: 'melody', generateQuestion: generate, checkAnswer: check })

  // Keep ref in sync so keydown handler always sees latest inputNotes
  useEffect(() => { inputNotesRef.current = inputNotes }, [inputNotes])

  function flashNote(note: string) {
    setActiveNotes((prev) => [...prev, note])
    if (activeTimers.current[note]) clearTimeout(activeTimers.current[note])
    activeTimers.current[note] = setTimeout(() => {
      setActiveNotes((prev) => prev.filter((n) => n !== note))
    }, 180)
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.repeat) return
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      if (e.key === 'Backspace') {
        setInputNotes((prev) => prev.slice(0, -1))
        return
      }
      if (e.key === 'Escape') {
        setInputNotes([])
        return
      }
      if (e.key === 'Enter' && phase === 'answering') {
        if (inputNotesRef.current.length > 0) submit(inputNotesRef.current)
        return
      }

      const note = KEY_NOTE_MAP[e.key.toLowerCase()]
      if (!note || phase !== 'answering') return
      void playNote(note, '8n')
      flashNote(note)
      setInputNotes((prev) => [...prev, note])
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [phase, submit])

  function handleKeyPress(note: string) {
    if (phase !== 'answering') return
    void playNote(note, '8n')
    flashNote(note)
    setInputNotes((prev) => [...prev, note])
  }

  function handleUndo() {
    setInputNotes((prev) => prev.slice(0, -1))
  }

  function handleSubmit() {
    if (!question) return
    submit(inputNotes)
  }

  function handleNext() {
    setInputNotes([])
    setActiveNotes([])
    next()
  }

  function handleReplay() {
    if (!question) return
    void playMelody(question.notes)
  }

  return (
    <ExerciseShell
      title="Melody" symbol="𝄞"
      phase={phase} difficulty={difficulty}
      currentRound={currentRound} totalRounds={totalRounds} score={score}
      onStartSession={startSession} onReset={reset}
    >
      {phase === 'idle' && <PlayButton label="Play Melody" onClick={play} />}

      <AnimatePresence>
        {(phase === 'answering' || phase === 'feedback') && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <ReplayButton onClick={handleReplay} />

              {/* Note input display */}
              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: '6px',
                minHeight: '40px', padding: '10px 12px',
                background: 'var(--bg-surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
              }}>
                {inputNotes.map((n, i) => (
                  <span key={i} style={{
                    display: 'inline-block', padding: '2px 8px',
                    background: 'var(--accent-dim)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                    fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--accent)', fontWeight: 500,
                  }}>
                    {n}
                  </span>
                ))}
                {phase === 'answering' && inputNotes.length === 0 && (
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--text-faint)', letterSpacing: '0.04em', alignSelf: 'center' }}>
                    Click keys or use keyboard (Z–M = C3, Q–U = C4)
                  </span>
                )}
              </div>

              {/* Piano keyboard */}
              <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '8px', background: 'var(--bg-surface-2)' }}>
                <PianoKeyboard
                  onKeyPress={handleKeyPress}
                  highlightNotes={phase === 'feedback' ? question?.notes : []}
                  activeNotes={activeNotes}
                  disabled={phase === 'feedback'}
                  keyMap={phase === 'answering' ? NOTE_KEY_LABEL : undefined}
                />
              </div>

              {phase === 'answering' && (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={handleUndo}
                    disabled={inputNotes.length === 0}
                    style={{
                      background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                      color: inputNotes.length === 0 ? 'var(--text-faint)' : 'var(--text-muted)',
                      fontFamily: 'var(--font-body)', fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase',
                      padding: '8px 16px', cursor: inputNotes.length === 0 ? 'not-allowed' : 'pointer',
                      transition: 'border-color 0.15s, color 0.15s',
                    }}
                  >
                    ← Undo
                  </button>
                  <button
                    onClick={() => setInputNotes([])}
                    disabled={inputNotes.length === 0}
                    style={{
                      background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                      color: inputNotes.length === 0 ? 'var(--text-faint)' : 'var(--text-muted)',
                      fontFamily: 'var(--font-body)', fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase',
                      padding: '8px 16px', cursor: inputNotes.length === 0 ? 'not-allowed' : 'pointer',
                      transition: 'border-color 0.15s, color 0.15s',
                    }}
                  >
                    Clear
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={inputNotes.length === 0}
                    style={{
                      flex: 1, padding: '8px',
                      background: inputNotes.length === 0 ? 'var(--bg-highlight)' : 'var(--accent)',
                      color: inputNotes.length === 0 ? 'var(--text-faint)' : '#0F0D0B',
                      border: 'none', borderRadius: 'var(--radius)',
                      fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600,
                      letterSpacing: '0.06em', textTransform: 'uppercase',
                      cursor: inputNotes.length === 0 ? 'not-allowed' : 'pointer',
                      boxShadow: inputNotes.length > 0 ? '0 2px 10px var(--accent-glow)' : 'none',
                      transition: 'background 0.15s',
                    }}
                  >
                    Submit ({inputNotes.length} notes)
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === 'feedback' && (
          <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.18 }}>
            <FeedbackRow
              isCorrect={isCorrect}
              message={isCorrect ? 'Correct' : `Correct: ${question?.notes.join(', ')}`}
              onNext={handleNext}
              isLastRound={currentRound >= totalRounds}
              xpEarned={xpEarned}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </ExerciseShell>
  )
}
