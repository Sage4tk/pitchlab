import { useState, type FormEvent } from 'react'
import { Stack, Field, Text } from '@chakra-ui/react'

interface Props {
  mode: 'login' | 'signup'
  onSubmit: (email: string, password: string) => Promise<void>
  error?: string
}

interface PasswordStrength {
  score: number // 0-4
  label: string
  color: string
  checks: {
    length: boolean
    uppercase: boolean
    number: boolean
    special: boolean
  }
}

function getPasswordStrength(password: string): PasswordStrength {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  }
  const score = Object.values(checks).filter(Boolean).length
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const colors = ['', '#e05252', '#d4923a', '#b8a830', '#4caf7d']
  return { score, label: labels[score] ?? '', color: colors[score] ?? '', checks }
}

export function AuthForm({ mode, onSubmit, error }: Props) {
  const isSignup = mode === 'signup'
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [confirmTouched, setConfirmTouched] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const strength = isSignup ? getPasswordStrength(password) : null
  const passwordsMatch = password === confirmPassword
  const confirmError = confirmTouched && !passwordsMatch ? 'Passwords do not match' : ''

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value

    if (isSignup) {
      if (strength!.score < 3) return
      if (!passwordsMatch) return
    }

    setSubmitting(true)
    try {
      await onSubmit(email, password)
    } finally {
      setSubmitting(false)
    }
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

  function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    e.target.style.borderColor = 'var(--accent)'
    e.target.style.boxShadow = '0 0 0 2px var(--accent-dim)'
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    e.target.style.borderColor = 'var(--border)'
    e.target.style.boxShadow = 'none'
  }

  const labelStyle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 500,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-body)',
    marginBottom: '6px',
  }

  const checkStyle = (met: boolean): React.CSSProperties => ({
    fontFamily: 'var(--font-body)',
    fontSize: '11px',
    color: met ? '#4caf7d' : 'var(--text-faint)',
    transition: 'color 0.2s',
  })

  const isSubmitDisabled = isSignup
    ? submitting || strength!.score < 3 || !passwordsMatch || confirmPassword === ''
    : submitting

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <Stack gap={4}>
        <Field.Root>
          <Field.Label style={labelStyle}>Email</Field.Label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            style={inputStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </Field.Root>

        <Field.Root>
          <Field.Label style={labelStyle}>Password</Field.Label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={isSignup ? 'Create a strong password' : '••••••••'}
            style={inputStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />

          {/* Strength bar — signup only */}
          {isSignup && password.length > 0 && (
            <div style={{ marginTop: '8px' }}>
              {/* Bar */}
              <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: '3px',
                      borderRadius: '2px',
                      background: i <= strength!.score ? strength!.color : 'var(--border)',
                      transition: 'background 0.2s',
                    }}
                  />
                ))}
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '10px',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: strength!.color,
                  minWidth: '40px',
                  textAlign: 'right',
                  transition: 'color 0.2s',
                }}>
                  {strength!.label}
                </span>
              </div>
              {/* Checklist */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px 12px' }}>
                <span style={checkStyle(strength!.checks.length)}>
                  {strength!.checks.length ? '✓' : '○'} 8+ characters
                </span>
                <span style={checkStyle(strength!.checks.uppercase)}>
                  {strength!.checks.uppercase ? '✓' : '○'} Uppercase letter
                </span>
                <span style={checkStyle(strength!.checks.number)}>
                  {strength!.checks.number ? '✓' : '○'} Number
                </span>
                <span style={checkStyle(strength!.checks.special)}>
                  {strength!.checks.special ? '✓' : '○'} Special character
                </span>
              </div>
            </div>
          )}
        </Field.Root>

        {/* Confirm password — signup only */}
        {isSignup && (
          <Field.Root invalid={!!confirmError}>
            <Field.Label style={labelStyle}>Confirm Password</Field.Label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => setConfirmTouched(true)}
              placeholder="Re-enter your password"
              style={{
                ...inputStyle,
                borderColor: confirmError ? 'var(--error)' : undefined,
              }}
              onFocus={handleFocus}
            />
            {confirmError && (
              <Text fontSize="xs" mt={1} style={{ color: 'var(--error)', fontFamily: 'var(--font-body)' }}>
                {confirmError}
              </Text>
            )}
          </Field.Root>
        )}

        {/* Server error */}
        {error && (
          <Text fontSize="xs" style={{ color: 'var(--error)', fontFamily: 'var(--font-body)', marginTop: '-8px' }}>
            {error}
          </Text>
        )}

        <button
          type="submit"
          disabled={isSubmitDisabled}
          style={{
            width: '100%',
            padding: '11px',
            background: isSubmitDisabled ? 'var(--bg-surface-2)' : 'var(--accent)',
            color: isSubmitDisabled ? 'var(--text-faint)' : '#0F0D0B',
            border: isSubmitDisabled ? '1px solid var(--border)' : 'none',
            borderRadius: 'var(--radius)',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: isSubmitDisabled ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-body)',
            transition: 'background 0.15s, box-shadow 0.15s, transform 0.12s',
            boxShadow: isSubmitDisabled ? 'none' : '0 4px 16px var(--accent-glow)',
          }}
          onMouseEnter={(e) => {
            if (!isSubmitDisabled) {
              e.currentTarget.style.background = 'var(--accent-bright)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }
          }}
          onMouseLeave={(e) => {
            if (!isSubmitDisabled) {
              e.currentTarget.style.background = 'var(--accent)'
              e.currentTarget.style.transform = 'translateY(0)'
            }
          }}
        >
          {mode === 'login' ? 'Log In' : 'Create Account'}
        </button>
      </Stack>
    </form>
  )
}
