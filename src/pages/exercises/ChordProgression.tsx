import { useCallback } from 'react'
import { useExercise } from '@/hooks/useExercise'
import { useKeyboardAnswer } from '@/hooks/useKeyboard'
import { ChordProgressionExercise } from '@/exercises/ChordProgressionExercise'
import type { ChordProgressionQuestion } from '@/exercises/ChordProgressionExercise'
import { AnswerGrid } from '@/components/AnswerGrid'
import { PlayButton } from '@/components/PlayButton'
import { playChordProgression } from '@/audio/AudioEngine'
import { motion, AnimatePresence } from 'framer-motion'
import { ExerciseShell, FeedbackRow, ReplayButton } from '@/pages/exercises/Interval'
import { PROGRESSION_TIPS } from '@/data/feedbackTips'

export function ChordProgression() {
  const generate = useCallback((d: 1 | 2 | 3) => ChordProgressionExercise.generate(d), [])
  const check = useCallback((q: ChordProgressionQuestion, a: string) => ChordProgressionExercise.check(q, a), [])
  const getItemLabel = useCallback((q: ChordProgressionQuestion) => q.label, [])
  const replayQuestion = useCallback((q: ChordProgressionQuestion) => { void playChordProgression(q.chords.map((c) => c.notes)) }, [])

  const {
    phase, question, isCorrect, xpEarned,
    difficulty, currentRound, totalRounds, score,
    sessionStats,
    startSession, play, submit, next, reset,
    wrongQuestions, startReview,
  } = useExercise<ChordProgressionQuestion, string>({
    category: 'progression',
    generateQuestion: generate,
    checkAnswer: check,
    getItemLabel,
    replayQuestion,
  })

  const options = question
    ? ChordProgressionExercise.options(question, difficulty)
    : ChordProgressionExercise.options({ key: 'C3', chords: [], label: '' }, difficulty)

  useKeyboardAnswer(options, submit, phase === 'answering')

  function handleReplay() {
    if (!question) return
    void playChordProgression(question.chords.map((c) => c.notes))
  }

  return (
    <ExerciseShell
      title="Progressions" symbol="♮"
      phase={phase} difficulty={difficulty}
      currentRound={currentRound} totalRounds={totalRounds} score={score}
      sessionStats={sessionStats}
      onStartSession={startSession} onReset={reset}
      onReview={() => startReview(wrongQuestions)} wrongCount={wrongQuestions.length}
    >
      {phase === 'idle' && <PlayButton label="Play Progression" onClick={play} />}

      <AnimatePresence>
        {(phase === 'answering' || phase === 'feedback') && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <ReplayButton onClick={handleReplay} />
              <AnswerGrid
                options={options}
                onAnswer={submit}
                correct={phase === 'feedback' ? question?.label : undefined}
                disabled={phase === 'feedback'}
                minColWidth={200}
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
              message={isCorrect ? 'Correct' : `It was ${question?.label}`}
              onNext={next}
              isLastRound={currentRound >= totalRounds}
              xpEarned={xpEarned}
              tip={question ? PROGRESSION_TIPS[question.label] : undefined}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </ExerciseShell>
  )
}
