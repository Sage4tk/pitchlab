import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Box,
  Flex,
  Text,
  Heading,
  Stack,
  HStack,
  SimpleGrid,
  Button,
} from '@chakra-ui/react'

const features = [
  {
    icon: '🎵',
    name: 'Intervals',
    description: 'Identify the distance between two notes by ear.',
    accent: '#2563eb',
    iconBg: 'linear-gradient(135deg, #dbeafe, #93c5fd)',
    cardBg: 'linear-gradient(170deg, #eff6ff 0%, #ffffff 55%)',
    glow: 'rgba(37,99,235,0.18)',
    borderAccent: '#93c5fd',
  },
  {
    icon: '🎹',
    name: 'Chords',
    description: 'Distinguish major, minor, diminished, and extended harmonies.',
    accent: '#7c3aed',
    iconBg: 'linear-gradient(135deg, #ede9fe, #c4b5fd)',
    cardBg: 'linear-gradient(170deg, #f5f3ff 0%, #ffffff 55%)',
    glow: 'rgba(124,58,237,0.18)',
    borderAccent: '#c4b5fd',
  },
  {
    icon: '🎼',
    name: 'Melody',
    description: 'Transcribe short melodic phrases by clicking a piano keyboard.',
    accent: '#059669',
    iconBg: 'linear-gradient(135deg, #d1fae5, #6ee7b7)',
    cardBg: 'linear-gradient(170deg, #ecfdf5 0%, #ffffff 55%)',
    glow: 'rgba(5,150,105,0.15)',
    borderAccent: '#6ee7b7',
  },
  {
    icon: '🥁',
    name: 'Rhythm',
    description: 'Tap along to rhythmic patterns and build your internal pulse.',
    accent: '#d97706',
    iconBg: 'linear-gradient(135deg, #fef3c7, #fcd34d)',
    cardBg: 'linear-gradient(170deg, #fffbeb 0%, #ffffff 55%)',
    glow: 'rgba(217,119,6,0.15)',
    borderAccent: '#fcd34d',
  },
]

