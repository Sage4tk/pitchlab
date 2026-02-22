import { Flex, Text } from '@chakra-ui/react'

interface Props {
  value: number // 0–100
  label: string
  size?: number
}

export function ProgressRing({ value, label, size = 80 }: Props) {
  const radius = (size - 10) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <Flex direction="column" align="center" gap={1}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={8}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#3182ce"
          strokeWidth={8}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize={14}
          fontWeight="bold"
          fill="#2D3748"
        >
          {Math.round(value)}%
        </text>
      </svg>
      {label && (
        <Text fontSize="xs" color="fg.subtle">
          {label}
        </Text>
      )}
    </Flex>
  )
}
