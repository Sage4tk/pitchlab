import { useRef, useState } from 'react'
import { quantize } from '@/exercises/RhythmExercise'
import { VStack, Button, Text, HStack, Circle } from '@chakra-ui/react'

interface Props {
  subdivisions: number
  bpm: number
  onSubmit: (pattern: boolean[]) => void
  disabled?: boolean
}

export function RhythmPad({ subdivisions, bpm, onSubmit, disabled }: Props) {
  const [taps, setTaps] = useState<number[]>([])
  const [recording, setRecording] = useState(false)
  const startRef = useRef<number>(0)
  const patternDurationMs = (subdivisions * 60000) / bpm

  function handleStart() {
    setTaps([])
    setRecording(true)
    startRef.current = Date.now()

    setTimeout(() => {
      setRecording(false)
    }, patternDurationMs + 500)
  }

  function handleTap() {
    if (!recording) return
    const elapsed = Date.now() - startRef.current
    setTaps((prev) => [...prev, elapsed])
  }

  function handleSubmit() {
    const pattern = quantize(taps, patternDurationMs, subdivisions)
    onSubmit(pattern)
  }

  return (
    <VStack gap={4}>
      {!recording && taps.length === 0 && (
        <Button
          onClick={handleStart}
          disabled={disabled}
          colorPalette="blue"
          size="lg"
        >
          Start Recording
        </Button>
      )}
      {recording && (
        <Circle
          as="button"
          size="40"
          bg="blue.500"
          color="white"
          fontSize="2xl"
          fontWeight="bold"
          _active={{ bg: 'blue.700' }}
          shadow="lg"
          cursor="pointer"
          border="none"
          onClick={handleTap}
        >
          TAP
        </Circle>
      )}
      {!recording && taps.length > 0 && (
        <VStack gap={3}>
          <Text fontSize="sm" color="fg.muted">
            {taps.length} taps recorded
          </Text>
          <HStack gap={3}>
            <Button variant="outline" onClick={handleStart}>
              Retry
            </Button>
            <Button colorPalette="blue" onClick={handleSubmit}>
              Submit
            </Button>
          </HStack>
        </VStack>
      )}
    </VStack>
  )
}
