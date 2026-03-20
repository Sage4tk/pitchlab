import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { getCourse, getLesson } from '@/courses/data'
import { createLessonGenerator } from '@/courses/lessonGenerator'
import { useCourseStore } from '@/store/useCourseStore'
import { useSession } from '@/hooks/useSession'
import { useExercise } from '@/hooks/useExercise'
import { useKeyboardAnswer } from '@/hooks/useKeyboard'
import { AnswerGrid } from '@/components/AnswerGrid'
import { PianoKeyboard } from '@/components/PianoKeyboard'
import { RhythmPad } from '@/components/RhythmPad'
import { playNote } from '@/audio/AudioEngine'
import { getTip } from '@/courses/tips'
import { ExerciseShell, FeedbackRow, ReplayButton } from '@/pages/exercises/Interval'
import { motion, AnimatePresence } from 'framer-motion'

export function CourseLesson() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>()
  const course = courseId ? getCourse(courseId) : undefined
  const lesson = courseId && lessonId ? getLesson(courseId, lessonId) : undefined
  const { user } = useSession()
  const { completeLesson, startCourse, isLessonUnlocked, progress } = useCourseStore()

  // Ensure course is started
  useEffect(() => {
    if (course && !progress[course.id]) {
      startCourse(course.id, user?.uid)
    }
  }, [course, progress, startCourse, user?.uid])

  if (!course || !lesson) return <Navigate to="/courses" replace />
  if (!isLessonUnlocked(course.id, lesson.id)) return <Navigate to={`/courses/${course.id}`} replace />

  return (
    <LessonPlayer
      key={lesson.id}
      courseId={course.id}
      lessonId={lesson.id}
      onComplete={() => completeLesson(course.id, lesson.id, user?.uid)}
    />
  )
}

