import { useExerciseStore } from '@/store/useExerciseStore'
import { setSynthType } from '@/audio/AudioEngine'
import type { Category } from '@/exercises/types'
import {
  Box,
  VStack,
  Heading,
  Text,
  Card,
  Stack,
  HStack,
  Button,
  RadioGroup,
  NativeSelect,
} from '@chakra-ui/react'

const CATEGORIES: { key: Category; label: string }[] = [
  { key: 'interval', label: 'Intervals' },
  { key: 'chord', label: 'Chords' },
  { key: 'melody', label: 'Melody' },
  { key: 'rhythm', label: 'Rhythm' },
]

const SYNTH_OPTIONS: { value: OscillatorType; label: string }[] = [
  { value: 'triangle', label: 'Triangle (warm)' },
  { value: 'sine', label: 'Sine (pure)' },
  { value: 'sawtooth', label: 'Sawtooth (bright)' },
]

export function Settings() {
  const {
    difficulty,
    setDifficulty,
    synthType,
    setSynthType: storeSynth,
    keySignature,
    setKeySignature,
  } = useExerciseStore()

  function handleSynthChange(type: OscillatorType) {
    storeSynth(type)
    setSynthType(type)
  }

  return (
    <Box minH="100vh" bg="bg.subtle" px={4} py={12}>
      <VStack maxW="xl" mx="auto" gap={8} align="stretch">
        <Heading size="xl">Settings</Heading>

        {/* Difficulty */}
        <Card.Root>
          <Card.Body gap={4}>
            <Heading size="md">Default Difficulty</Heading>
            <Text fontSize="sm" color="fg.muted">
              Applied to all exercises. You can also change difficulty per exercise page.
            </Text>
            <Stack gap={3}>
              {CATEGORIES.map(({ key, label }) => (
                <HStack key={key} justify="space-between">
                  <Text fontSize="sm" minW={24}>
                    {label}
                  </Text>
                  <HStack gap={2}>
                    {([1, 2, 3] as const).map((d) => (
                      <Button
                        key={d}
                        size="sm"
                        onClick={() => setDifficulty(d)}
                        colorPalette={difficulty === d ? 'blue' : undefined}
                        variant={difficulty === d ? 'solid' : 'outline'}
                      >
                        {d}
                      </Button>
                    ))}
                  </HStack>
                </HStack>
              ))}
            </Stack>
          </Card.Body>
        </Card.Root>

        {/* Synth */}
        <Card.Root>
          <Card.Body gap={4}>
            <Heading size="md">Sound Type</Heading>
            <RadioGroup.Root
              value={synthType}
              onValueChange={(d) => handleSynthChange(d.value as OscillatorType)}
            >
              <Stack gap={2}>
                {SYNTH_OPTIONS.map(({ value, label }) => (
                  <RadioGroup.Item key={value} value={value}>
                    <RadioGroup.ItemHiddenInput />
                    <RadioGroup.ItemIndicator />
                    <RadioGroup.ItemText fontSize="sm">{label}</RadioGroup.ItemText>
                  </RadioGroup.Item>
                ))}
              </Stack>
            </RadioGroup.Root>
          </Card.Body>
        </Card.Root>

        {/* Key signature */}
        <Card.Root>
          <Card.Body gap={4}>
            <Heading size="md">Key Signature (Melody)</Heading>
            <NativeSelect.Root width="40">
              <NativeSelect.Field
                value={keySignature}
                onChange={(e) => setKeySignature(e.target.value)}
              >
                {['C', 'G', 'D', 'A', 'E', 'F', 'Bb', 'Eb'].map((k) => (
                  <option key={k} value={k}>
                    {k} Major
                  </option>
                ))}
              </NativeSelect.Field>
            </NativeSelect.Root>
          </Card.Body>
        </Card.Root>
      </VStack>
    </Box>
  )
}
