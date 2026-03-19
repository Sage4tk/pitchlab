import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const features = [
  {
    symbol: '♩',
    name: 'Intervals',
    description: 'Identify the distance between two notes by ear.',
    path: '/exercises/interval',
  },
  {
    symbol: '♫',
    name: 'Chords',
    description: 'Distinguish major, minor, diminished, and extended harmonies.',
    path: '/exercises/chord',
  },
  {
    symbol: '𝄞',
    name: 'Melody',
    description: 'Transcribe short melodic phrases by clicking a piano keyboard.',
    path: '/exercises/melody',
  },
  {
    symbol: '♬',
    name: 'Rhythm',
    description: 'Tap along to rhythmic patterns and build your internal pulse.',
    path: '/exercises/rhythm',
  },
  {
    symbol: '♮',
    name: 'Progressions',
    description: 'Hear chord sequences and identify common harmonic progressions.',
    path: '/exercises/progression',
  },
  {
    symbol: '♪',
    name: 'Pitch Match',
    description: 'Sing into your mic and match the target pitch with real-time feedback.',
    path: '/exercises/pitch-match',
  },
]

const highlights = [
  {
    symbol: '⬆',
    name: 'XP & Leveling',
    description: 'Earn experience points with every session and watch your level grow.',
  },
  {
    symbol: '🔁',
    name: 'Smart Practice',
    description: 'Spaced repetition surfaces your weak spots so you improve faster.',
  },
  {
    symbol: '🔥',
    name: 'Heat Map',
    description: 'Visualize your training activity and keep your streak alive.',
  },
  {
    symbol: '📋',
    name: 'Mistakes Rundown',
    description: 'Review exactly what you got wrong after each session to learn from errors.',
  },
  {
    symbol: '↩',
    name: 'Undo',
    description: 'Made a misclick? Undo your last answer and try again.',
  },
  {
    symbol: '🎹',
    name: 'Multiple Instruments',
    description: 'Train with piano, guitar, triangle, sine, and sawtooth tones.',
  },
]

