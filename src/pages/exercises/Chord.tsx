import { useCallback } from 'react'
import { useExercise } from '@/hooks/useExercise'
import { useKeyboardAnswer } from '@/hooks/useKeyboard'
import { useExerciseStore } from '@/store/useExerciseStore'
import { ChordExercise } from '@/exercises/ChordExercise'
import type { ChordQuestion } from '@/exercises/ChordExercise'
import { AnswerGrid } from '@/components/AnswerGrid'
import { PlayButton } from '@/components/PlayButton'
import { playChord } from '@/audio/AudioEngine'
import { motion, AnimatePresence } from 'framer-motion'
import { ExerciseShell, FeedbackRow } from '@/pages/exercises/Interval'

export function Chord() {
  const { difficulty, setDifficulty } = useExerciseStore()

  const generate = useCallback(() => ChordExercise.generate(difficulty), [difficulty])
  const check = useCallback((q: ChordQuestion, a: string) => ChordExercise.check(q, a), [])

  const { phase, question, isCorrect, play, submit, next } = useExercise<ChordQuestion, string>({
    category: 'chord',
    difficulty,
    generateQuestion: generate,
    checkAnswer: check,
  })

  const options = question
    ? ChordExercise.options(question, difficulty)
    : ChordExercise.options({ root: 'C4', notes: [], quality: 'Major' }, difficulty)

  useKeyboardAnswer(options, submit, phase === 'answering')

  function handleReplay() {
    if (!question) return
    void playChord(question.notes, '2n')
  }

  return (
    <ExerciseShell
      title="Chords"
      symbol="♫"
      difficulty={difficulty}
      setDifficulty={setDifficulty}
    >
      {phase === 'idle' && <PlayButton label="Play Chord" onClick={play} />}

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
                correct={phase === 'feedback' ? question?.quality : undefined}
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
              message={isCorrect ? 'Correct' : `It was ${question?.quality}`}
              onNext={next}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </ExerciseShell>
  )
}
