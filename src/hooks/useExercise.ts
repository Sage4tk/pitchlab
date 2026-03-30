import { useState, useCallback, useRef } from 'react'
import { useSession } from './useSession'
import { useProgressStore } from '@/store/useProgressStore'
import { useSpacedRepStore } from '@/store/useSpacedRepStore'
import { useXPStore } from '@/store/useXPStore'
import { useAchievementStore } from '@/store/useAchievementStore'
import { calcXP } from '@/lib/levelSystem'
import { saveAttempt } from '@/db/progress'
import { updateStreak } from '@/db/streaks'
import { addXPToFirestore } from '@/db/xp'
import { saveAchievements } from '@/db/achievements'
import { getNewAchievements, checkPerfectSession } from '@/lib/achievements'
import type { Category } from '@/exercises/types'

export type Phase = 'setup' | 'idle' | 'answering' | 'feedback' | 'results'

interface UseExerciseOptions<TQuestion, TAnswer> {
  category: Category
  generateQuestion: (difficulty: 1 | 2 | 3) => TQuestion
  checkAnswer: (question: TQuestion, answer: TAnswer) => boolean
  getItemLabel?: (question: TQuestion) => string
  replayQuestion?: (q: TQuestion) => void
}

interface SessionStats {
  sessionXP: number
  avgMs: number
  fastestMs: number
  slowestMs: number
}

interface UseExerciseResult<TQuestion, TAnswer> {
  phase: Phase
  question: TQuestion | null
  isCorrect: boolean | null
  xpEarned: number
  difficulty: 1 | 2 | 3
  currentRound: number
  totalRounds: number
  score: number
  wrongQuestions: TQuestion[]
  sessionStats: SessionStats
  startSession: (difficulty: 1 | 2 | 3, rounds: 3 | 5 | 10) => void
  play: () => void
  submit: (answer: TAnswer) => void
  next: () => void
  reset: () => void
  startReview: (questions: TQuestion[]) => void
}

