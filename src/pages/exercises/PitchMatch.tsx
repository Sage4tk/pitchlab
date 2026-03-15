import { useCallback, useEffect, useRef } from 'react'
import { useExercise } from '@/hooks/useExercise'
import { PitchMatchExercise } from '@/exercises/PitchMatchExercise'
import type { PitchMatchQuestion } from '@/exercises/PitchMatchExercise'
import { usePitchDetector } from '@/audio/PitchDetector'
import { PitchMeter } from '@/components/PitchMeter'
import { playNote } from '@/audio/AudioEngine'
import { ExerciseShell, FeedbackRow } from '@/pages/exercises/Interval'
import { motion, AnimatePresence } from 'framer-motion'

export function PitchMatch() {
  const generate = useCallback((d: 1 | 2 | 3) => PitchMatchExercise.generate(d), [])
  const checkAnswer = useCallback(
    (q: PitchMatchQuestion, answer: string) => PitchMatchExercise.check(q.targetNote, answer, 0),
    [],
  )
  const replayQuestion = useCallback((q: PitchMatchQuestion) => { void playNote(q.targetNote, '2n') }, [])

  const {
    phase, question, isCorrect, xpEarned,
    difficulty, currentRound, totalRounds, score,
    startSession, play, submit, next, reset,
    wrongQuestions, startReview,
  } = useExercise<PitchMatchQuestion, string>({
    category: 'pitch-match',
    generateQuestion: generate,
    checkAnswer,
    replayQuestion,
  })

  const { detectedNote, detectedCents, isListening, micError, start: startMic, stop: stopMic } = usePitchDetector()

  // Track how long the detected pitch has been in-tune
  const stableTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dropoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isInTune = question != null
    && PitchMatchExercise.check(question.targetNote, detectedNote, detectedCents)

  // Auto-submit when in-tune for 600ms; brief dropouts (<150ms) don't reset the timer
  useEffect(() => {
    if (phase !== 'answering') return
    if (isInTune) {
      // Cancel any pending dropout reset
      if (dropoutTimerRef.current) {
        clearTimeout(dropoutTimerRef.current)
        dropoutTimerRef.current = null
      }
      if (!stableTimerRef.current) {
        stableTimerRef.current = setTimeout(() => {
          if (detectedNote) submit(detectedNote)
        }, 600)
      }
    } else {
      // Only reset after 150ms of being out of tune (grace period for mic dropouts)
      if (stableTimerRef.current && !dropoutTimerRef.current) {
        dropoutTimerRef.current = setTimeout(() => {
          clearTimeout(stableTimerRef.current!)
          stableTimerRef.current = null
          dropoutTimerRef.current = null
        }, 150)
      }
    }
  }, [isInTune, phase, detectedNote, submit])

  // Start/stop mic based on phase
  useEffect(() => {
    if (phase === 'idle' || phase === 'answering' || phase === 'feedback') {
      if (!isListening) void startMic()
    } else {
      if (isListening) stopMic()
    }
  }, [phase]) // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (stableTimerRef.current) clearTimeout(stableTimerRef.current)
      if (dropoutTimerRef.current) clearTimeout(dropoutTimerRef.current)
    }
  }, [])

  // Auto-start first question once mic is ready
  useEffect(() => {
    if (isListening && phase === 'idle') play()
  }, [isListening, phase]) // eslint-disable-line react-hooks/exhaustive-deps

  // Play the target note when a new question loads
  useEffect(() => {
    if (question && phase === 'answering') {
      void playNote(question.targetNote, '2n')
    }
  }, [question, phase])

  function handleReplayNote() {
    if (!question) return
    void playNote(question.targetNote, '2n')
  }

  function handleNext() {
    if (dropoutTimerRef.current) { clearTimeout(dropoutTimerRef.current); dropoutTimerRef.current = null }
    if (stableTimerRef.current) { clearTimeout(stableTimerRef.current); stableTimerRef.current = null }
    next()
  }

  return (
    <ExerciseShell
      title="Pitch Match" symbol="𝄢"
      phase={phase} difficulty={difficulty}
      currentRound={currentRound} totalRounds={totalRounds} score={score}
      onStartSession={startSession} onReset={reset}
      onReview={() => startReview(wrongQuestions)} wrongCount={wrongQuestions.length}
    >
      {/* Mic error banner */}
      {micError && (
        <div style={{
          padding: '10px 14px',
          background: 'var(--bg-surface-2)',
          border: '1px solid var(--error)',
          borderRadius: 'var(--radius)',
          fontFamily: 'var(--font-body)',
          fontSize: '11px',
          color: 'var(--error)',
          letterSpacing: '0.04em',
        }}>
          Microphone error: {micError}
        </div>
      )}

      {/* Idle: mic warm-up message */}
      {phase === 'idle' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '16px 0' }}>
          {isListening ? (
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              color: 'var(--text-muted)',
              letterSpacing: '0.04em',
              textAlign: 'center',
            }}>
              Microphone ready. The session will begin automatically.
            </div>
          ) : (
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              color: 'var(--text-muted)',
              letterSpacing: '0.04em',
              textAlign: 'center',
            }}>
              Requesting microphone access...
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {(phase === 'answering' || phase === 'feedback') && question && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <PitchMeter
                targetNote={question.targetNote}
                detectedNote={detectedNote}
                detectedCents={detectedCents}
                isCorrect={isInTune}
              />

              {phase === 'answering' && (
                <button
                  onClick={handleReplayNote}
                  style={{
                    alignSelf: 'center',
                    background: 'none',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '11px',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    padding: '6px 16px',
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
                  ♪ Hear Note
                </button>
              )}

              {phase === 'answering' && (
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '11px',
                  color: 'var(--text-faint)',
                  letterSpacing: '0.04em',
                  textAlign: 'center',
                }}>
                  Sing the note. Hold it steady — auto-submits when in tune.
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
              message={isCorrect ? 'In tune!' : `Target was ${question?.targetNote}`}
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
