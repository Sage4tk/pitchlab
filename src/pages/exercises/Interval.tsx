import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useExercise } from '@/hooks/useExercise'
import type { Phase } from '@/hooks/useExercise'
import { useKeyboardAnswer } from '@/hooks/useKeyboard'
import { IntervalExercise } from '@/exercises/IntervalExercise'
import type { IntervalQuestion } from '@/exercises/IntervalExercise'
import { AnswerGrid } from '@/components/AnswerGrid'
import { PlayButton } from '@/components/PlayButton'
import { playInterval, setSoundPreset as setAudioPreset, isPianoReady, onPianoReady, isPianoFailed, onPianoError } from '@/audio/AudioEngine'
import type { SoundPreset } from '@/audio/AudioEngine'
import { useExerciseStore } from '@/store/useExerciseStore'
import { INTERVAL_TIPS } from '@/data/feedbackTips'
import { useXPStore } from '@/store/useXPStore'
import { motion, AnimatePresence } from 'framer-motion'

export function Interval() {
  const generate = useCallback((d: 1 | 2 | 3) => IntervalExercise.generate(d), [])
  const check = useCallback((q: IntervalQuestion, a: string) => IntervalExercise.check(q, a), [])
  const getItemLabel = useCallback((q: IntervalQuestion) => q.label, [])
  const replayQuestion = useCallback((q: IntervalQuestion) => { void playInterval(q.root, q.target) }, [])

  const {
    phase, question, isCorrect, xpEarned,
    difficulty, currentRound, totalRounds, score,
    sessionStats,
    startSession, play, submit, next, reset,
    wrongQuestions, startReview,
  } = useExercise<IntervalQuestion, string>({ category: 'interval', generateQuestion: generate, checkAnswer: check, getItemLabel, replayQuestion })

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
      hint="Listen to two notes and identify the distance between them — the interval."
      phase={phase} difficulty={difficulty}
      currentRound={currentRound} totalRounds={totalRounds} score={score}
      sessionStats={sessionStats}
      onStartSession={startSession} onReset={reset}
      onReview={() => startReview(wrongQuestions)} wrongCount={wrongQuestions.length}
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
              xpEarned={xpEarned}
              tip={question ? INTERVAL_TIPS[question.label] : undefined}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </ExerciseShell>
  )
}

/* ── Shared within exercise pages ───────────────────────────── */

interface SessionStats {
  sessionXP: number
  avgMs: number
  fastestMs: number
  slowestMs: number
}

interface ShellProps {
  title: string
  symbol: string
  hint?: string
  phase: Phase
  difficulty: 1 | 2 | 3
  currentRound: number
  totalRounds: number
  score: number
  sessionStats?: SessionStats
  onStartSession: (difficulty: 1 | 2 | 3, rounds: 3 | 5 | 10) => void
  onReset: () => void
  children: React.ReactNode
  onReview?: () => void
  wrongCount?: number
  setupExtras?: React.ReactNode
}

const DIFFICULTY_LABELS: Record<1 | 2 | 3, string> = { 1: 'Easy', 2: 'Medium', 3: 'Hard' }
const ROUND_OPTIONS = [3, 5, 10] as const
const INSTRUMENT_OPTIONS: { value: SoundPreset; label: string }[] = [
  { value: 'piano', label: 'Piano' },
  { value: 'guitar', label: 'Guitar' },
  { value: 'triangle', label: 'Triangle' },
  { value: 'sine', label: 'Sine' },
  { value: 'sawtooth', label: 'Sawtooth' },
]

