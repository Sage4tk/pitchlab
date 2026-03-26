import { useCallback } from 'react'
import { useExercise } from '@/hooks/useExercise'
import { useKeyboardAnswer } from '@/hooks/useKeyboard'
import { ChordExercise } from '@/exercises/ChordExercise'
import type { ChordQuestion } from '@/exercises/ChordExercise'
import { AnswerGrid } from '@/components/AnswerGrid'
import { PlayButton } from '@/components/PlayButton'
import { playChord } from '@/audio/AudioEngine'
import { motion, AnimatePresence } from 'framer-motion'
import { ExerciseShell, FeedbackRow, ReplayButton } from '@/pages/exercises/Interval'
import { CHORD_TIPS } from '@/data/feedbackTips'

export function Chord() {
  const generate = useCallback((d: 1 | 2 | 3) => ChordExercise.generate(d), [])
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
    : ChordExercise.options({ root: 'C4', notes: [], quality: 'Major' }, difficulty)

  useKeyboardAnswer(options, submit, phase === 'answering')

  function handleReplay() {
    if (!question) return
    void playChord(question.notes, '2n')
  }

  return (
    <ExerciseShell
      title="Chords" symbol="♫"
      phase={phase} difficulty={difficulty}
      currentRound={currentRound} totalRounds={totalRounds} score={score}
      sessionStats={sessionStats}
      onStartSession={startSession} onReset={reset}
      onReview={() => startReview(wrongQuestions)} wrongCount={wrongQuestions.length}
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
              message={isCorrect ? 'Correct' : `It was ${question?.quality}`}
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
