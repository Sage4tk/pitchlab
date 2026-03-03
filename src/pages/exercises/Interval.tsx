import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { useExercise } from '@/hooks/useExercise'
import type { Phase } from '@/hooks/useExercise'
import { useKeyboardAnswer } from '@/hooks/useKeyboard'
import { IntervalExercise } from '@/exercises/IntervalExercise'
import type { IntervalQuestion } from '@/exercises/IntervalExercise'
import { AnswerGrid } from '@/components/AnswerGrid'
import { PlayButton } from '@/components/PlayButton'
import { playInterval } from '@/audio/AudioEngine'
import { motion, AnimatePresence } from 'framer-motion'

export function Interval() {
  const generate = useCallback((d: 1 | 2 | 3) => IntervalExercise.generate(d), [])
  const check = useCallback((q: IntervalQuestion, a: string) => IntervalExercise.check(q, a), [])

  const {
    phase, question, isCorrect,
    difficulty, currentRound, totalRounds, score,
    startSession, play, submit, next, reset,
  } = useExercise<IntervalQuestion, string>({ category: 'interval', generateQuestion: generate, checkAnswer: check })

  const options = question
    ? IntervalExercise.options(question, difficulty)
    : IntervalExercise.options({ root: 'C4', target: 'G4', semitones: 7, label: 'P5', ascending: true }, difficulty)

  useKeyboardAnswer(options, submit, phase === 'answering')

  function handleReplay() {
    if (!question) return
    void playInterval(question.root, question.target)
  }

  return (
    <ExerciseShell
      title="Intervals" symbol="♩"
      phase={phase} difficulty={difficulty}
      currentRound={currentRound} totalRounds={totalRounds} score={score}
      onStartSession={startSession} onReset={reset}
    >
      {phase === 'idle' && <PlayButton label="Play Interval" onClick={play} />}

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
  phase: Phase
  difficulty: 1 | 2 | 3
  currentRound: number
  totalRounds: number
  score: number
  onStartSession: (difficulty: 1 | 2 | 3, rounds: 3 | 5 | 10) => void
  onReset: () => void
  children: React.ReactNode
}

const DIFFICULTY_LABELS: Record<1 | 2 | 3, string> = { 1: 'Easy', 2: 'Medium', 3: 'Hard' }
const ROUND_OPTIONS = [3, 5, 10] as const

export function ExerciseShell({
  title, symbol, phase, difficulty, currentRound, totalRounds, score, onStartSession, onReset, children,
}: ShellProps) {
  const [selDiff, setSelDiff] = useState<1 | 2 | 3>(1)
  const [selRounds, setSelRounds] = useState<3 | 5 | 10>(5)

  const pct = Math.round((score / totalRounds) * 100)

  if (phase === 'setup') {
    return (
      <PageWrap>
        <Card>
          <CardHeader title={title} symbol={symbol} />
          <div style={{ padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* Difficulty */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <SectionLabel>Difficulty</SectionLabel>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {([1, 2, 3] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelDiff(d)}
                    style={{
                      padding: '14px 10px',
                      background: selDiff === d ? 'var(--accent)' : 'var(--bg-surface-2)',
                      color: selDiff === d ? '#0F0D0B' : 'var(--text-muted)',
                      border: '1px solid',
                      borderColor: selDiff === d ? 'var(--accent)' : 'var(--border)',
                      borderRadius: 'var(--radius)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '12px',
                      fontWeight: selDiff === d ? 700 : 400,
                      letterSpacing: '0.04em',
                      cursor: 'pointer',
                      transition: 'all 0.12s',
                      boxShadow: selDiff === d ? '0 2px 12px var(--accent-glow)' : 'none',
                    }}
                  >
                    {DIFFICULTY_LABELS[d]}
                  </button>
                ))}
              </div>
            </div>

            {/* Rounds */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <SectionLabel>Rounds</SectionLabel>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {ROUND_OPTIONS.map((r) => (
                  <button
                    key={r}
                    onClick={() => setSelRounds(r)}
                    style={{
                      padding: '14px 10px',
                      background: selRounds === r ? 'var(--accent)' : 'var(--bg-surface-2)',
                      color: selRounds === r ? '#0F0D0B' : 'var(--text-muted)',
                      border: '1px solid',
                      borderColor: selRounds === r ? 'var(--accent)' : 'var(--border)',
                      borderRadius: 'var(--radius)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '18px',
                      fontWeight: selRounds === r ? 700 : 400,
                      cursor: 'pointer',
                      transition: 'all 0.12s',
                      boxShadow: selRounds === r ? '0 2px 12px var(--accent-glow)' : 'none',
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Start */}
            <button
              onClick={() => onStartSession(selDiff, selRounds)}
              style={{
                padding: '16px',
                background: 'var(--accent)',
                color: '#0F0D0B',
                border: 'none',
                borderRadius: 'var(--radius)',
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                boxShadow: '0 4px 20px var(--accent-glow)',
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
              Begin Session
            </button>
          </div>
        </Card>
      </PageWrap>
    )
  }

  if (phase === 'results') {
    const grade =
      pct >= 90 ? 'Excellent' :
      pct >= 70 ? 'Good' :
      pct >= 50 ? 'Keep Practising' :
      'Keep At It'

    return (
      <PageWrap>
        <Card>
          <CardHeader title={title} symbol={symbol} />
          <div style={{ padding: '40px 28px', display: 'flex', flexDirection: 'column', gap: '28px', alignItems: 'center', textAlign: 'center' }}>

            {/* Score */}
            <div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '72px',
                fontWeight: 600,
                color: 'var(--accent)',
                lineHeight: 1,
                letterSpacing: '-0.02em',
              }}>
                {score}<span style={{ fontSize: '36px', color: 'var(--text-muted)', fontWeight: 400 }}>/{totalRounds}</span>
              </div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                color: 'var(--text-muted)',
                marginTop: '8px',
                letterSpacing: '0.04em',
              }}>
                {pct}% correct · {DIFFICULTY_LABELS[difficulty]}
              </div>
            </div>

            {/* Grade */}
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '28px',
              fontStyle: 'italic',
              fontWeight: 500,
              color: pct >= 70 ? 'var(--success)' : pct >= 50 ? 'var(--accent)' : 'var(--text-muted)',
              letterSpacing: '-0.01em',
            }}>
              {grade}
            </div>

            {/* Round dots */}
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
              {Array.from({ length: totalRounds }).map((_, i) => (
                <div key={i} style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: i < score ? 'var(--accent)' : 'var(--bg-highlight)',
                  border: '1px solid',
                  borderColor: i < score ? 'var(--accent)' : 'var(--border)',
                  boxShadow: i < score ? '0 0 6px var(--accent-glow)' : 'none',
                }} />
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
              <button
                onClick={onReset}
                style={{
                  padding: '14px',
                  background: 'var(--accent)',
                  color: '#0F0D0B',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px var(--accent-glow)',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-bright)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)' }}
              >
                Play Again
              </button>
              <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                <button style={{
                  width: '100%',
                  padding: '12px',
                  background: 'transparent',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
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
                  Back to Dashboard
                </button>
              </Link>
            </div>
          </div>
        </Card>
      </PageWrap>
    )
  }

  return (
    <PageWrap>
      <Card>
        {/* Game header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--accent)', lineHeight: 1, opacity: 0.85 }}>
              {symbol}
            </span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 600, color: 'var(--text)', margin: 0, letterSpacing: '-0.01em' }}>
              {title}
            </h1>
          </div>

          {/* Round counter + difficulty badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '10px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              background: 'var(--bg-surface-2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '4px 10px',
            }}>
              {DIFFICULTY_LABELS[difficulty]}
            </span>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--accent)',
            }}>
              {currentRound} / {totalRounds}
            </span>
          </div>
        </div>

        {/* Round progress bar */}
        <div style={{ height: '2px', background: 'var(--border)' }}>
          <div style={{
            height: '100%',
            width: `${(currentRound / totalRounds) * 100}%`,
            background: 'var(--accent)',
            transition: 'width 0.3s ease',
            boxShadow: '0 0 6px var(--accent-glow)',
          }} />
        </div>

        {/* Card body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {children}
        </div>
      </Card>
    </PageWrap>
  )
}

/* ── Small shared sub-components ────────────────────────────── */

function PageWrap({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
      {children}
    </div>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ width: '100%', maxWidth: '560px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      {children}
    </div>
  )
}

function CardHeader({ title, symbol }: { title: string; symbol: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--accent)', lineHeight: 1, opacity: 0.85 }}>{symbol}</span>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 600, color: 'var(--text)', margin: 0, letterSpacing: '-0.01em' }}>{title}</h1>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: 'var(--font-body)', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
      {children}
    </div>
  )
}

export function ReplayButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
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
  )
}

interface FeedbackRowProps {
  isCorrect: boolean | null
  message: string
  onNext: () => void
  isLastRound?: boolean
}

export function FeedbackRow({ isCorrect, message, onNext, isLastRound }: FeedbackRowProps) {
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
        {isLastRound ? 'See Results →' : 'Next →'}
      </button>
    </div>
  )
}