export function ExerciseShell({
  title, symbol, hint, phase, difficulty, currentRound, totalRounds, score, sessionStats, onStartSession, onReset, children, onReview, wrongCount, setupExtras,
}: ShellProps) {
  const [selDiff, setSelDiff] = useState<1 | 2 | 3>(1)
  const [selRounds, setSelRounds] = useState<3 | 5 | 10>(5)
  const { soundPreset, setSoundPreset: storeSoundPreset } = useExerciseStore()
  const [pianoSamplerReady, setPianoSamplerReady] = useState(() => isPianoReady())
  const [pianoLoadFailed, setPianoLoadFailed] = useState(() => isPianoFailed())

  useEffect(() => {
    if (soundPreset !== 'piano') { setPianoSamplerReady(true); setPianoLoadFailed(false); return }
    if (isPianoReady()) { setPianoSamplerReady(true); return }
    if (isPianoFailed()) { setPianoLoadFailed(true); return }
    setPianoSamplerReady(false)
    setPianoLoadFailed(false)
    const unsubReady = onPianoReady(() => { setPianoSamplerReady(true); setPianoLoadFailed(false) })
    const unsubError = onPianoError(() => { setPianoLoadFailed(true) })
    return () => { unsubReady(); unsubError() }
  }, [soundPreset])

  function handleSoundChange(preset: SoundPreset) {
    storeSoundPreset(preset)
    setAudioPreset(preset)
  }

  const pct = Math.round((score / totalRounds) * 100)

  if (phase === 'setup') {
    return (
      <PageWrap>
        <Card>
          <CardHeader title={title} symbol={symbol} />
          {hint && (
            <div style={{
              margin: '16px 28px 0',
              padding: '12px 16px',
              background: 'var(--bg-surface-2)',
              borderLeft: '3px solid var(--accent)',
              borderRadius: '0 var(--radius) var(--radius) 0',
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              color: 'var(--text-muted)',
              lineHeight: 1.5,
            }}>
              {hint}
            </div>
          )}
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

            {/* Instrument */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <SectionLabel>Instrument</SectionLabel>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {INSTRUMENT_OPTIONS.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => handleSoundChange(value)}
                    style={{
                      padding: '8px 14px',
                      background: soundPreset === value ? 'var(--accent)' : 'var(--bg-surface-2)',
                      color: soundPreset === value ? '#0F0D0B' : 'var(--text-muted)',
                      border: '1px solid',
                      borderColor: soundPreset === value ? 'var(--accent)' : 'var(--border)',
                      borderRadius: 'var(--radius)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '12px',
                      fontWeight: soundPreset === value ? 600 : 400,
                      cursor: 'pointer',
                      letterSpacing: '0.04em',
                      transition: 'all 0.12s',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Exercise-specific extras */}
            {setupExtras}

            {/* Piano loading / error indicator */}
            {soundPreset === 'piano' && !pianoSamplerReady && !pianoLoadFailed && (
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: '11px',
                letterSpacing: '0.06em',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>♩</span>
                Loading piano samples…
              </div>
            )}
            {soundPreset === 'piano' && pianoLoadFailed && (
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: '11px',
                letterSpacing: '0.06em',
                color: '#e07070',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                ✕ Piano samples failed to load — pick a different instrument above.
              </div>
            )}

            {/* Start */}
            {(() => {
              const blocked = soundPreset === 'piano' && (!pianoSamplerReady || pianoLoadFailed)
              return (
                <button
                  onClick={() => onStartSession(selDiff, selRounds)}
                  disabled={blocked}
                  style={{
                    padding: '16px',
                    background: blocked ? 'var(--bg-surface-2)' : 'var(--accent)',
                    color: blocked ? 'var(--text-muted)' : '#0F0D0B',
                    border: 'none',
                    borderRadius: 'var(--radius)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '13px',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    cursor: blocked ? 'not-allowed' : 'pointer',
                    boxShadow: blocked ? 'none' : '0 4px 20px var(--accent-glow)',
                    transition: 'background 0.15s, transform 0.12s',
                  }}
                  onMouseEnter={e => {
                    if (blocked) return
                    e.currentTarget.style.background = 'var(--accent-bright)'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={e => {
                    if (blocked) return
                    e.currentTarget.style.background = 'var(--accent)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  {soundPreset === 'piano' && !pianoSamplerReady && !pianoLoadFailed ? 'Loading Samples…' : 'Begin Session'}
                </button>
              )
            })()}
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
          <div style={{ padding: '40px 28px', display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', textAlign: 'center' }}>

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
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
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

            {/* Session Stats */}
            {sessionStats && <SessionSummary stats={sessionStats} />}

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
              {wrongCount != null && wrongCount > 0 && onReview && (
                <button
                  onClick={onReview}
                  style={{
                    padding: '14px',
                    background: 'transparent',
                    color: 'var(--accent)',
                    border: '1px solid var(--accent)',
                    borderRadius: 'var(--radius)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'background 0.15s, border-color 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-dim)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                >
                  ↩ Review {wrongCount} Mistake{wrongCount === 1 ? '' : 's'}
                </button>
              )}
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

/* ── Session Summary ───────────────────────────────────────── */

function formatTime(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

function SessionSummary({ stats }: { stats: SessionStats }) {
  const { levelInfo } = useXPStore()

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Stat tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
        <StatTile label="XP Earned" value={`+${stats.sessionXP}`} accent />
        <StatTile label="Avg Time" value={formatTime(stats.avgMs)} />
        <StatTile label="Fastest" value={formatTime(stats.fastestMs)} />
      </div>

      {/* Level progress */}
      <div style={{
        background: 'var(--bg-surface-2)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '10px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
          }}>
            Level {levelInfo.level} · {levelInfo.title}
          </span>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '10px',
            color: 'var(--text-muted)',
            letterSpacing: '0.04em',
          }}>
            {levelInfo.currentXP} / {levelInfo.xpForLevel} XP
          </span>
        </div>
        <div style={{
          height: '6px',
          background: 'var(--bg-highlight)',
          borderRadius: '3px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${levelInfo.progressPct}%`,
            background: 'var(--accent)',
            borderRadius: '3px',
            transition: 'width 0.5s ease',
            boxShadow: '0 0 8px var(--accent-glow)',
          }} />
        </div>
      </div>
    </div>
  )
}

function StatTile({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={{
      background: 'var(--bg-surface-2)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '12px 8px',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      alignItems: 'center',
    }}>
      <span style={{
        fontFamily: 'var(--font-body)',
        fontSize: '10px',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
      }}>
        {label}
      </span>
      <span style={{
        fontFamily: 'var(--font-display)',
        fontSize: '20px',
        fontWeight: 600,
        color: accent ? 'var(--accent)' : 'var(--text)',
        letterSpacing: '-0.01em',
      }}>
        {value}
      </span>
    </div>
  )
}

/* ── Small shared sub-components ────────────────────────────── */

function PageWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="exercise-page-wrap" style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
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
  xpEarned?: number
  tip?: string
}

export function FeedbackRow({ isCorrect, message, onNext, isLastRound, xpEarned, tip }: FeedbackRowProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '12px' }}>
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
        {xpEarned != null && xpEarned > 0 && (
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.08em',
            color: 'var(--accent)',
            background: 'var(--accent-dim)',
            border: '1px solid var(--accent)',
            borderRadius: 'var(--radius)',
            padding: '3px 8px',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}>
            +{xpEarned} XP
          </div>
        )}
      </div>
      {tip && (
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: '11px',
          lineHeight: 1.6,
          color: 'var(--text-muted)',
          background: 'var(--bg-surface-2)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '10px 14px',
          letterSpacing: '0.02em',
        }}>
          <span style={{ color: 'var(--accent)', fontWeight: 600, marginRight: '6px' }}>Tip:</span>
          {tip}
        </div>
      )}
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
