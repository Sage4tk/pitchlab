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
    padding: '11px 14px',
    fontSize: '0.9rem',
    border: '1.5px solid #e2e8f0',
    borderRadius: '10px',
    outline: 'none',
    background: '#fafbff',
    color: '#1a202c',
    fontFamily: 'inherit',
    transition: 'border-color 0.15s, box-shadow 0.15s',
    boxSizing: 'border-box',
  }

  function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    e.target.style.borderColor = '#6366f1'
    e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)'
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    e.target.style.borderColor = '#e2e8f0'
    e.target.style.boxShadow = 'none'
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <Stack gap={4}>
        <Field.Root>
          <Field.Label fontSize="sm" fontWeight="600" color="#374151">
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
          <Field.Label fontSize="sm" fontWeight="600" color="#374151">
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
            <Text fontSize="xs" color="red.500" mt={1}>
              {error}
            </Text>
          )}
        </Field.Root>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '0.95rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(79,70,229,0.4)',
            transition: 'all 0.15s ease',
            fontFamily: 'inherit',
            letterSpacing: '-0.01em',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(79,70,229,0.55)'
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(79,70,229,0.4)'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          {mode === 'login' ? 'Log In' : 'Create Account'}
        </button>
      </Stack>
    </form>
  )
}
