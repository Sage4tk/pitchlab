import { useCallback, useState } from 'react'
import { useExercise } from '@/hooks/useExercise'
import { useExerciseStore } from '@/store/useExerciseStore'
import { MelodyExercise } from '@/exercises/MelodyExercise'
import type { MelodyQuestion } from '@/exercises/MelodyExercise'
import { PianoKeyboard } from '@/components/PianoKeyboard'
import { PlayButton } from '@/components/PlayButton'
import { playMelody, playNote } from '@/audio/AudioEngine'
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
  Badge,
  Box,
} from '@chakra-ui/react'

export function Melody() {
  const { difficulty, setDifficulty } = useExerciseStore()
  const [inputNotes, setInputNotes] = useState<string[]>([])

  const generate = useCallback(() => MelodyExercise.generate(difficulty), [difficulty])
  const check = useCallback((q: MelodyQuestion, a: string[]) => MelodyExercise.check(q, a), [])

  const { phase, question, isCorrect, play, submit, next } = useExercise<
    MelodyQuestion,
    string[]
  >({
    category: 'melody',
    difficulty,
    generateQuestion: generate,
    checkAnswer: check,
  })

  function handleKeyPress(note: string) {
    if (phase !== 'answering') return
    void playNote(note, '8n')
    setInputNotes((prev) => [...prev, note])
  }

  function handleUndo() {
    setInputNotes((prev) => prev.slice(0, -1))
  }

  function handleSubmit() {
    if (!question) return
    submit(inputNotes)
  }

  function handleNext() {
    setInputNotes([])
    next()
  }

  function handleReplay() {
    if (!question) return
    void playMelody(question.notes)
  }

  return (
    <Center minH="100vh" bg="#f0f4ff" px={4} py={12}>
      <Card.Root width="full" maxW="2xl" boxShadow="0 4px 24px rgba(99,102,241,0.1)" border="1px solid" borderColor="purple.100">
        <Card.Body gap={6}>
          <Flex align="center" justify="space-between">
            <Heading size="xl" fontWeight="800" letterSpacing="-0.02em">
              Melody
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

          {phase === 'idle' && <PlayButton label="Play Melody" onClick={play} />}

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

                  <Box
                    display="flex"
                    flexWrap="wrap"
                    gap={2}
                    minH={10}
                    p={3}
                    bg="gray.50"
                    rounded="lg"
                    border="1px solid"
                    borderColor="gray.200"
                  >
                    {inputNotes.map((n, i) => (
                      <Badge
                        key={i}
                        colorPalette="purple"
                        variant="subtle"
                        px={2}
                        py={1}
                        rounded="md"
                        fontWeight="600"
                      >
                        {n}
                      </Badge>
                    ))}
                    {phase === 'answering' && inputNotes.length === 0 && (
                      <Text fontSize="sm" color="fg.muted" alignSelf="center">
                        Click the piano keys below...
                      </Text>
                    )}
                  </Box>

                  <Box overflowX="auto" rounded="lg" border="1px solid" borderColor="gray.200" p={2}>
                    <PianoKeyboard
                      onKeyPress={handleKeyPress}
                      highlightNotes={phase === 'feedback' ? question?.notes : []}
                      disabled={phase === 'feedback'}
                    />
                  </Box>

                  {phase === 'answering' && (
                    <HStack gap={3}>
                      <Button
                        variant="outline"
                        onClick={handleUndo}
                        disabled={inputNotes.length === 0}
                      >
                        ← Undo
                      </Button>
                      <Button
                        flex={1}
                        background="linear-gradient(135deg, #6366f1, #4f46e5)"
                        color="white"
                        fontWeight="700"
                        onClick={handleSubmit}
                        disabled={inputNotes.length === 0}
                        boxShadow="0 4px 16px rgba(79,70,229,0.3)"
                      >
                        Submit ({inputNotes.length} notes)
                      </Button>
                    </HStack>
                  )}
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
                    {isCorrect ? '✓ Correct!' : `✗ Correct: ${question?.notes.join(', ')}`}
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
                    onClick={handleNext}
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
