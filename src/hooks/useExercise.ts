import { useState, useCallback, useRef } from 'react'
import { useSession } from './useSession'
import { useProgressStore } from '@/store/useProgressStore'
import { saveAttempt } from '@/db/progress'
import { updateStreak } from '@/db/streaks'
import type { Category } from '@/exercises/types'

type Phase = 'idle' | 'playing' | 'answering' | 'feedback'

interface UseExerciseOptions<TQuestion, TAnswer> {
  category: Category
  difficulty: 1 | 2 | 3
  generateQuestion: () => TQuestion
  checkAnswer: (question: TQuestion, answer: TAnswer) => boolean
}

interface UseExerciseResult<TQuestion, TAnswer> {
  phase: Phase
  question: TQuestion | null
  isCorrect: boolean | null
  play: () => void
  submit: (answer: TAnswer) => void
  next: () => void
}

export function useExercise<TQuestion, TAnswer>({
  category,
  difficulty,
  generateQuestion,
  checkAnswer,
}: UseExerciseOptions<TQuestion, TAnswer>): UseExerciseResult<TQuestion, TAnswer> {
  const { user } = useSession()
  const addAttempt = useProgressStore((s) => s.addAttempt)

  const [phase, setPhase] = useState<Phase>('idle')
  const [question, setQuestion] = useState<TQuestion | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const startTimeRef = useRef<number>(0)

  const play = useCallback(() => {
    const q = generateQuestion()
    setQuestion(q)
    setIsCorrect(null)
    setPhase('answering')
    startTimeRef.current = Date.now()
  }, [generateQuestion])

  const submit = useCallback(
    (answer: TAnswer) => {
      if (!question || phase !== 'answering') return
      const answerMs = Date.now() - startTimeRef.current
      const correct = checkAnswer(question, answer)
      setIsCorrect(correct)
      setPhase('feedback')

      const attempt = {
        category,
        difficulty,
        correct,
        answerMs,
        createdAt: Date.now(),
      }
      addAttempt(attempt)
      if (user) {
        void saveAttempt(user.uid, attempt)
        void updateStreak(user.uid)
      }
    },
    [question, phase, checkAnswer, category, difficulty, addAttempt, user],
  )

  const next = useCallback(() => {
    setPhase('idle')
    setQuestion(null)
    setIsCorrect(null)
  }, [])

  return { phase, question, isCorrect, play, submit, next }
}
