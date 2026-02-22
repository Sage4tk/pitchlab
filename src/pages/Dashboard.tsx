import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSession } from '@/hooks/useSession'
import { useProgressStore } from '@/store/useProgressStore'
import { getStreak } from '@/db/streaks'
import { ProgressRing } from '@/components/ProgressRing'
import type { Category } from '@/exercises/types'
import {
  Box,
  VStack,
  Flex,
  Heading,
  Text,
  HStack,
  SimpleGrid,
  Card,
  Button,
} from '@chakra-ui/react'

const EXERCISES: {
  category: Category
  label: string
  icon: string
  path: string
  gradient: string
}[] = [
  {
    category: 'interval',
    label: 'Intervals',
    icon: '🎵',
    path: '/exercises/interval',
    gradient: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
  },
  {
    category: 'chord',
    label: 'Chords',
    icon: '🎹',
    path: '/exercises/chord',
    gradient: 'linear-gradient(135deg, #ede9fe, #ddd6fe)',
  },
  {
    category: 'melody',
    label: 'Melody',
    icon: '🎼',
    path: '/exercises/melody',
    gradient: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
  },
  {
    category: 'rhythm',
    label: 'Rhythm',
    icon: '🥁',
    path: '/exercises/rhythm',
    gradient: 'linear-gradient(135deg, #fef3c7, #fde68a)',
  },
]

export function Dashboard() {
  const { user } = useSession()
  const getAccuracy = useProgressStore((s) => s.getAccuracy)
  const [streak, setStreak] = useState<{ current: number; longest: number } | null>(null)

  useEffect(() => {
    if (!user) return
    getStreak(user.uid).then(setStreak).catch(console.error)
  }, [user])

  return (
    <Box minH="100vh" bg="#f0f4ff" px={4} py={12}>
      <VStack maxW="3xl" mx="auto" gap={8} align="stretch">
        <Flex align="center" justify="space-between">
          <Heading size="xl" fontWeight="800" letterSpacing="-0.02em">
            Dashboard
          </Heading>
          {streak && (
            <HStack
              background="linear-gradient(135deg, #fff7ed, #ffedd5)"
              borderWidth="1px"
              borderColor="orange.200"
              rounded="xl"
              px={4}
              py={3}
              gap={3}
              boxShadow="0 2px 12px rgba(251,146,60,0.15)"
            >
              <Text fontSize="2xl">🔥</Text>
              <VStack gap={0} align="start">
                <Text fontSize="xl" fontWeight="800" color="orange.700" lineHeight="1">
                  {streak.current}
                </Text>
                <Text fontSize="xs" color="orange.500" fontWeight="500" letterSpacing="wide">
                  DAY STREAK
                </Text>
              </VStack>
            </HStack>
          )}
        </Flex>

        <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4}>
          {EXERCISES.map(({ category, label, icon, path, gradient }) => {
            const accuracy = getAccuracy(category)
            return (
              <Link key={category} to={path} style={{ textDecoration: 'none' }}>
                <Card.Root
                  variant="outline"
                  height="full"
                  _hover={{
                    borderColor: 'purple.300',
                    boxShadow: '0 8px 32px rgba(99,102,241,0.15)',
                    transform: 'translateY(-2px)',
                  }}
                  style={{ transition: 'all 0.2s ease' }}
                >
                  <Card.Body>
                    <Flex align="center" gap={5}>
                      <Box
                        w={14}
                        h={14}
                        rounded="2xl"
                        background={gradient}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontSize="2xl"
                        flexShrink={0}
                        boxShadow="0 2px 8px rgba(0,0,0,0.06)"
                      >
                        {icon}
                      </Box>
                      <Box flex={1}>
                        <Text fontWeight="700" fontSize="md" letterSpacing="-0.01em">
                          {label}
                        </Text>
                        <Text fontSize="sm" color="fg.muted">
                          Tap to practice
                        </Text>
                      </Box>
                      <ProgressRing value={accuracy} label="" size={58} />
                    </Flex>
                  </Card.Body>
                </Card.Root>
              </Link>
            )
          })}
        </SimpleGrid>

        <Card.Root
          variant="outline"
          background="linear-gradient(135deg, #f5f3ff, #ede9fe)"
          borderColor="purple.200"
        >
          <Card.Body gap={3}>
            <Heading size="md" fontWeight="700" letterSpacing="-0.01em">
              Quick Practice
            </Heading>
            <Text fontSize="sm" color="fg.muted">
              Jump into any exercise to keep your skills sharp.
            </Text>
            <Link to="/exercises/interval" style={{ textDecoration: 'none', alignSelf: 'start' }}>
              <Button
                background="linear-gradient(135deg, #6366f1, #4f46e5)"
                color="white"
                fontWeight="700"
                boxShadow="0 4px 16px rgba(79,70,229,0.3)"
                _hover={{ boxShadow: '0 6px 24px rgba(79,70,229,0.45)', transform: 'translateY(-1px)' }}
                style={{ transition: 'all 0.15s ease' }}
              >
                Start Interval Training →
              </Button>
            </Link>
          </Card.Body>
        </Card.Root>
      </VStack>
    </Box>
  )
}
