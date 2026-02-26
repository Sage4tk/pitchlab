import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { resetPassword } from '@/lib/firebaseAuth'
import { AuthShell } from '@/pages/Login'

export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    try {
      await resetPassword(email)
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email')
    }
  }

  if (sent) {
    return (
      <AuthShell>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', textAlign: 'center' }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '48px',
            color: 'var(--accent)',
          }}>
            ♩
          </span>
          <div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '22px',
              fontWeight: 600,
              color: 'var(--text)',
              letterSpacing: '-0.01em',
            }}>
              Check your email
            </div>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              color: 'var(--text-muted)',
              marginTop: '8px',
              lineHeight: 1.75,
              letterSpacing: '0.02em',
            }}>
              We sent a password reset link to your inbox.
            </p>
          </div>
          <Link to="/login" style={{
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontWeight: 600,
            display: 'inline-block',
            padding: '10px 28px',
            background: 'var(--accent)',
            color: '#0F0D0B',
            borderRadius: 'var(--radius)',
            textDecoration: 'none',
            boxShadow: '0 4px 16px var(--accent-glow)',
          }}>
            Back to login
          </Link>
        </div>
      </AuthShell>
    )
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 13px',
    fontSize: '13px',
    fontFamily: 'var(--font-body)',
    background: 'var(--bg-surface-2)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    color: 'var(--text)',
    outline: 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
    boxSizing: 'border-box',
    letterSpacing: '0.02em',
  }

  return (
    <AuthShell>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Brand */}
          <div style={{ textAlign: 'center' }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '28px',
                fontWeight: 600,
                color: 'var(--accent)',
                letterSpacing: '0.02em',
              }}>
                Pitchlab
              </span>
            </Link>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '22px',
              fontWeight: 500,
              color: 'var(--text)',
              marginTop: '12px',
              letterSpacing: '-0.01em',
            }}>
              Reset your password
            </div>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              color: 'var(--text-muted)',
              marginTop: '4px',
              letterSpacing: '0.03em',
            }}>
              Enter your email and we'll send a reset link.
            </div>
          </div>

          {/* Email field */}
          <div>
            <label htmlFor="email" style={{
              display: 'block',
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: '6px',
            }}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent)'
                e.target.style.boxShadow = '0 0 0 2px var(--accent-dim)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border)'
                e.target.style.boxShadow = 'none'
              }}
            />
            {error && (
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: '11px',
                color: 'var(--error)',
                display: 'block',
                marginTop: '6px',
              }}>
                {error}
              </span>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '11px',
              background: 'var(--accent)',
              color: '#0F0D0B',
              border: 'none',
              borderRadius: 'var(--radius)',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              transition: 'background 0.15s, transform 0.12s',
              boxShadow: '0 4px 16px var(--accent-glow)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--accent-bright)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--accent)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            Send reset link
          </button>

          <div style={{ textAlign: 'center' }}>
            <Link to="/login" style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              color: 'var(--accent)',
              textDecoration: 'none',
              fontWeight: 500,
              letterSpacing: '0.04em',
            }}>
              ← Back to login
            </Link>
          </div>
        </div>
      </form>
    </AuthShell>
  )
}
