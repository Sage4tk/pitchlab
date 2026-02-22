import type { FormEvent } from 'react'
import { Stack, Field, Input, Button } from '@chakra-ui/react'

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

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <Stack gap={4}>
        <Field.Root>
          <Field.Label>Email</Field.Label>
          <Input id="email" name="email" type="email" required />
        </Field.Root>
        <Field.Root invalid={!!error}>
          <Field.Label>Password</Field.Label>
          <Input id="password" name="password" type="password" required minLength={6} />
          {error && <Field.ErrorText>{error}</Field.ErrorText>}
        </Field.Root>
        <Button type="submit" colorPalette="blue" width="full">
          {mode === 'login' ? 'Log In' : 'Sign Up'}
        </Button>
      </Stack>
    </form>
  )
}
