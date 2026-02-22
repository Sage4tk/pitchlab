import { useEffect, useState } from 'react'
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { useSession } from '@/hooks/useSession'
import { useProgressStore } from '@/store/useProgressStore'
import { getStreak } from '@/db/streaks'
import { getRecentAttempts } from '@/db/progress'
import type { Category } from '@/exercises/types'
import {
  Box,
  VStack,
  Heading,
  Text,
  Card,
  HStack,
  Separator,
  Flex,
  NativeSelect,
} from '@chakra-ui/react'

const CATEGORIES: Category[] = ['interval', 'chord', 'melody', 'rhythm']

interface LinePoint {
  date: string
  accuracy: number
}

export function Progress() {
  const { user } = useSession()
  const getAccuracy = useProgressStore((s) => s.getAccuracy)
  const [streak, setStreak] = useState<{ current: number; longest: number } | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<Category>('interval')
  const [lineData, setLineData] = useState<LinePoint[]>([])

  const radarData = CATEGORIES.map((c) => ({
    category: c.charAt(0).toUpperCase() + c.slice(1),
    accuracy: getAccuracy(c),
  }))

  useEffect(() => {
    if (!user) return
    getStreak(user.uid).then(setStreak).catch(console.error)
  }, [user])

  useEffect(() => {
    if (!user) return
    getRecentAttempts(user.uid, selectedCategory, 20)
      .then((attempts) => {
        const points: LinePoint[] = attempts.reverse().map((a) => ({
          date: new Date(a.createdAt).toLocaleDateString(),
          accuracy: a.correct ? 100 : 0,
        }))
        setLineData(points)
      })
      .catch(console.error)
  }, [user, selectedCategory])

  return (
    <Box minH="100vh" bg="bg.subtle" px={4} py={12}>
      <VStack maxW="3xl" mx="auto" gap={8} align="stretch">
        <Heading size="xl">Progress</Heading>

        {streak && (
          <Card.Root>
            <Card.Body>
              <HStack gap={6} justify="center">
                <VStack align="center" gap={0}>
                  <Text fontSize="3xl" fontWeight="bold" color="orange.600">
                    {streak.current}
                  </Text>
                  <Text fontSize="sm" color="fg.muted">
                    Current streak
                  </Text>
                </VStack>
                <Separator orientation="vertical" height="60px" />
                <VStack align="center" gap={0}>
                  <Text fontSize="3xl" fontWeight="bold" color="blue.600">
                    {streak.longest}
                  </Text>
                  <Text fontSize="sm" color="fg.muted">
                    Longest streak
                  </Text>
                </VStack>
              </HStack>
            </Card.Body>
          </Card.Root>
        )}

        <Card.Root>
          <Card.Body gap={4}>
            <Heading size="md">Accuracy by Category</Heading>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" />
                <Radar
                  name="Accuracy"
                  dataKey="accuracy"
                  stroke="#3182ce"
                  fill="#3182ce"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </Card.Body>
        </Card.Root>

        <Card.Root>
          <Card.Body gap={4}>
            <Flex align="center" justify="space-between">
              <Heading size="md">Accuracy Over Time</Heading>
              <NativeSelect.Root width="auto">
                <NativeSelect.Field
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as Category)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </NativeSelect.Field>
              </NativeSelect.Root>
            </Flex>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#3182ce"
                  dot={false}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card.Body>
        </Card.Root>
      </VStack>
    </Box>
  )
}
