export type Category = 'interval' | 'chord' | 'melody' | 'rhythm'

export interface Exercise<TQuestion, TAnswer = string> {
  generate(difficulty: 1 | 2 | 3): TQuestion
  check(question: TQuestion, answer: TAnswer): boolean
  hint?(question: TQuestion): string
  options(question: TQuestion, difficulty: 1 | 2 | 3): TAnswer[]
}

export interface Attempt {
  id?: string
  category: Category
  difficulty: 1 | 2 | 3
  correct: boolean
  answerMs: number
  createdAt: number
}
