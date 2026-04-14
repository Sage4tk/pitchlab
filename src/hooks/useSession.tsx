import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { getAllRecentAttempts } from '@/db/progress'
import { getXP } from '@/db/xp'
import { getAchievements } from '@/db/achievements'
import { useProgressStore } from '@/store/useProgressStore'
import { useXPStore } from '@/store/useXPStore'
import { useSpacedRepStore } from '@/store/useSpacedRepStore'
import { useCourseStore } from '@/store/useCourseStore'
import { useAchievementStore } from '@/store/useAchievementStore'

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
  const loadCourseProgress = useCourseStore((s) => s.loadProgress)
  const resetCourses = useCourseStore((s) => s.resetProgress)
  const loadAchievements = useAchievementStore((s) => s.load)
  const resetAchievements = useAchievementStore((s) => s.reset)

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
        getAchievements(u.uid)
          .then(loadAchievements)
          .catch(console.error)
        loadCourseProgress(u.uid)
          .catch(console.error)
      } else {
        // Clear stores on logout so stale data doesn't leak between accounts.
        loadAttempts([])
        loadXP(0)
        resetSpacedRep()
        resetCourses()
        resetAchievements()
      }
    })
    return unsubscribe
  }, [loadAttempts, loadXP, resetSpacedRep, resetCourses, loadCourseProgress, loadAchievements, resetAchievements])

  return <SessionContext value={{ user, loading }}>{children}</SessionContext>
}

export function useSession(): Session {
  return useContext(SessionContext)
}
