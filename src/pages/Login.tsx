import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { AuthForm } from '@/components/AuthForm'
import { GoogleButton } from '@/components/GoogleButton'
import { signIn, signInWithGoogle } from '@/lib/firebaseAuth'
import { useSession } from '@/hooks/useSession'

export function Login() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const { user, loading } = useSession()

  if (!loading && user) return <Navigate to="/dashboard" replace />

  async function handleSubmit(email: string, password: string) {
    setError('')
    try {
      await signIn(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
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
            Welcome back
          </div>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            color: 'var(--text-muted)',
            marginTop: '4px',
            letterSpacing: '0.03em',
          }}>
            Sign in to continue training
          </div>
        </div>

        <GoogleButton onClick={handleGoogle} />

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

        <AuthForm mode="login" onSubmit={handleSubmit} error={error} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'center' }}>
          <Link to="/forgot-password" style={{
            fontFamily: 'var(--font-body)',
            fontSize: '11px',
            color: 'var(--text-muted)',
            textDecoration: 'none',
            letterSpacing: '0.04em',
            transition: 'color 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)' }}
          >
            Forgot your password?
          </Link>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            color: 'var(--text-muted)',
          }}>
            No account?{' '}
            <Link to="/signup" style={{
              color: 'var(--accent)',
              textDecoration: 'none',
              fontWeight: 500,
            }}>
              Sign up free
            </Link>
          </span>
        </div>
      </div>
    </AuthShell>
  )
}

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      /* music staff lines */
      backgroundImage: 'repeating-linear-gradient(transparent, transparent 47px, rgba(255,255,255,0.025) 47px, rgba(255,255,255,0.025) 48px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      position: 'relative',
    }}>
      {/* Subtle amber glow from top */}
      <div style={{
        position: 'absolute',
        top: '-60px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '500px',
        height: '300px',
        background: 'radial-gradient(ellipse, rgba(212,146,58,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%',
        maxWidth: '400px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '40px 36px',
        position: 'relative',
        boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
      }}>
        {children}
      </div>
    </div>
  )
}
