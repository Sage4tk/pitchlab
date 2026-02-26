import { useCallback, useState } from 'react'
import { useExercise } from '@/hooks/useExercise'
import { useExerciseStore } from '@/store/useExerciseStore'
import { MelodyExercise } from '@/exercises/MelodyExercise'
import type { MelodyQuestion } from '@/exercises/MelodyExercise'
import { PianoKeyboard } from '@/components/PianoKeyboard'
import { PlayButton } from '@/components/PlayButton'
import { playMelody, playNote } from '@/audio/AudioEngine'
import { motion, AnimatePresence } from 'framer-motion'
import { ExerciseShell, FeedbackRow } from '@/pages/exercises/Interval'

export function Melody() {
  const { difficulty, setDifficulty } = useExerciseStore()
  const [inputNotes, setInputNotes] = useState<string[]>([])

  const generate = useCallback(() => MelodyExercise.generate(difficulty), [difficulty])
  const check = useCallback((q: MelodyQuestion, a: string[]) => MelodyExercise.check(q, a), [])

  const { phase, question, isCorrect, play, submit, next } = useExercise<
    MelodyQuestion,
    string[]
  >({
    category: 'melody',
    difficulty,
    generateQuestion: generate,
    checkAnswer: check,
  })

  function handleKeyPress(note: string) {
    if (phase !== 'answering') return
    void playNote(note, '8n')
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
    next()
  }

  function handleReplay() {
    if (!question) return
    void playMelody(question.notes)
  }

  return (
    <ExerciseShell
      title="Melody"
      symbol="𝄞"
      difficulty={difficulty}
      setDifficulty={setDifficulty}
    >
      {phase === 'idle' && <PlayButton label="Play Melody" onClick={play} />}

      <AnimatePresence>
        {(phase === 'answering' || phase === 'feedback') && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={handleReplay}
                style={{
                  alignSelf: 'flex-start',
                  background: 'none',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '11px',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s, color 0.15s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--accent)'
                  e.currentTarget.style.color = 'var(--accent)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.color = 'var(--text-muted)'
                }}
              >
                ↺ Replay
              </button>

              {/* Note input display */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
                minHeight: '40px',
                padding: '10px 12px',
                background: 'var(--bg-surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
              }}>
                {inputNotes.map((n, i) => (
                  <span
                    key={i}
                    style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      background: 'var(--accent-dim)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '12px',
                      color: 'var(--accent)',
                      fontWeight: 500,
                    }}
                  >
                    {n}
                  </span>
                ))}
                {phase === 'answering' && inputNotes.length === 0 && (
                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '11px',
                    color: 'var(--text-faint)',
                    letterSpacing: '0.04em',
                    alignSelf: 'center',
                  }}>
                    Click the piano keys below...
                  </span>
                )}
              </div>

              {/* Piano keyboard */}
              <div style={{
                overflowX: 'auto',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: '8px',
                background: 'var(--bg-surface-2)',
              }}>
                <PianoKeyboard
                  onKeyPress={handleKeyPress}
                  highlightNotes={phase === 'feedback' ? question?.notes : []}
                  disabled={phase === 'feedback'}
                />
              </div>

              {phase === 'answering' && (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={handleUndo}
                    disabled={inputNotes.length === 0}
                    style={{
                      background: 'none',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      color: inputNotes.length === 0 ? 'var(--text-faint)' : 'var(--text-muted)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '11px',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      padding: '8px 16px',
                      cursor: inputNotes.length === 0 ? 'not-allowed' : 'pointer',
                      transition: 'border-color 0.15s, color 0.15s',
                    }}
                  >
                    ← Undo
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={inputNotes.length === 0}
                    style={{
                      flex: 1,
                      padding: '8px',
                      background: inputNotes.length === 0 ? 'var(--bg-highlight)' : 'var(--accent)',
                      color: inputNotes.length === 0 ? 'var(--text-faint)' : '#0F0D0B',
                      border: 'none',
                      borderRadius: 'var(--radius)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '11px',
                      fontWeight: 600,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
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
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.18 }}
          >
            <FeedbackRow
              isCorrect={isCorrect}
              message={isCorrect ? 'Correct' : `Correct: ${question?.notes.join(', ')}`}
              onNext={handleNext}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </ExerciseShell>
  )
}
