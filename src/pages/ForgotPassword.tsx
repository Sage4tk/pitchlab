import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { resetPassword } from '@/lib/firebaseAuth'
import { Box, Stack, Text } from '@chakra-ui/react'

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
        <Stack gap={4} textAlign="center" align="center">
          <Box fontSize="4xl">✉️</Box>
          <Box>
            <Text fontWeight="800" fontSize="xl" color="#0f172a" letterSpacing="-0.02em">
              Check your email
            </Text>
            <Text fontSize="sm" color="#64748b" mt={2} lineHeight="1.6">
              We sent a password reset link to your inbox.
            </Text>
          </Box>
          <Link
            to="/login"
            style={{
              display: 'inline-block',
              padding: '10px 28px',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              color: 'white',
              borderRadius: '10px',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 700,
              boxShadow: '0 4px 16px rgba(79,70,229,0.4)',
            }}
          >
            Back to login
          </Link>
        </Stack>
      </AuthShell>
    )
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
    <AuthShell>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <Stack gap={5}>
          {/* Brand */}
          <Box textAlign="center" mb={2}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Text fontWeight="900" fontSize="2xl" color="#4f46e5" letterSpacing="-0.04em">
                Pitchlab
              </Text>
            </Link>
            <Text fontWeight="800" fontSize="xl" color="#0f172a" letterSpacing="-0.02em" mt={3}>
              Reset your password
            </Text>
            <Text fontSize="sm" color="#64748b" mt={1}>
              Enter your email and we'll send a reset link.
            </Text>
          </Box>

          {/* Email field */}
          <Box>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '6px',
                fontFamily: 'inherit',
              }}
            >
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
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            {error && (
              <Text fontSize="xs" color="red.500" mt={1}>
                {error}
              </Text>
            )}
          </Box>

          {/* Submit */}
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
            Send reset link
          </button>

          <Text fontSize="sm" color="#64748b" textAlign="center">
            <Link to="/login" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}>
              ← Back to login
            </Link>
          </Text>
        </Stack>
      </form>
    </AuthShell>
  )
}

function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <Box
      minH="100vh"
      background="linear-gradient(160deg, #0f0c29 0%, #1e1b4b 45%, #312e81 100%)"
      position="relative"
      overflow="hidden"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={4}
      py={12}
    >
      <Box
        position="absolute"
        inset={0}
        opacity={0.04}
        backgroundImage="radial-gradient(circle, white 1px, transparent 1px)"
        backgroundSize="32px 32px"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        top="-80px"
        left="50%"
        transform="translateX(-50%)"
        w="560px"
        h="320px"
        background="radial-gradient(ellipse, rgba(99,102,241,0.28) 0%, transparent 70%)"
        pointerEvents="none"
      />
      <Box
        width="full"
        maxW="420px"
        bg="white"
        borderRadius="24px"
        boxShadow="0 32px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.08)"
        p={{ base: 7, sm: 9 }}
        position="relative"
      >
        {children}
      </Box>
    </Box>
  )
}