// Separate component so hooks are not conditional
function LessonPlayer({ courseId, lessonId, onComplete }: {
  courseId: string
  lessonId: string
  onComplete: () => void
}) {
  const course = getCourse(courseId)!
  const lesson = getLesson(courseId, lessonId)!
  const gen = useMemo(() => createLessonGenerator(lesson), [lessonId]) // eslint-disable-line react-hooks/exhaustive-deps
  const hasCompleted = useRef(false)

  const exerciseType = lesson.exerciseType

  // Wrap generate/check in stable callbacks — use `unknown` to unify exercise types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const generate = useCallback((d: 1 | 2 | 3) => gen.generate(d) as any, [gen])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const check = useCallback((q: any, a: any) => gen.check(q, a), [gen])
  const getItemLabel = useMemo(() => {
    if ('getItemLabel' in gen && gen.getItemLabel) {
      const fn = gen.getItemLabel
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (q: any) => fn(q)
    }
    return undefined
  }, [gen])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const replayQuestion = useCallback((q: any) => gen.replay(q), [gen])

  const {
    phase, question, isCorrect, xpEarned,
    difficulty, currentRound, totalRounds, score,
    startSession, play, submit, next, reset,
    wrongQuestions, startReview,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useExercise<any, any>({
    category: lesson.exerciseType,
    generateQuestion: generate,
    checkAnswer: check,
    getItemLabel,
    replayQuestion,
  })

  // Auto-start session on mount
  const started = useRef(false)
  useEffect(() => {
    if (!started.current) {
      started.current = true
      startSession(lesson.difficulty as 1 | 2 | 3, lesson.rounds)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Once startSession sets phase to 'idle', call play() to generate the first question
  useEffect(() => {
    if (phase === 'idle' && started.current) {
      play()
    }
  }, [phase, play])

  // Auto-play first question when entering idle — the `play` callback from useExercise
  // handles generating the first question, so we don't need to call generate manually

  // Get options for grid-based exercises
  const options = useMemo(() => {
    if (exerciseType === 'melody' || exerciseType === 'rhythm') return []
    return gen.options()
  }, [gen, exerciseType])

  useKeyboardAnswer(
    options,
    submit as (answer: string) => void,
    phase === 'answering' && exerciseType !== 'melody' && exerciseType !== 'rhythm',
  )

  // Mark lesson complete on results
  useEffect(() => {
    if (phase === 'results' && !hasCompleted.current) {
      const pct = Math.round((score / totalRounds) * 100)
      if (pct >= 70) {
        hasCompleted.current = true
        onComplete()
      }
    }
  }, [phase, score, totalRounds, onComplete])

  // Find next lesson
  const currentIdx = course.lessons.findIndex((l) => l.id === lessonId)
  const nextLesson = currentIdx < course.lessons.length - 1 ? course.lessons[currentIdx + 1] : null
  const passed = phase === 'results' && Math.round((score / totalRounds) * 100) >= 70

  // For melody input
  const [inputNotes, setInputNotes] = useState<string[]>([])
  const inputNotesRef = useRef<string[]>([])
  const [activeNotes, setActiveNotes] = useState<string[]>([])
  const activeTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  useEffect(() => { inputNotesRef.current = inputNotes }, [inputNotes])

  function flashNote(note: string) {
    setActiveNotes((prev) => [...prev, note])
    if (activeTimers.current[note]) clearTimeout(activeTimers.current[note])
    activeTimers.current[note] = setTimeout(() => {
      setActiveNotes((prev) => prev.filter((n) => n !== note))
    }, 180)
  }

  // Keyboard handler for melody
  useEffect(() => {
    if (exerciseType !== 'melody') return
    const KEY_NOTE_MAP: Record<string, string> = {
      z: 'C3', s: 'C#3', x: 'D3', d: 'D#3', c: 'E3',
      v: 'F3', g: 'F#3', b: 'G3', h: 'G#3', n: 'A3', j: 'A#3', m: 'B3',
      q: 'C4', '2': 'C#4', w: 'D4', '3': 'D#4', e: 'E4',
      r: 'F4', '5': 'F#4', t: 'G4', '6': 'G#4', y: 'A4', '7': 'A#4', u: 'B4',
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.repeat || phase !== 'answering') return
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === 'Backspace') { setInputNotes((prev) => prev.slice(0, -1)); return }
      if (e.key === 'Escape') { setInputNotes([]); return }
      if (e.key === 'Enter' && inputNotesRef.current.length > 0) {
        (submit as (a: string[]) => void)(inputNotesRef.current)
        return
      }
      const note = KEY_NOTE_MAP[e.key.toLowerCase()]
      if (!note) return
      void playNote(note, '8n')
      flashNote(note)
      setInputNotes((prev) => [...prev, note])
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [phase, submit, exerciseType])

  function handleMelodyKeyPress(note: string) {
    if (phase !== 'answering') return
    void playNote(note, '8n')
    flashNote(note)
    setInputNotes((prev) => [...prev, note])
  }

  function handleMelodySubmit() {
    if (!question) return
    ;(submit as (a: string[]) => void)(inputNotes)
  }

  function handleMelodyNext() {
    setInputNotes([])
    setActiveNotes([])
    next()
  }

  function handleReplay() {
    if (!question) return
    gen.replay(question as never)
  }

  // Compute tip for wrong answers
  const feedbackTip = useMemo(() => {
    if (!question || isCorrect) return undefined
    const label = (question as { label?: string; quality?: string }).label
      ?? (question as { quality?: string }).quality
    if (!label) return undefined
    return getTip(exerciseType, label)
  }, [question, isCorrect, exerciseType])

  // Custom results screen for lessons
  if (phase === 'results') {
    const pct = Math.round((score / totalRounds) * 100)
    return (
      <div className="exercise-page-wrap" style={{
        minHeight: '100vh', background: 'var(--bg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px',
      }}>
        <div style={{
          width: '100%', maxWidth: '560px', background: 'var(--bg-surface)',
          border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '20px 24px', borderBottom: '1px solid var(--border)',
          }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--accent)', lineHeight: 1, opacity: 0.85 }}>
              {course.symbol}
            </span>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 600, color: 'var(--text)', margin: 0 }}>
                {lesson.title}
              </h1>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: '2px' }}>
                {course.title}
              </div>
            </div>
          </div>

          <div style={{ padding: '40px 28px', display: 'flex', flexDirection: 'column', gap: '28px', alignItems: 'center', textAlign: 'center' }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: '72px', fontWeight: 600,
                color: 'var(--accent)', lineHeight: 1,
              }}>
                {score}<span style={{ fontSize: '36px', color: 'var(--text-muted)', fontWeight: 400 }}>/{totalRounds}</span>
              </div>
              <div style={{
                fontFamily: 'var(--font-body)', fontSize: '13px',
                color: 'var(--text-muted)', marginTop: '8px', letterSpacing: '0.04em',
              }}>
                {pct}% correct
              </div>
            </div>

            <div style={{
              fontFamily: 'var(--font-display)', fontSize: '28px', fontStyle: 'italic', fontWeight: 500,
              color: passed ? 'var(--success)' : 'var(--error)',
            }}>
              {passed ? 'Lesson Complete' : 'Not Quite — Try Again'}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
              {passed && nextLesson && (
                <Link to={`/courses/${courseId}/${nextLesson.id}`} style={{ textDecoration: 'none' }}>
                  <button style={{
                    width: '100%', padding: '14px', background: 'var(--accent)', color: '#0F0D0B',
                    border: 'none', borderRadius: 'var(--radius)', fontFamily: 'var(--font-body)',
                    fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                    cursor: 'pointer', boxShadow: '0 4px 16px var(--accent-glow)', transition: 'background 0.15s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-bright)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)' }}
                  >
                    Next Lesson →
                  </button>
                </Link>
              )}
              {passed && !nextLesson && (
                <Link to={`/courses/${courseId}`} style={{ textDecoration: 'none' }}>
                  <button style={{
                    width: '100%', padding: '14px', background: 'var(--accent)', color: '#0F0D0B',
                    border: 'none', borderRadius: 'var(--radius)', fontFamily: 'var(--font-body)',
                    fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                    cursor: 'pointer', boxShadow: '0 4px 16px var(--accent-glow)', transition: 'background 0.15s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-bright)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)' }}
                  >
                    Course Complete →
                  </button>
                </Link>
              )}
              {!passed && (
                <button
                  onClick={() => {
                    hasCompleted.current = false
                    started.current = false
                    reset()
                    setTimeout(() => startSession(lesson.difficulty as 1 | 2 | 3, lesson.rounds), 0)
                  }}
                  style={{
                    width: '100%', padding: '14px', background: 'var(--accent)', color: '#0F0D0B',
                    border: 'none', borderRadius: 'var(--radius)', fontFamily: 'var(--font-body)',
                    fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                    cursor: 'pointer', boxShadow: '0 4px 16px var(--accent-glow)', transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-bright)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)' }}
                >
                  Try Again
                </button>
              )}
              {wrongQuestions.length > 0 && (
                <button
                  onClick={() => startReview(wrongQuestions as never[])}
                  style={{
                    width: '100%', padding: '14px', background: 'transparent',
                    color: 'var(--accent)', border: '1px solid var(--accent)',
                    borderRadius: 'var(--radius)', fontFamily: 'var(--font-body)',
                    fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em',
                    textTransform: 'uppercase', cursor: 'pointer', transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-dim)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                >
                  ↩ Review {wrongQuestions.length} Mistake{wrongQuestions.length === 1 ? '' : 's'}
                </button>
              )}
              <Link to={`/courses/${courseId}`} style={{ textDecoration: 'none' }}>
                <button style={{
                  width: '100%', padding: '12px', background: 'transparent',
                  color: 'var(--text-muted)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)', fontFamily: 'var(--font-body)',
                  fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase',
                  cursor: 'pointer', transition: 'border-color 0.15s, color 0.15s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
                >
                  Back to Course
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Playing phase — render based on exercise type
  return (
    <ExerciseShell
      title={lesson.title} symbol={course.symbol}
      phase={phase === 'setup' ? 'idle' : phase}
      difficulty={difficulty}
      currentRound={currentRound} totalRounds={totalRounds} score={score}
      onStartSession={startSession} onReset={reset}
      onReview={() => startReview(wrongQuestions as never[])} wrongCount={wrongQuestions.length}
    >
      {/* Interval / Chord / Progression — grid answers */}
      {(exerciseType === 'interval' || exerciseType === 'chord' || exerciseType === 'progression') && (
        <>
          <AnimatePresence>
            {(phase === 'answering' || phase === 'feedback') && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <ReplayButton onClick={handleReplay} />
                  <AnswerGrid
                    options={options}
                    onAnswer={submit as (answer: string) => void}
                    correct={phase === 'feedback' ? (question as unknown as { label?: string; quality?: string })?.label ?? (question as unknown as { quality?: string })?.quality : undefined}
                    disabled={phase === 'feedback'}
                    minColWidth={exerciseType === 'progression' ? 200 : 120}
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
                  message={isCorrect ? 'Correct' : `It was ${(question as unknown as { label?: string; quality?: string })?.label ?? (question as unknown as { quality?: string })?.quality}`}
                  onNext={next}
                  isLastRound={currentRound >= totalRounds}
                  xpEarned={xpEarned}
                  tip={feedbackTip}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Melody — piano keyboard */}
      {exerciseType === 'melody' && (
        <>
          <AnimatePresence>
            {(phase === 'answering' || phase === 'feedback') && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <ReplayButton onClick={handleReplay} />
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
                        Click keys or use keyboard
                      </span>
                    )}
                  </div>
                  <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '8px', background: 'var(--bg-surface-2)' }}>
                    <PianoKeyboard
                      onKeyPress={handleMelodyKeyPress}
                      highlightNotes={phase === 'feedback' ? (question as unknown as { notes: string[] })?.notes : []}
                      activeNotes={activeNotes}
                      disabled={phase === 'feedback'}
                    />
                  </div>
                  {phase === 'answering' && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => setInputNotes((p) => p.slice(0, -1))} disabled={inputNotes.length === 0}
                        style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: inputNotes.length === 0 ? 'var(--text-faint)' : 'var(--text-muted)', fontFamily: 'var(--font-body)', fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '8px 16px', cursor: inputNotes.length === 0 ? 'not-allowed' : 'pointer' }}>
                        ← Undo
                      </button>
                      <button onClick={() => setInputNotes([])} disabled={inputNotes.length === 0}
                        style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: inputNotes.length === 0 ? 'var(--text-faint)' : 'var(--text-muted)', fontFamily: 'var(--font-body)', fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '8px 16px', cursor: inputNotes.length === 0 ? 'not-allowed' : 'pointer' }}>
                        Clear
                      </button>
                      <button onClick={handleMelodySubmit} disabled={inputNotes.length === 0}
                        style={{ flex: 1, padding: '8px', background: inputNotes.length === 0 ? 'var(--bg-highlight)' : 'var(--accent)', color: inputNotes.length === 0 ? 'var(--text-faint)' : '#0F0D0B', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: inputNotes.length === 0 ? 'not-allowed' : 'pointer', boxShadow: inputNotes.length > 0 ? '0 2px 10px var(--accent-glow)' : 'none' }}>
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
                  message={isCorrect ? 'Correct' : `Correct: ${(question as unknown as { notes: string[] })?.notes.join(', ')}`}
                  onNext={handleMelodyNext}
                  isLastRound={currentRound >= totalRounds}
                  xpEarned={xpEarned}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Rhythm — tap pad */}
      {exerciseType === 'rhythm' && (
        <>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--text-muted)', margin: 0, letterSpacing: '0.02em' }}>
            Listen to the rhythm, then click the beats you heard.
          </p>
          {phase === 'answering' && question && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <ReplayButton onClick={handleReplay} />
              <RhythmPad
                subdivisions={(question as { subdivisions: number }).subdivisions}
                bpm={(question as { bpm: number }).bpm}
                onSubmit={submit as (pattern: boolean[]) => void}
              />
            </div>
          )}
          <AnimatePresence>
            {phase === 'feedback' && question && (
              <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.18 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {(question as { pattern: boolean[] }).pattern.map((hit: boolean, i: number) => (
                      <div key={i} style={{
                        width: '28px', height: '28px', borderRadius: 'var(--radius)',
                        background: hit ? 'var(--accent)' : 'var(--bg-highlight)',
                        border: '1px solid', borderColor: hit ? 'var(--accent)' : 'var(--border)',
                        boxShadow: hit ? '0 2px 8px var(--accent-glow)' : 'none',
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
        </>
      )}
    </ExerciseShell>
  )
}
