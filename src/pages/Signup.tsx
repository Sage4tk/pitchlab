import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthForm } from '@/components/AuthForm'
import { GoogleButton } from '@/components/GoogleButton'
import { signUp, signInWithGoogle } from '@/lib/firebaseAuth'
import {
  Center,
  Card,
  Stack,
  Heading,
  HStack,
  Separator,
  Text,
} from '@chakra-ui/react'

export function Signup() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

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
      <Center minH="100vh" bg="bg.subtle" textAlign="center">
        <Stack gap={3} px={4}>
          <Heading size="lg">Check your email</Heading>
          <Text color="fg.muted">
            We sent a verification link to your inbox. Once verified,{' '}
            <Link
              to="/login"
              style={{ color: 'var(--chakra-colors-blue-500)', textDecoration: 'none' }}
            >
              log in
            </Link>
            .
          </Text>
        </Stack>
      </Center>
    )
  }

  return (
    <Center minH="100vh" bg="bg.subtle">
      <Card.Root width="full" maxW="sm" mx={4}>
        <Card.Body>
          <Stack gap={4}>
            <Heading size="lg" textAlign="center">
              Create account
            </Heading>
            <GoogleButton onClick={handleGoogle} label="Sign up with Google" />
            <HStack>
              <Separator flex={1} />
              <Text fontSize="xs" color="fg.muted">
                or
              </Text>
              <Separator flex={1} />
            </HStack>
            <AuthForm mode="signup" onSubmit={handleSubmit} error={error} />
            <Text textAlign="center" fontSize="sm" color="fg.muted">
              Already have an account?{' '}
              <Link
                to="/login"
                style={{ color: 'var(--chakra-colors-blue-500)', textDecoration: 'none' }}
              >
                Log in
              </Link>
            </Text>
          </Stack>
        </Card.Body>
      </Card.Root>
    </Center>
  )
}
