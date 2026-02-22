import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { AuthForm } from '@/components/AuthForm'
import { GoogleButton } from '@/components/GoogleButton'
import { signIn, signInWithGoogle } from '@/lib/firebaseAuth'
import { Box, Stack, Text } from '@chakra-ui/react'
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
      <Stack gap={5}>
        {/* Brand */}
        <Box textAlign="center" mb={2}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Text fontWeight="900" fontSize="2xl" color="#4f46e5" letterSpacing="-0.04em">
              Pitchlab
            </Text>
          </Link>
          <Text fontWeight="800" fontSize="xl" color="#0f172a" letterSpacing="-0.02em" mt={3}>
            Welcome back
          </Text>
          <Text fontSize="sm" color="#64748b" mt={1}>
            Sign in to continue training
          </Text>
        </Box>

        <GoogleButton onClick={handleGoogle} />

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          <Text fontSize="xs" color="#94a3b8" fontWeight="500">or continue with email</Text>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
        </div>

        <AuthForm mode="login" onSubmit={handleSubmit} error={error} />

        <Stack gap={1.5} textAlign="center">
          <Link
            to="/forgot-password"
            style={{ fontSize: '0.8rem', color: '#6366f1', textDecoration: 'none', fontWeight: 500 }}
          >
            Forgot your password?
          </Link>
          <Text fontSize="sm" color="#64748b">
            No account?{' '}
            <Link to="/signup" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}>
              Sign up free
            </Link>
          </Text>
        </Stack>
      </Stack>
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
      {/* Dot grid */}
      <Box
        position="absolute"
        inset={0}
        opacity={0.04}
        backgroundImage="radial-gradient(circle, white 1px, transparent 1px)"
        backgroundSize="32px 32px"
        pointerEvents="none"
      />
      {/* Glow */}
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
      {/* Card */}
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
