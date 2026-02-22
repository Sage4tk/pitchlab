import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthForm } from '@/components/AuthForm'
import { GoogleButton } from '@/components/GoogleButton'
import { signIn, signInWithGoogle } from '@/lib/firebaseAuth'
import {
  Center,
  Card,
  Stack,
  Heading,
  HStack,
  Separator,
  Text,
} from '@chakra-ui/react'

export function Login() {
  const navigate = useNavigate()
  const [error, setError] = useState('')

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
    <Center minH="100vh" bg="bg.subtle">
      <Card.Root width="full" maxW="sm" mx={4}>
        <Card.Body>
          <Stack gap={4}>
            <Heading size="lg" textAlign="center">
              Welcome back
            </Heading>
            <GoogleButton onClick={handleGoogle} />
            <HStack>
              <Separator flex={1} />
              <Text fontSize="xs" color="fg.muted">
                or
              </Text>
              <Separator flex={1} />
            </HStack>
            <AuthForm mode="login" onSubmit={handleSubmit} error={error} />
            <Stack gap={1} textAlign="center" fontSize="sm">
              <Link
                to="/forgot-password"
                style={{ color: 'var(--chakra-colors-blue-500)', textDecoration: 'none' }}
              >
                Forgot password?
              </Link>
              <Text color="fg.muted">
                No account?{' '}
                <Link
                  to="/signup"
                  style={{ color: 'var(--chakra-colors-blue-500)', textDecoration: 'none' }}
                >
                  Sign up
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Card.Body>
      </Card.Root>
    </Center>
  )
}