const steps = [
  {
    number: '01',
    icon: '👤',
    title: 'Sign up',
    description: 'Create a free account in seconds. No credit card, no catch.',
    accent: '#6366f1',
    bg: 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
  },
  {
    number: '02',
    icon: '🎯',
    title: 'Choose an exercise',
    description: 'Pick from intervals, chords, melody, or rhythm at any difficulty.',
    accent: '#7c3aed',
    bg: 'linear-gradient(135deg, #f5f3ff, #ede9fe)',
  },
  {
    number: '03',
    icon: '📈',
    title: 'Track your progress',
    description: 'See accuracy trends, maintain your daily streak, and level up.',
    accent: '#2563eb',
    bg: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

export function Landing() {
  return (
    <Box minH="100vh" bg="#f0f4ff">
      {/* Hero — dark full-bleed */}
      <Box
        background="linear-gradient(160deg, #0f0c29 0%, #1e1b4b 45%, #312e81 100%)"
        position="relative"
        overflow="hidden"
      >
        {/* Subtle noise/grid texture overlay */}
        <Box
          position="absolute"
          inset={0}
          opacity={0.04}
          backgroundImage="radial-gradient(circle, white 1px, transparent 1px)"
          backgroundSize="32px 32px"
          pointerEvents="none"
        />
        {/* Glow orbs */}
        <Box
          position="absolute"
          top="-100px"
          left="50%"
          transform="translateX(-50%)"
          w="600px"
          h="400px"
          background="radial-gradient(ellipse, rgba(99,102,241,0.25) 0%, transparent 70%)"
          pointerEvents="none"
        />

        {/* Nav */}
        <Flex align="center" justify="space-between" px={6} py={5} position="relative">
          <Text fontWeight="800" fontSize="xl" color="white" letterSpacing="-0.02em">
            Pitchlab
          </Text>
          <HStack gap={4}>
            <Link to="/login" style={{ textDecoration: 'none', color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem', fontWeight: 500 }}>
              Log In
            </Link>
            <Link to="/signup" style={{ textDecoration: 'none' }}>
              <Button
                size="sm"
                bg="white"
                color="#1e1b4b"
                fontWeight="700"
                _hover={{ bg: '#f0f4ff' }}
                boxShadow="0 2px 8px rgba(0,0,0,0.2)"
              >
                Get Started
              </Button>
            </Link>
          </HStack>
        </Flex>

        {/* Hero content */}
        <Box px={6} pt={16} pb={24} textAlign="center" position="relative">
          <Stack align="center" gap={6}>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.6 }}
            >
              <Heading
                fontSize={{ base: '3xl', md: '5xl', lg: '6xl' }}
                fontWeight="900"
                color="white"
                letterSpacing="-0.03em"
                lineHeight="1.1"
                maxW="720px"
              >
                Train your ear.{' '}
                <Box
                  as="span"
                  style={{
                    background: 'linear-gradient(90deg, #e0e7ff, #c4b5fd)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  One note at a time.
                </Box>
              </Heading>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.6, delay: 0.12 }}
            >
              <Text fontSize="lg" color="rgba(255,255,255,0.85)" maxW="480px" lineHeight="1.7">
                Fast, focused ear training. Build the musical skills that matter most — for free.
              </Text>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.6, delay: 0.24 }}
            >
              <HStack gap={3}>
                <Link to="/signup" style={{ textDecoration: 'none' }}>
                  <Button
                    size="lg"
                    background="linear-gradient(135deg, #6366f1, #4f46e5)"
                    color="white"
                    fontWeight="700"
                    boxShadow="0 4px 24px rgba(79,70,229,0.5)"
                    _hover={{ boxShadow: '0 6px 32px rgba(79,70,229,0.65)', transform: 'translateY(-1px)' }}
                    style={{ transition: 'all 0.15s ease' }}
                    px={8}
                  >
                    Start for free
                  </Button>
                </Link>
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <Button
                    size="lg"
                    variant="outline"
                    color="white"
                    borderColor="rgba(255,255,255,0.55)"
                    _hover={{ bg: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.85)' }}
                    px={8}
                  >
                    Log In
                  </Button>
                </Link>
              </HStack>
            </motion.div>

            {/* Social proof strip */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.6, delay: 0.36 }}
            >
              <Text fontSize="xs" color="rgba(255,255,255,0.55)" letterSpacing="wider">
                FREE · NO ADS · JUST TRAINING
              </Text>
            </motion.div>
          </Stack>
        </Box>
      </Box>

      {/* Features */}
      <Box px={6} py={24} maxW="5xl" mx="auto">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <Heading size="2xl" textAlign="center" mb={3} fontWeight="800" letterSpacing="-0.02em">
            Four disciplines. One app.
          </Heading>
          <Text textAlign="center" color="#64748b" mb={14} fontSize="md">
            Exercises built to build real musical instinct.
          </Text>
        </motion.div>
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={6}>
          {features.map((f, i) => (
            <motion.div
              key={f.name}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              style={{ height: '100%' }}
            >
              <Box
                height="full"
                borderRadius="20px"
                border="1.5px solid"
                borderColor={f.borderAccent}
                background={f.cardBg}
                borderTopWidth="4px"
                borderTopColor={f.accent}
                boxShadow="0 2px 12px rgba(0,0,0,0.05)"
                _hover={{
                  boxShadow: `0 16px 48px ${f.glow}`,
                  transform: 'translateY(-5px)',
                  borderColor: f.accent,
                }}
                style={{ transition: 'all 0.25s ease' }}
                p={6}
                display="flex"
                flexDirection="column"
                gap={4}
              >
                {/* Icon bubble */}
                <Box
                  w={14}
                  h={14}
                  borderRadius="16px"
                  background={f.iconBg}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="2xl"
                  boxShadow={`0 4px 16px ${f.glow}`}
                  flexShrink={0}
                >
                  {f.icon}
                </Box>

                {/* Text */}
                <Box flex={1}>
                  <Text
                    fontWeight="800"
                    fontSize="md"
                    letterSpacing="-0.01em"
                    color={f.accent}
                    mb={1}
                  >
                    {f.name}
                  </Text>
                  <Text fontSize="sm" color="#64748b" lineHeight="1.7">
                    {f.description}
                  </Text>
                </Box>

                {/* Footer hint */}
                <Text fontSize="xs" fontWeight="600" color={f.accent} opacity={0.7} letterSpacing="0.05em">
                  PRACTICE NOW →
                </Text>
              </Box>
            </motion.div>
          ))}
        </SimpleGrid>
      </Box>

      {/* How it works */}
      <Box px={6} py={24} background="linear-gradient(180deg, #f0f4ff 0%, #e8eeff 100%)">
        <Box maxW="4xl" mx="auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <Heading size="2xl" textAlign="center" mb={3} fontWeight="800" letterSpacing="-0.02em">
              How it works
            </Heading>
            <Text textAlign="center" color="#64748b" mb={14} fontSize="md">
              From zero to training in under a minute.
            </Text>
          </motion.div>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
            {steps.map((s, i) => (
              <motion.div
                key={s.number}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.12 }}
              >
                <Box
                  borderRadius="20px"
                  border="1.5px solid"
                  borderColor="rgba(99,102,241,0.2)"
                  background="white"
                  boxShadow="0 2px 16px rgba(99,102,241,0.07)"
                  _hover={{ boxShadow: '0 8px 32px rgba(99,102,241,0.14)', transform: 'translateY(-3px)' }}
                  style={{ transition: 'all 0.22s ease' }}
                  p={6}
                  display="flex"
                  flexDirection="column"
                  gap={4}
                >
                  {/* Step number + icon row */}
                  <Flex align="center" justify="space-between">
                    <Box
                      w={10}
                      h={10}
                      borderRadius="12px"
                      background={s.bg}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontSize="lg"
                    >
                      {s.icon}
                    </Box>
                    <Text
                      fontSize="3xl"
                      fontWeight="900"
                      color="rgba(99,102,241,0.12)"
                      letterSpacing="-0.04em"
                      lineHeight="1"
                    >
                      {s.number}
                    </Text>
                  </Flex>

                  {/* Text */}
                  <Box>
                    <Text fontWeight="800" fontSize="md" letterSpacing="-0.01em" mb={1.5} color={s.accent}>
                      {s.title}
                    </Text>
                    <Text fontSize="sm" color="#64748b" lineHeight="1.7">
                      {s.description}
                    </Text>
                  </Box>
                </Box>
              </motion.div>
            ))}
          </SimpleGrid>
        </Box>
      </Box>

      {/* Footer CTA */}
      <Box
        px={6}
        py={20}
        textAlign="center"
        background="linear-gradient(160deg, #0f0c29 0%, #1e1b4b 100%)"
      >
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <Heading size="2xl" mb={3} fontWeight="800" color="white" letterSpacing="-0.02em">
            Ready to sharpen your ears?
          </Heading>
          <Text color="rgba(255,255,255,0.8)" mb={8} fontSize="lg">
            Join thousands building better musical instincts.
          </Text>
          <Link to="/signup" style={{ textDecoration: 'none' }}>
            <Button
              size="lg"
              background="linear-gradient(135deg, #6366f1, #4f46e5)"
              color="white"
              fontWeight="700"
              px={10}
              boxShadow="0 4px 24px rgba(79,70,229,0.5)"
              _hover={{ boxShadow: '0 6px 32px rgba(79,70,229,0.65)', transform: 'translateY(-1px)' }}
              style={{ transition: 'all 0.15s ease' }}
            >
              Start for free
            </Button>
          </Link>
        </motion.div>
      </Box>
    </Box>
  )
}
