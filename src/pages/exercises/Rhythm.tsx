import { useCallback } from 'react'
import { useExercise } from '@/hooks/useExercise'
import { RhythmExercise } from '@/exercises/RhythmExercise'
import type { RhythmQuestion } from '@/exercises/RhythmExercise'
import { RhythmPad } from '@/components/RhythmPad'
import { PlayButton } from '@/components/PlayButton'
import { playRhythm } from '@/audio/AudioEngine'
import { motion, AnimatePresence } from 'framer-motion'
import { ExerciseShell, FeedbackRow, ReplayButton } from '@/pages/exercises/Interval'

export function Rhythm() {
  const generate = useCallback((d: 1 | 2 | 3) => RhythmExercise.generate(d), [])
  const check = useCallback((q: RhythmQuestion, a: boolean[]) => RhythmExercise.check(q, a), [])
  const replayQuestion = useCallback((q: RhythmQuestion) => { void playRhythm(q.pattern, q.bpm) }, [])

  const {
    phase, question, isCorrect, xpEarned,
    difficulty, currentRound, totalRounds, score,
    startSession, play, submit, next, reset,
    wrongQuestions, startReview,
  } = useExercise<RhythmQuestion, boolean[]>({ category: 'rhythm', generateQuestion: generate, checkAnswer: check, replayQuestion })

  function handleReplay() {
    if (!question) return
    void playRhythm(question.pattern, question.bpm)
  }

  return (
    <ExerciseShell
      title="Rhythm" symbol="♬"
      phase={phase} difficulty={difficulty}
      currentRound={currentRound} totalRounds={totalRounds} score={score}
      onStartSession={startSession} onReset={reset}
      onReview={() => startReview(wrongQuestions)} wrongCount={wrongQuestions.length}
    >
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--text-muted)', margin: 0, letterSpacing: '0.02em' }}>
        Listen to the rhythm, then click the beats you heard.
      </p>

      {phase === 'idle' && <PlayButton label="Play Rhythm" onClick={play} />}

      {phase === 'answering' && question && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <ReplayButton onClick={handleReplay} />
          <RhythmPad subdivisions={question.subdivisions} bpm={question.bpm} onSubmit={submit} />
        </div>
      )}

      <AnimatePresence>
        {phase === 'feedback' && question && (
          <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.18 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Rhythm pattern visualization */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {question.pattern.map((hit, i) => (
                  <div key={i} style={{
                    width: '28px', height: '28px', borderRadius: 'var(--radius)',
                    background: hit ? 'var(--accent)' : 'var(--bg-highlight)',
                    border: '1px solid', borderColor: hit ? 'var(--accent)' : 'var(--border)',
                    boxShadow: hit ? '0 2px 8px var(--accent-glow)' : 'none',
                    transition: 'background 0.2s',
                  }} />
                ))}
              </div>
              <FeedbackRow
                isCorrect={isCorrect}
                message={isCorrect ? 'Correct' : 'Pattern shown above'}
                onNext={next}
                isLastRound={currentRound >= totalRounds}
                xpEarned={xpEarned}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ExerciseShell>
  )
}
