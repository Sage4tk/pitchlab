import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { AuthForm } from '@/components/AuthForm'
import { GoogleButton } from '@/components/GoogleButton'
import { signUp, signInWithGoogle } from '@/lib/firebaseAuth'
import { useSession } from '@/hooks/useSession'
import { AuthShell } from '@/pages/Login'

export function Signup() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const { user, loading } = useSession()

  if (!loading && user) return <Navigate to="/dashboard" replace />

  async function handleSubmit(email: string, password: string) {
    setError('')
    try {
      await signUp(email, password)
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed')
    }
  }

  async function handleGoogle() {
    setError('')
    try {
      await signInWithGoogle()
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed')
    }
  }

  if (done) {
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
              We sent a verification link to your inbox. Once verified, you're good to go.
            </p>
          </div>
          <Link
            to="/login"
            style={{
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
            }}
          >
            Go to login
          </Link>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
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
            Create your account
          </div>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            color: 'var(--text-muted)',
            marginTop: '4px',
            letterSpacing: '0.03em',
          }}>
            Free forever. No credit card needed.
          </div>
        </div>

        <GoogleButton onClick={handleGoogle} label="Sign up with Google" />

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '10px',
            color: 'var(--text-faint)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>
            or email
          </span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>

        <AuthForm mode="signup" onSubmit={handleSubmit} error={error} />

        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: '12px',
          color: 'var(--text-muted)',
          textAlign: 'center',
        }}>
          Already have an account?{' '}
          <Link to="/login" style={{
            color: 'var(--accent)',
            textDecoration: 'none',
            fontWeight: 500,
          }}>
            Log in
          </Link>
        </span>
      </div>
    </AuthShell>
  )
}
