import { Box, Text } from '@chakra-ui/react'
import { motion } from 'framer-motion'

interface Props {
  label: string
  onClick: () => void
}

export function PlayButton({ label, onClick }: Props) {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={3} py={6}>
      <Box position="relative" display="flex" alignItems="center" justifyContent="center">
        {[0, 1].map((i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: 96,
              height: 96,
              borderRadius: '50%',
              background: 'rgba(99, 102, 241, 0.18)',
              pointerEvents: 'none',
            }}
            animate={{ scale: [1, 1.9 + i * 0.4], opacity: [0.7, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, delay: i * 0.9, ease: 'easeOut' }}
          />
        ))}
        <Box
          as="button"
          w="96px"
          h="96px"
          borderRadius="50%"
          background="linear-gradient(135deg, #6366f1, #4f46e5)"
          color="white"
          fontSize="2xl"
          display="flex"
          alignItems="center"
          justifyContent="center"
          cursor="pointer"
          border="none"
          boxShadow="0 8px 32px rgba(79, 70, 229, 0.45)"
          style={{ transition: 'transform 0.15s ease, box-shadow 0.15s ease' }}
          onClick={onClick}
          _hover={{ transform: 'scale(1.07)', boxShadow: '0 12px 40px rgba(79, 70, 229, 0.55)' } as object}
          _active={{ transform: 'scale(0.96)' } as object}
        >
          ▶
        </Box>
      </Box>
      <Text fontSize="sm" fontWeight="medium" color="fg.muted" letterSpacing="wide">
        {label}
      </Text>
    </Box>
  )
}
