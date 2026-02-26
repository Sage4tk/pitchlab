import type { FormEvent } from 'react'
import { Stack, Field, Text } from '@chakra-ui/react'

interface Props {
  mode: 'login' | 'signup'
  onSubmit: (email: string, password: string) => Promise<void>
  error?: string
}

export function AuthForm({ mode, onSubmit, error }: Props) {
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value
    await onSubmit(email, password)
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

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <Stack gap={4}>
        <Field.Root>
          <Field.Label style={{
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-body)',
            marginBottom: '6px',
          }}>
            Email
          </Field.Label>
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

        <Field.Root invalid={!!error}>
          <Field.Label style={{
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-body)',
            marginBottom: '6px',
          }}>
            Password
          </Field.Label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'}
            style={inputStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          {error && (
            <Text fontSize="xs" mt={1} style={{ color: 'var(--error)', fontFamily: 'var(--font-body)' }}>
              {error}
            </Text>
          )}
        </Field.Root>

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
            transition: 'background 0.15s, box-shadow 0.15s, transform 0.12s',
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
          {mode === 'login' ? 'Log In' : 'Create Account'}
        </button>
      </Stack>
    </form>
  )
}
