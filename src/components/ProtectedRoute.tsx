import { Navigate } from 'react-router-dom'
import { useSession } from '@/hooks/useSession'
import { Center, Spinner } from '@chakra-ui/react'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export function ProtectedRoute({ children }: Props) {
  const { user, loading } = useSession()

  if (loading) {
    return (
      <Center minH="100vh" style={{ background: 'var(--bg)' }}>
        <Spinner size="xl" style={{ color: 'var(--accent)' }} />
      </Center>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  return <>{children}</>
}
