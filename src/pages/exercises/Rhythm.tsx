import { useCallback } from 'react'
import { useExercise } from '@/hooks/useExercise'
import { useExerciseStore } from '@/store/useExerciseStore'
import { RhythmExercise } from '@/exercises/RhythmExercise'
import type { RhythmQuestion } from '@/exercises/RhythmExercise'
import { RhythmPad } from '@/components/RhythmPad'
import { PlayButton } from '@/components/PlayButton'
import { playRhythm } from '@/audio/AudioEngine'
import { motion, AnimatePresence } from 'framer-motion'
import { ExerciseShell, FeedbackRow } from '@/pages/exercises/Interval'

export function Rhythm() {
  const { difficulty, setDifficulty } = useExerciseStore()

  const generate = useCallback(() => RhythmExercise.generate(difficulty), [difficulty])
  const check = useCallback(
    (q: RhythmQuestion, a: boolean[]) => RhythmExercise.check(q, a),
    [],
  )

  const { phase, question, isCorrect, play, submit, next } = useExercise<
    RhythmQuestion,
    boolean[]
  >({
    category: 'rhythm',
    difficulty,
    generateQuestion: generate,
    checkAnswer: check,
  })

  function handleReplay() {
    if (!question) return
    void playRhythm(question.pattern, question.bpm)
  }

  return (
    <ExerciseShell
      title="Rhythm"
      symbol="♬"
      difficulty={difficulty}
      setDifficulty={setDifficulty}
    >
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '12px',
        color: 'var(--text-muted)',
        margin: 0,
        letterSpacing: '0.02em',
      }}>
        Listen to the rhythm, then tap along to reproduce it.
      </p>

      {phase === 'idle' && <PlayButton label="Play Rhythm" onClick={play} />}

      {phase === 'answering' && question && (
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
          <RhythmPad
            subdivisions={question.subdivisions}
            bpm={question.bpm}
            onSubmit={submit}
          />
        </div>
      )}

      <AnimatePresence>
        {phase === 'feedback' && question && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.18 }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Rhythm pattern visualization */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {question.pattern.map((hit, i) => (
                  <div
                    key={i}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: 'var(--radius)',
                      background: hit ? 'var(--accent)' : 'var(--bg-highlight)',
                      border: '1px solid',
                      borderColor: hit ? 'var(--accent)' : 'var(--border)',
                      boxShadow: hit ? '0 2px 8px var(--accent-glow)' : 'none',
                      transition: 'background 0.2s',
                    }}
                  />
                ))}
              </div>

              <FeedbackRow
                isCorrect={isCorrect}
                message={isCorrect ? 'Correct' : 'Pattern shown above'}
                onNext={next}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ExerciseShell>
  )
}
