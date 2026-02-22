import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Landing } from '@/pages/Landing'
import { Login } from '@/pages/Login'
import { Signup } from '@/pages/Signup'
import { ForgotPassword } from '@/pages/ForgotPassword'
import { Dashboard } from '@/pages/Dashboard'
import { Interval } from '@/pages/exercises/Interval'
import { Chord } from '@/pages/exercises/Chord'
import { Melody } from '@/pages/exercises/Melody'
import { Rhythm } from '@/pages/exercises/Rhythm'
import { Progress } from '@/pages/Progress'
import { Settings } from '@/pages/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exercises/interval"
          element={
            <ProtectedRoute>
              <Interval />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exercises/chord"
          element={
            <ProtectedRoute>
              <Chord />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exercises/melody"
          element={
            <ProtectedRoute>
              <Melody />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exercises/rhythm"
          element={
            <ProtectedRoute>
              <Rhythm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <Progress />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
