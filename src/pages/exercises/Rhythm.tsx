import { useCallback } from 'react'
import { useExercise } from '@/hooks/useExercise'
import { useExerciseStore } from '@/store/useExerciseStore'
import { RhythmExercise } from '@/exercises/RhythmExercise'
import type { RhythmQuestion } from '@/exercises/RhythmExercise'
import { RhythmPad } from '@/components/RhythmPad'
import { PlayButton } from '@/components/PlayButton'
import { playRhythm } from '@/audio/AudioEngine'
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
  Box,
} from '@chakra-ui/react'

export function Rhythm() {
  const { difficulty, setDifficulty } = useExerciseStore()

  const generate = useCallback(() => RhythmExercise.generate(difficulty), [difficulty])
  const check = useCallback(
    (q: RhythmQuestion, a: boolean[]) => RhythmExercise.check(q, a),
    [],
  )

  const { phase, question, isCorrect, play, submit, next } = useExercise<
    RhythmQuestion,
    boolean[]
  >({
    category: 'rhythm',
    difficulty,
    generateQuestion: generate,
    checkAnswer: check,
  })

  function handleReplay() {
    if (!question) return
    void playRhythm(question.pattern, question.bpm)
  }

  return (
    <Center minH="100vh" bg="#f0f4ff" px={4} py={12}>
      <Card.Root width="full" maxW="lg" boxShadow="0 4px 24px rgba(99,102,241,0.1)" border="1px solid" borderColor="purple.100">
        <Card.Body gap={6}>
          <Flex align="center" justify="space-between">
            <Heading size="xl" fontWeight="800" letterSpacing="-0.02em">
              Rhythm
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

          <Text fontSize="sm" color="fg.muted">
            Listen to the rhythm, then tap along to reproduce it.
          </Text>

          {phase === 'idle' && <PlayButton label="Play Rhythm" onClick={play} />}

          {phase === 'answering' && question && (
            <VStack gap={4} align="stretch">
              <Button variant="outline" size="sm" onClick={handleReplay}>
                ↺ Replay
              </Button>
              <RhythmPad
                subdivisions={question.subdivisions}
                bpm={question.bpm}
                onSubmit={submit}
              />
            </VStack>
          )}

          <AnimatePresence>
            {phase === 'feedback' && question && (
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <VStack gap={4}>
                  <HStack gap={1} flexWrap="wrap" justify="center">
                    {question.pattern.map((hit, i) => (
                      <Box
                        key={i}
                        w={8}
                        h={8}
                        rounded="md"
                        bg={hit ? 'purple.500' : 'gray.200'}
                        boxShadow={hit ? '0 2px 8px rgba(99,102,241,0.4)' : 'none'}
                        style={{ transition: 'background 0.2s' }}
                      />
                    ))}
                  </HStack>
                  <Text
                    fontSize="xl"
                    fontWeight="800"
                    color={isCorrect ? 'green.600' : 'red.500'}
                    letterSpacing="-0.01em"
                  >
                    {isCorrect ? '✓ Correct!' : '✗ Pattern shown above'}
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
