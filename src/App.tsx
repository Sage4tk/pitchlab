import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Center, Spinner } from '@chakra-ui/react'
import { Navbar } from '@/components/Navbar'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Landing } from '@/pages/Landing'
import { preloadPiano } from '@/audio/AudioEngine'

const Login = lazy(() => import('@/pages/Login').then(m => ({ default: m.Login })))
const Signup = lazy(() => import('@/pages/Signup').then(m => ({ default: m.Signup })))
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword').then(m => ({ default: m.ForgotPassword })))
const Dashboard = lazy(() => import('@/pages/Dashboard').then(m => ({ default: m.Dashboard })))
const Interval = lazy(() => import('@/pages/exercises/Interval').then(m => ({ default: m.Interval })))
const Chord = lazy(() => import('@/pages/exercises/Chord').then(m => ({ default: m.Chord })))
const Melody = lazy(() => import('@/pages/exercises/Melody').then(m => ({ default: m.Melody })))
const Rhythm = lazy(() => import('@/pages/exercises/Rhythm').then(m => ({ default: m.Rhythm })))
const ChordProgression = lazy(() => import('@/pages/exercises/ChordProgression').then(m => ({ default: m.ChordProgression })))
const PitchMatch = lazy(() => import('@/pages/exercises/PitchMatch').then(m => ({ default: m.PitchMatch })))
const Progress = lazy(() => import('@/pages/Progress').then(m => ({ default: m.Progress })))
const Settings = lazy(() => import('@/pages/Settings').then(m => ({ default: m.Settings })))
const Courses = lazy(() => import('@/pages/Courses').then(m => ({ default: m.Courses })))
const CourseDetail = lazy(() => import('@/pages/CourseDetail').then(m => ({ default: m.CourseDetail })))
const CourseLesson = lazy(() => import('@/pages/CourseLesson').then(m => ({ default: m.CourseLesson })))

const PageSpinner = () => (
  <Center minH="100vh" bg="var(--bg)" style={{ background: 'var(--bg)' }}>
    <Spinner size="xl" style={{ color: 'var(--accent)' }} />
  </Center>
)

export default function App() {
  useEffect(() => { preloadPiano() }, [])

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
          path="/exercises/progression"
          element={
            <ProtectedRoute>
              <ChordProgression />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exercises/pitch-match"
          element={
            <ProtectedRoute>
              <PitchMatch />
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
        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <Courses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/:courseId"
          element={
            <ProtectedRoute>
              <CourseDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/:courseId/:lessonId"
          element={
            <ProtectedRoute>
              <CourseLesson />
            </ProtectedRoute>
          }
        />
      </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