export function useExercise<TQuestion, TAnswer>({
  category,
  generateQuestion,
  checkAnswer,
  getItemLabel,
  replayQuestion,
}: UseExerciseOptions<TQuestion, TAnswer>): UseExerciseResult<TQuestion, TAnswer> {
  const { user } = useSession()
  const addAttempt = useProgressStore((s) => s.addAttempt)

  const [phase, setPhase] = useState<Phase>('setup')
  const [question, setQuestion] = useState<TQuestion | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [xpEarned, setXpEarned] = useState(0)
  const [difficulty, setDifficulty] = useState<1 | 2 | 3>(1)
  const [totalRounds, setTotalRounds] = useState(5)
  const [currentRound, setCurrentRound] = useState(0)
  const [score, setScore] = useState(0)
  const [wrongQuestions, setWrongQuestions] = useState<TQuestion[]>([])
  const [sessionXP, setSessionXP] = useState(0)
  const answerTimesRef = useRef<number[]>([])

  // Refs so callbacks always see current values without stale closure issues
  const startTimeRef = useRef<number>(0)
  const currentRoundRef = useRef(0)
  const totalRoundsRef = useRef(5)
  const difficultyRef = useRef<1 | 2 | 3>(1)
  const getItemLabelRef = useRef(getItemLabel)
  getItemLabelRef.current = getItemLabel
  const replayQuestionRef = useRef(replayQuestion)
  replayQuestionRef.current = replayQuestion

  // Review mode refs
  const reviewQueueRef = useRef<TQuestion[]>([])
  const isReviewModeRef = useRef(false)

  const startSession = useCallback((diff: 1 | 2 | 3, rounds: 3 | 5 | 10) => {
    setDifficulty(diff)
    difficultyRef.current = diff
    setTotalRounds(rounds)
    totalRoundsRef.current = rounds
    setCurrentRound(0)
    currentRoundRef.current = 0
    setScore(0)
    setWrongQuestions([])
    setSessionXP(0)
    answerTimesRef.current = []
    reviewQueueRef.current = []
    isReviewModeRef.current = false
    setQuestion(null)
    setIsCorrect(null)
    setPhase('idle')
  }, [])

  const startReview = useCallback((questions: TQuestion[]) => {
    reviewQueueRef.current = [...questions]
    isReviewModeRef.current = true
    setWrongQuestions([])
    setTotalRounds(questions.length)
    totalRoundsRef.current = questions.length
    setCurrentRound(0)
    currentRoundRef.current = 0
    setScore(0)
    setQuestion(null)
    setIsCorrect(null)
    setPhase('idle')
  }, [])

  const play = useCallback(() => {
    if (isReviewModeRef.current && reviewQueueRef.current.length > 0) {
      const q = reviewQueueRef.current.shift()!
      setQuestion(q)
      setIsCorrect(null)
      currentRoundRef.current += 1
      setCurrentRound(currentRoundRef.current)
      setPhase('answering')
      startTimeRef.current = Date.now()
      replayQuestionRef.current?.(q)
    } else {
      const q = generateQuestion(difficulty)
      setQuestion(q)
      setIsCorrect(null)
      currentRoundRef.current += 1
      setCurrentRound(currentRoundRef.current)
      setPhase('answering')
      startTimeRef.current = Date.now()
    }
  }, [generateQuestion, difficulty])

  const submit = useCallback(
    (answer: TAnswer) => {
      if (!question || phase !== 'answering') return
      const answerMs = Date.now() - startTimeRef.current
      const correct = checkAnswer(question, answer)
      setIsCorrect(correct)
      if (correct) setScore((s) => s + 1)
      if (!correct && !isReviewModeRef.current) {
        setWrongQuestions((prev) => [...prev, question])
      }
      setPhase('feedback')

      answerTimesRef.current.push(answerMs)

      const xp = correct ? calcXP(difficulty, answerMs) : 0
      setXpEarned(xp)
      setSessionXP((prev) => prev + xp)
      if (xp > 0) {
        useXPStore.getState().addXP(xp)
      }

      const attempt = {
        category,
        difficulty,
        correct,
        answerMs,
        createdAt: Date.now(),
      }
      addAttempt(attempt)
      useAchievementStore.getState().recordAttempt(attempt)
      if (getItemLabelRef.current && question) {
        useSpacedRepStore.getState().recordResult(category, getItemLabelRef.current(question), correct)
      }

      if (user) {
        void (async () => {
          if (xp > 0) await addXPToFirestore(user.uid, xp)
          await saveAttempt(user.uid, attempt)
          const streakData = await updateStreak(user.uid)

          const achStore = useAchievementStore.getState()
          const newIds = getNewAchievements(
            achStore.stats,
            useProgressStore.getState().attempts,
            useXPStore.getState().totalXP,
            useXPStore.getState().levelInfo.level,
            streakData.current,
            new Set(Object.keys(achStore.unlocked)),
          )
          if (newIds.length > 0) {
            useAchievementStore.getState().unlockMany(newIds)
            void saveAchievements(user.uid, newIds)
          }
        })()
      }
    },
    [question, phase, checkAnswer, category, difficulty, addAttempt, user],
  )

  const next = useCallback(() => {
    setIsCorrect(null)
    if (currentRoundRef.current >= totalRoundsRef.current) {
      setQuestion(null)
      setPhase('results')
      // Check perfect session achievement
      if (user) {
        setScore((currentScore) => {
          const achStore = useAchievementStore.getState()
          const newIds = checkPerfectSession(
            currentScore,
            totalRoundsRef.current,
            new Set(Object.keys(achStore.unlocked)),
          )
          if (newIds.length > 0) {
            achStore.unlockMany(newIds)
            void saveAchievements(user.uid, newIds)
          }
          return currentScore
        })
      }
    } else if (isReviewModeRef.current && reviewQueueRef.current.length > 0) {
      const q = reviewQueueRef.current.shift()!
      setQuestion(q)
      currentRoundRef.current += 1
      setCurrentRound(currentRoundRef.current)
      setPhase('answering')
      startTimeRef.current = Date.now()
      replayQuestionRef.current?.(q)
    } else {
      // Auto-advance: generate next question immediately, no play button between rounds
      const q = generateQuestion(difficultyRef.current)
      setQuestion(q)
      currentRoundRef.current += 1
      setCurrentRound(currentRoundRef.current)
      setPhase('answering')
      startTimeRef.current = Date.now()
    }
  }, [generateQuestion])

  const reset = useCallback(() => {
    setPhase('setup')
    setQuestion(null)
    setIsCorrect(null)
    setCurrentRound(0)
    currentRoundRef.current = 0
    setScore(0)
    setWrongQuestions([])
    setSessionXP(0)
    answerTimesRef.current = []
    reviewQueueRef.current = []
    isReviewModeRef.current = false
  }, [])

  const times = answerTimesRef.current
  const sessionStats: SessionStats = {
    sessionXP,
    avgMs: times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0,
    fastestMs: times.length > 0 ? Math.min(...times) : 0,
    slowestMs: times.length > 0 ? Math.max(...times) : 0,
  }

  return {
    phase,
    question,
    isCorrect,
    xpEarned,
    difficulty,
    currentRound,
    totalRounds,
    score,
    wrongQuestions,
    sessionStats,
    startSession,
    play,
    submit,
    next,
    reset,
    startReview,
  }
}
