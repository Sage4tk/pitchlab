import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { resetPassword } from '@/lib/firebaseAuth'
import {
  Center,
  Card,
  Stack,
  Heading,
  Text,
  Field,
  Input,
  Button,
} from '@chakra-ui/react'

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
      <Center minH="100vh" bg="bg.subtle" textAlign="center">
        <Stack gap={3} px={4}>
          <Heading size="lg">Email sent</Heading>
          <Text color="fg.muted">Check your inbox for a password reset link.</Text>
          <Link
            to="/login"
            style={{ color: 'var(--chakra-colors-blue-500)', textDecoration: 'none', fontSize: '0.875rem' }}
          >
            Back to login
          </Link>
        </Stack>
      </Center>
    )
  }

  return (
    <Center minH="100vh" bg="bg.subtle">
      <Card.Root width="full" maxW="sm" mx={4}>
        <Card.Body>
          <form onSubmit={handleSubmit}>
            <Stack gap={4}>
              <Stack gap={1} textAlign="center">
                <Heading size="lg">Reset password</Heading>
                <Text fontSize="sm" color="fg.muted">
                  Enter your email and we'll send a reset link.
                </Text>
              </Stack>
              <Field.Root invalid={!!error}>
                <Field.Label>Email</Field.Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {error && <Field.ErrorText>{error}</Field.ErrorText>}
              </Field.Root>
              <Button type="submit" colorPalette="blue" width="full">
                Send reset link
              </Button>
              <Text textAlign="center" fontSize="sm">
                <Link
                  to="/login"
                  style={{ color: 'var(--chakra-colors-blue-500)', textDecoration: 'none' }}
                >
                  Back to login
                </Link>
              </Text>
            </Stack>
          </form>
        </Card.Body>
      </Card.Root>
    </Center>
  )
}
