import { useCallback } from 'react'
import { useExercise } from '@/hooks/useExercise'
import { useKeyboardAnswer } from '@/hooks/useKeyboard'
import { useExerciseStore } from '@/store/useExerciseStore'
import { IntervalExercise } from '@/exercises/IntervalExercise'
import type { IntervalQuestion } from '@/exercises/IntervalExercise'
import { AnswerGrid } from '@/components/AnswerGrid'
import { PlayButton } from '@/components/PlayButton'
import { playInterval } from '@/audio/AudioEngine'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Center,
  Card,
  VStack,
  Flex,
  Heading,
  HStack,
  Button,
  Text,
} from '@chakra-ui/react'

export function Interval() {
  const { difficulty, setDifficulty } = useExerciseStore()

  const generate = useCallback(() => IntervalExercise.generate(difficulty), [difficulty])
  const check = useCallback((q: IntervalQuestion, a: string) => IntervalExercise.check(q, a), [])

  const { phase, question, isCorrect, play, submit, next } = useExercise<IntervalQuestion, string>(
    {
      category: 'interval',
      difficulty,
      generateQuestion: generate,
      checkAnswer: check,
    },
  )

  const options = question
    ? IntervalExercise.options(question, difficulty)
    : IntervalExercise.options(
        { root: 'C4', target: 'G4', semitones: 7, label: 'P5', ascending: true },
        difficulty,
      )

  useKeyboardAnswer(options, submit, phase === 'answering')

  function handleReplay() {
    if (!question) return
    void playInterval(question.root, question.target)
  }

  return (
    <Center minH="100vh" bg="#f0f4ff" px={4} py={12}>
      <Card.Root width="full" maxW="lg" boxShadow="0 4px 24px rgba(99,102,241,0.1)" border="1px solid" borderColor="purple.100">
        <Card.Body gap={6}>
          <Flex align="center" justify="space-between">
            <Heading size="xl" fontWeight="800" letterSpacing="-0.02em">
              Intervals
            </Heading>
            <HStack gap={2}>
              {([1, 2, 3] as const).map((d) => (
                <Button
                  key={d}
                  size="sm"
                  onClick={() => setDifficulty(d)}
                  colorPalette={difficulty === d ? 'purple' : undefined}
                  variant={difficulty === d ? 'solid' : 'outline'}
                  fontWeight={difficulty === d ? '700' : '500'}
                >
                  {d}
                </Button>
              ))}
            </HStack>
          </Flex>

          {phase === 'idle' && <PlayButton label="Play Interval" onClick={play} />}

          <AnimatePresence>
            {(phase === 'answering' || phase === 'feedback') && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <VStack gap={4} align="stretch">
                  <Button variant="outline" size="sm" onClick={handleReplay}>
                    ↺ Replay
                  </Button>
                  <AnswerGrid
                    options={options}
                    onAnswer={submit}
                    correct={phase === 'feedback' ? question?.label : undefined}
                    disabled={phase === 'feedback'}
                  />
                </VStack>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {phase === 'feedback' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <VStack gap={4}>
                  <Text
                    fontSize="xl"
                    fontWeight="800"
                    color={isCorrect ? 'green.600' : 'red.500'}
                    letterSpacing="-0.01em"
                  >
                    {isCorrect ? '✓ Correct!' : `✗ It was ${question?.label}`}
                  </Text>
                  <Button
                    size="lg"
                    width="full"
                    background="linear-gradient(135deg, #6366f1, #4f46e5)"
                    color="white"
                    fontWeight="700"
                    boxShadow="0 4px 16px rgba(79,70,229,0.35)"
                    _hover={{ boxShadow: '0 6px 24px rgba(79,70,229,0.5)', transform: 'translateY(-1px)' }}
                    style={{ transition: 'all 0.15s ease' }}
                    onClick={next}
                  >
                    Next →
                  </Button>
                </VStack>
              </motion.div>
            )}
          </AnimatePresence>
        </Card.Body>
      </Card.Root>
    </Center>
  )
}
