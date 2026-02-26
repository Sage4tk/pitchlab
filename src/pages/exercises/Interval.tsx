import { useCallback } from 'react'
import { useExercise } from '@/hooks/useExercise'
import { useKeyboardAnswer } from '@/hooks/useKeyboard'
import { useExerciseStore } from '@/store/useExerciseStore'
import { IntervalExercise } from '@/exercises/IntervalExercise'
import type { IntervalQuestion } from '@/exercises/IntervalExercise'
import { AnswerGrid } from '@/components/AnswerGrid'
import { PlayButton } from '@/components/PlayButton'
import { playInterval } from '@/audio/AudioEngine'
import { motion, AnimatePresence } from 'framer-motion'

export function Interval() {
  const { difficulty, setDifficulty } = useExerciseStore()

  const generate = useCallback(() => IntervalExercise.generate(difficulty), [difficulty])
  const check = useCallback((q: IntervalQuestion, a: string) => IntervalExercise.check(q, a), [])

  const { phase, question, isCorrect, play, submit, next } = useExercise<IntervalQuestion, string>(
    {
      category: 'interval',
      difficulty,
      generateQuestion: generate,
      checkAnswer: check,
    },
  )

  const options = question
    ? IntervalExercise.options(question, difficulty)
    : IntervalExercise.options(
        { root: 'C4', target: 'G4', semitones: 7, label: 'P5', ascending: true },
        difficulty,
      )

  useKeyboardAnswer(options, submit, phase === 'answering')

  function handleReplay() {
    if (!question) return
    void playInterval(question.root, question.target)
  }

  return (
    <ExerciseShell
      title="Intervals"
      symbol="♩"
      difficulty={difficulty}
      setDifficulty={setDifficulty}
    >
      {phase === 'idle' && <PlayButton label="Play Interval" onClick={play} />}

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
              <AnswerGrid
                options={options}
                onAnswer={submit}
                correct={phase === 'feedback' ? question?.label : undefined}
                disabled={phase === 'feedback'}
              />
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
              message={isCorrect ? 'Correct' : `It was ${question?.label}`}
              onNext={next}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </ExerciseShell>
  )
}

/* ── Shared within exercise pages ───────────────────────────── */

interface ShellProps {
  title: string
  symbol: string
  difficulty: 1 | 2 | 3
  setDifficulty: (d: 1 | 2 | 3) => void
  children: React.ReactNode
}

export function ExerciseShell({ title, symbol, difficulty, setDifficulty, children }: ShellProps) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '560px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
      }}>
        {/* Card header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '28px',
              color: 'var(--accent)',
              lineHeight: 1,
              opacity: 0.85,
            }}>
              {symbol}
            </span>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '24px',
              fontWeight: 600,
              color: 'var(--text)',
              margin: 0,
              letterSpacing: '-0.01em',
            }}>
              {title}
            </h1>
          </div>

          {/* Difficulty */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
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

        {/* Card body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

interface FeedbackRowProps {
  isCorrect: boolean | null
  message: string
  onNext: () => void
}

export function FeedbackRow({ isCorrect, message, onNext }: FeedbackRowProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '22px',
        fontStyle: 'italic',
        fontWeight: 500,
        color: isCorrect ? 'var(--success)' : 'var(--error)',
        letterSpacing: '-0.01em',
      }}>
        {isCorrect ? '✓ ' : '✗ '}{message}
      </div>
      <button
        onClick={onNext}
        style={{
          width: '100%',
          padding: '12px',
          background: 'var(--accent)',
          color: '#0F0D0B',
          border: 'none',
          borderRadius: 'var(--radius)',
          fontFamily: 'var(--font-body)',
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          boxShadow: '0 4px 16px var(--accent-glow)',
          transition: 'background 0.15s, transform 0.12s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'var(--accent-bright)'
          e.currentTarget.style.transform = 'translateY(-1px)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'var(--accent)'
          e.currentTarget.style.transform = 'translateY(0)'
        }}
      >
        Next →
      </button>
    </div>
  )
}
