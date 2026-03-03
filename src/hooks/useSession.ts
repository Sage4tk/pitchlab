import { useEffect, useState } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { getAllRecentAttempts } from '@/db/progress'
import { useProgressStore } from '@/store/useProgressStore'

interface Session {
  user: User | null
  loading: boolean
}

export function useSession(): Session {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const loadAttempts = useProgressStore((s) => s.loadAttempts)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
      if (u) {
        // Hydrate the in-memory accuracy store from Firestore so rings
        // are correct after a page refresh or re-login.
        getAllRecentAttempts(u.uid)
          .then(loadAttempts)
          .catch(console.error)
      } else {
        // Clear store on logout so stale data doesn't leak between accounts.
        loadAttempts([])
      }
    })
    return unsubscribe
  }, [loadAttempts])

  return { user, loading }
}