const steps = [
  { n: '01', title: 'Sign up', desc: 'Create a free account in seconds. No credit card, no catch.' },
  { n: '02', title: 'Choose an exercise', desc: 'Pick from intervals, chords, melody, rhythm, or vocal pitch at any difficulty.' },
  { n: '03', title: 'Track progress', desc: 'Earn XP, see accuracy heat maps, review mistakes, and level up.' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export function Landing() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>

      {/* ── Hero ─────────────────────────────────────────── */}
      <div style={{
        position: 'relative',
        background: 'var(--bg)',
        overflow: 'hidden',
        /* subtle music staff lines */
        backgroundImage: [
          'repeating-linear-gradient(transparent, transparent 47px, rgba(255,255,255,0.03) 47px, rgba(255,255,255,0.03) 48px)',
          'radial-gradient(ellipse 60% 50% at 50% -10%, rgba(212,146,58,0.08) 0%, transparent 100%)',
        ].join(', '),
      }}>
        {/* Nav */}
        <nav className="landing-nav" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 40px',
          maxWidth: '1100px',
          margin: '0 auto',
        }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '24px',
            fontWeight: 600,
            color: 'var(--accent)',
            letterSpacing: '0.02em',
          }}>
            Pitchlab
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link to="/login" style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              textDecoration: 'none',
              padding: '8px 14px',
              transition: 'color 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              Log In
            </Link>
            <Link to="/signup" style={{ textDecoration: 'none' }}>
              <button style={{
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontWeight: 600,
                background: 'var(--accent)',
                color: '#0F0D0B',
                border: 'none',
                borderRadius: 'var(--radius)',
                padding: '8px 18px',
                cursor: 'pointer',
                boxShadow: '0 4px 20px var(--accent-glow)',
                transition: 'background 0.15s',
              }}>
                Get Started
              </button>
            </Link>
          </div>
        </nav>

        {/* Hero content */}
        <div style={{
          textAlign: 'center',
          padding: '80px 24px 120px',
          maxWidth: '800px',
          margin: '0 auto',
        }}>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.7 }}
          >
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(52px, 8vw, 96px)',
              fontWeight: 600,
              color: 'var(--text)',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              margin: '0 0 4px',
            }}>
              Train your{' '}
              <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>ear.</em>
            </h1>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: 400,
              fontStyle: 'italic',
              color: 'var(--text-muted)',
              lineHeight: 1.2,
              margin: '0 0 40px',
              letterSpacing: '-0.01em',
            }}>
              One note at a time.
            </h2>
          </motion.div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.15 }}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              color: 'var(--text-muted)',
              lineHeight: 1.8,
              maxWidth: '400px',
              margin: '0 auto 48px',
              letterSpacing: '0.02em',
            }}
          >
            Fast, focused ear training. Build the musical skills that matter most — for free.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.28 }}
            className="hero-cta-row"
            style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}
          >
            <Link to="/signup" style={{ textDecoration: 'none' }}>
              <button style={{
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontWeight: 600,
                background: 'var(--accent)',
                color: '#0F0D0B',
                border: 'none',
                borderRadius: 'var(--radius)',
                padding: '13px 32px',
                cursor: 'pointer',
                boxShadow: '0 4px 24px var(--accent-glow)',
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
                Start for free
              </button>
            </Link>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <button style={{
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontWeight: 500,
                background: 'transparent',
                color: 'var(--text-muted)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: '13px 32px',
                cursor: 'pointer',
                transition: 'border-color 0.15s, color 0.15s',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--text-muted)'
                  e.currentTarget.style.color = 'var(--text)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.color = 'var(--text-muted)'
                }}
              >
                Log In
              </button>
            </Link>
          </motion.div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '10px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--text-faint)',
              marginTop: '28px',
            }}
          >
            Free · No Ads · Just Training
          </motion.p>
        </div>
      </div>

      {/* ── Features ─────────────────────────────────────── */}
      <div style={{
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        padding: '80px 24px',
      }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: 'center', marginBottom: '56px' }}
          >
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(32px, 4vw, 52px)',
              fontWeight: 600,
              color: 'var(--text)',
              letterSpacing: '-0.01em',
              margin: '0 0 12px',
            }}>
              Six disciplines. One app.
            </h2>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              color: 'var(--text-muted)',
              letterSpacing: '0.03em',
            }}>
              Exercises built to develop real musical instinct.
            </p>
          </motion.div>

          <div className="disciplines-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1px',
            background: 'var(--border)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
          }}>
            {features.map((f, i) => (
              <motion.div
                key={f.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <div
                  style={{
                    background: 'var(--bg-surface)',
                    padding: '32px 28px',
                    height: '100%',
                    transition: 'background 0.2s',
                    cursor: 'default',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-surface-2)'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-surface)'
                  }}
                >
                  {/* Music symbol */}
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '40px',
                    color: 'var(--accent)',
                    lineHeight: 1,
                    marginBottom: '20px',
                    opacity: 0.9,
                  }}>
                    {f.symbol}
                  </div>

                  {/* Label */}
                  <div style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '10px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--accent)',
                    fontWeight: 500,
                    marginBottom: '8px',
                  }}>
                    {f.name}
                  </div>

                  {/* Description */}
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    lineHeight: 1.75,
                    margin: 0,
                    letterSpacing: '0.01em',
                  }}>
                    {f.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Highlights ───────────────────────────────────── */}
      <div style={{ padding: '80px 24px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: 'center', marginBottom: '56px' }}
          >
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(32px, 4vw, 52px)',
              fontWeight: 600,
              color: 'var(--text)',
              letterSpacing: '-0.01em',
              margin: '0 0 12px',
            }}>
              More than just exercises.
            </h2>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              color: 'var(--text-muted)',
              letterSpacing: '0.03em',
            }}>
              Tools that make your practice smarter and more rewarding.
            </p>
          </motion.div>

          <div className="highlights-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
          }}>
            {highlights.map((h, i) => (
              <motion.div
                key={h.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="highlight-card"
                style={{
                  position: 'relative',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '32px 28px 28px',
                  overflow: 'hidden',
                  transition: 'transform 0.25s, border-color 0.25s, box-shadow 0.25s',
                  cursor: 'default',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.borderColor = 'var(--accent)'
                  el.style.transform = 'translateY(-4px)'
                  el.style.boxShadow = '0 8px 32px rgba(212,146,58,0.12)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.borderColor = 'var(--border)'
                  el.style.transform = 'translateY(0)'
                  el.style.boxShadow = 'none'
                }}
              >
                {/* Top accent line */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '28px',
                  right: '28px',
                  height: '2px',
                  background: 'linear-gradient(90deg, var(--accent), transparent)',
                  opacity: 0.4,
                }} />

                {/* Icon with glow background */}
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(212,146,58,0.08)',
                  border: '1px solid rgba(212,146,58,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  marginBottom: '20px',
                }}>
                  {h.symbol}
                </div>

                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '18px',
                  fontWeight: 600,
                  color: 'var(--text)',
                  marginBottom: '8px',
                  letterSpacing: '-0.01em',
                }}>
                  {h.name}
                </div>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  lineHeight: 1.8,
                  margin: 0,
                  letterSpacing: '0.01em',
                }}>
                  {h.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── How it works ─────────────────────────────────── */}
      <div style={{ padding: '80px 24px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: 'center', marginBottom: '56px' }}
          >
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: 600,
              color: 'var(--text)',
              letterSpacing: '-0.01em',
              margin: '0 0 12px',
            }}>
              How it works
            </h2>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              color: 'var(--text-muted)',
              letterSpacing: '0.03em',
            }}>
              From zero to training in under a minute.
            </p>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '24px',
                  padding: '28px 0',
                  borderBottom: i < steps.length - 1 ? '1px solid var(--border)' : 'none',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '11px',
                    letterSpacing: '0.08em',
                    color: 'var(--text-faint)',
                    paddingTop: '2px',
                    minWidth: '28px',
                  }}>
                    {s.n}
                  </span>
                  <div>
                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '22px',
                      fontWeight: 600,
                      color: 'var(--text)',
                      marginBottom: '6px',
                    }}>
                      {s.title}
                    </div>
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '13px',
                      color: 'var(--text-muted)',
                      margin: 0,
                      lineHeight: 1.75,
                    }}>
                      {s.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer CTA ───────────────────────────────────── */}
      <div style={{
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border)',
        padding: '80px 24px',
        textAlign: 'center',
      }}>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 4vw, 52px)',
            fontStyle: 'italic',
            fontWeight: 600,
            color: 'var(--text)',
            letterSpacing: '-0.01em',
            margin: '0 0 16px',
          }}>
            Ready to sharpen your ears?
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            color: 'var(--text-muted)',
            marginBottom: '36px',
            letterSpacing: '0.02em',
          }}>
            Join musicians building better instincts every day.
          </p>
          <Link to="/signup" style={{ textDecoration: 'none' }}>
            <button style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontWeight: 600,
              background: 'var(--accent)',
              color: '#0F0D0B',
              border: 'none',
              borderRadius: 'var(--radius)',
              padding: '14px 40px',
              cursor: 'pointer',
              boxShadow: '0 4px 24px var(--accent-glow)',
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
              Start for free
            </button>
          </Link>
        </motion.div>

        {/* Footer note */}
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '11px',
          letterSpacing: '0.06em',
          color: 'var(--text-faint)',
          marginTop: '48px',
        }}>
          Pitchlab — ear training, free forever.
        </p>
      </div>
    </div>
  )
}
