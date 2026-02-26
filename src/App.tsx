import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Center, Spinner } from '@chakra-ui/react'
import { Navbar } from '@/components/Navbar'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Landing } from '@/pages/Landing'

const Login = lazy(() => import('@/pages/Login').then(m => ({ default: m.Login })))
const Signup = lazy(() => import('@/pages/Signup').then(m => ({ default: m.Signup })))
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword').then(m => ({ default: m.ForgotPassword })))
const Dashboard = lazy(() => import('@/pages/Dashboard').then(m => ({ default: m.Dashboard })))
const Interval = lazy(() => import('@/pages/exercises/Interval').then(m => ({ default: m.Interval })))
const Chord = lazy(() => import('@/pages/exercises/Chord').then(m => ({ default: m.Chord })))
const Melody = lazy(() => import('@/pages/exercises/Melody').then(m => ({ default: m.Melody })))
const Rhythm = lazy(() => import('@/pages/exercises/Rhythm').then(m => ({ default: m.Rhythm })))
const Progress = lazy(() => import('@/pages/Progress').then(m => ({ default: m.Progress })))
const Settings = lazy(() => import('@/pages/Settings').then(m => ({ default: m.Settings })))

const PageSpinner = () => (
  <Center minH="100vh" bg="var(--bg)" style={{ background: 'var(--bg)' }}>
    <Spinner size="xl" style={{ color: 'var(--accent)' }} />
  </Center>
)

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Suspense fallback={<PageSpinner />}>
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
      </Suspense>
    </BrowserRouter>
  )
}
