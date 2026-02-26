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
]

const steps = [
  { n: '01', title: 'Sign up', desc: 'Create a free account in seconds. No credit card, no catch.' },
  { n: '02', title: 'Choose an exercise', desc: 'Pick from intervals, chords, melody, or rhythm at any difficulty.' },
  { n: '03', title: 'Track progress', desc: 'See accuracy trends, maintain your daily streak, and level up.' },
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
        <nav style={{
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
              Four disciplines. One app.
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

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1px',
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
                    borderRight: i < features.length - 1 ? '1px solid var(--border)' : 'none',
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
