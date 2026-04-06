import { useCallback, useState } from 'react'
import { useExercise } from '@/hooks/useExercise'
import { useKeyboardAnswer } from '@/hooks/useKeyboard'
import { ChordExercise, INVERSION_LABELS } from '@/exercises/ChordExercise'
import type { ChordQuestion } from '@/exercises/ChordExercise'
import { AnswerGrid } from '@/components/AnswerGrid'
import { PlayButton } from '@/components/PlayButton'
import { playChord } from '@/audio/AudioEngine'
import { motion, AnimatePresence } from 'framer-motion'
import { ExerciseShell, FeedbackRow, ReplayButton } from '@/pages/exercises/Interval'
import { CHORD_TIPS } from '@/data/feedbackTips'

export function Chord() {
  const [includeInversions, setIncludeInversions] = useState(false)

  const generate = useCallback((d: 1 | 2 | 3) => ChordExercise.generate(d, includeInversions), [includeInversions])
  const check = useCallback((q: ChordQuestion, a: string) => ChordExercise.check(q, a), [])
  const getItemLabel = useCallback((q: ChordQuestion) => q.quality, [])
  const replayQuestion = useCallback((q: ChordQuestion) => { void playChord(q.notes) }, [])

  const {
    phase, question, isCorrect, xpEarned,
    difficulty, currentRound, totalRounds, score,
    sessionStats,
    startSession, play, submit, next, reset,
    wrongQuestions, startReview,
  } = useExercise<ChordQuestion, string>({ category: 'chord', generateQuestion: generate, checkAnswer: check, getItemLabel, replayQuestion })

  const options = question
    ? ChordExercise.options(question, difficulty)
    : ChordExercise.options({ root: 'C4', notes: [], quality: 'Major', inversion: 0 }, difficulty)

  useKeyboardAnswer(options, submit, phase === 'answering')

  function handleReplay() {
    if (!question) return
    void playChord(question.notes, '2n')
  }

  const inversionsToggle = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
        Options
      </div>
      <button
        onClick={() => setIncludeInversions(v => !v)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'none',
          border: '1px solid',
          borderColor: includeInversions ? 'var(--accent)' : 'var(--border)',
          borderRadius: 'var(--radius)',
          padding: '10px 14px',
          cursor: 'pointer',
          transition: 'border-color 0.15s',
          width: 'fit-content',
        }}
      >
        <div style={{
          width: '32px',
          height: '18px',
          borderRadius: '9px',
          background: includeInversions ? 'var(--accent)' : 'var(--bg-highlight)',
          position: 'relative',
          transition: 'background 0.15s',
          flexShrink: 0,
        }}>
          <div style={{
            position: 'absolute',
            top: '3px',
            left: includeInversions ? '17px' : '3px',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: includeInversions ? '#0F0D0B' : 'var(--text-muted)',
            transition: 'left 0.15s',
          }} />
        </div>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: '12px',
          color: includeInversions ? 'var(--text)' : 'var(--text-muted)',
          letterSpacing: '0.04em',
          transition: 'color 0.15s',
        }}>
          Include chord inversions
        </span>
      </button>
    </div>
  )

  return (
    <ExerciseShell
      title="Chords" symbol="♫"
      hint="Hear a chord played at once and identify its quality — major, minor, diminished, and more."
      phase={phase} difficulty={difficulty}
      currentRound={currentRound} totalRounds={totalRounds} score={score}
      sessionStats={sessionStats}
      onStartSession={startSession} onReset={reset}
      onReview={() => startReview(wrongQuestions)} wrongCount={wrongQuestions.length}
      setupExtras={inversionsToggle}
    >
      {phase === 'idle' && <PlayButton label="Play Chord" onClick={play} />}

      <AnimatePresence>
        {(phase === 'answering' || phase === 'feedback') && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <ReplayButton onClick={handleReplay} />
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
          <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.18 }}>
            <FeedbackRow
              isCorrect={isCorrect}
              message={isCorrect
                ? `Correct${includeInversions && question && question.inversion > 0 ? ` · ${INVERSION_LABELS[question.inversion]}` : ''}`
                : `It was ${question?.quality}${includeInversions && question && question.inversion > 0 ? ` · ${INVERSION_LABELS[question.inversion]}` : ''}`}
              onNext={next}
              isLastRound={currentRound >= totalRounds}
              xpEarned={xpEarned}
              tip={question ? CHORD_TIPS[question.quality] : undefined}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </ExerciseShell>
  )
}
