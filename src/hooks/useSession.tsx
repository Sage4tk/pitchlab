import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { getAllRecentAttempts } from '@/db/progress'
import { getXP } from '@/db/xp'
import { useProgressStore } from '@/store/useProgressStore'
import { useXPStore } from '@/store/useXPStore'
import { useSpacedRepStore } from '@/store/useSpacedRepStore'
import { useCourseStore } from '@/store/useCourseStore'

interface Session {
  user: User | null
  loading: boolean
}

const SessionContext = createContext<Session>({ user: null, loading: true })

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const loadAttempts = useProgressStore((s) => s.loadAttempts)
  const loadXP = useXPStore((s) => s.loadXP)
  const resetSpacedRep = useSpacedRepStore((s) => s.reset)
  const resetCourses = useCourseStore((s) => s.resetProgress)

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
        getXP(u.uid)
          .then(loadXP)
          .catch(console.error)
      } else {
        // Clear stores on logout so stale data doesn't leak between accounts.
        loadAttempts([])
        loadXP(0)
        resetSpacedRep()
        resetCourses()
      }
    })
    return unsubscribe
  }, [loadAttempts, loadXP, resetSpacedRep, resetCourses])

  return <SessionContext value={{ user, loading }}>{children}</SessionContext>
}

export function useSession(): Session {
  return useContext(SessionContext)
}
