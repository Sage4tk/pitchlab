import { Link, useLocation } from 'react-router-dom'
import { logOut } from '@/lib/firebaseAuth'
import { useSession } from '@/hooks/useSession'

const PUBLIC_PATHS = ['/', '/login', '/signup', '/forgot-password']

const navLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/progress', label: 'Progress' },
  { to: '/settings', label: 'Settings' },
]

export function Navbar() {
  const { user } = useSession()
  const { pathname } = useLocation()

  if (PUBLIC_PATHS.includes(pathname) || !user) return null

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border)',
      padding: '0 24px',
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '52px',
      }}>
        {/* Wordmark */}
        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '22px',
            fontWeight: 600,
            color: 'var(--accent)',
            letterSpacing: '0.02em',
          }}>
            Pitchlab
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {navLinks.map(({ to, label }) => {
            const active = pathname === to
            return (
              <Link key={to} to={to} style={{ textDecoration: 'none' }}>
                <span style={{
                  display: 'inline-block',
                  padding: '5px 12px',
                  fontSize: '12px',
                  fontFamily: 'var(--font-body)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                  color: active ? 'var(--accent)' : 'var(--text-muted)',
                  background: active ? 'var(--accent-dim)' : 'transparent',
                  border: active ? '1px solid var(--border)' : '1px solid transparent',
                  borderRadius: 'var(--radius)',
                  transition: 'color 0.15s, background 0.15s',
                }}>
                  {label}
                </span>
              </Link>
            )
          })}

          {/* Separator */}
          <div style={{ width: '1px', height: '18px', background: 'var(--border)', margin: '0 8px' }} />

          {/* Logout */}
          <button
            onClick={() => logOut()}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              fontWeight: 500,
              color: 'var(--text-faint)',
              padding: '5px 10px',
              borderRadius: 'var(--radius)',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--error)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-faint)' }}
          >
            Log out
          </button>
        </div>
      </div>
    </nav>
  )
}
