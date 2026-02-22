import { Link, useLocation } from 'react-router-dom'
import { logOut } from '@/lib/firebaseAuth'
import { useSession } from '@/hooks/useSession'
import { Box, Flex, HStack, Text, Button } from '@chakra-ui/react'

const PUBLIC_PATHS = ['/', '/login', '/signup', '/forgot-password']

export function Navbar() {
  const { user } = useSession()
  const { pathname } = useLocation()

  if (PUBLIC_PATHS.includes(pathname) || !user) return null

  return (
    <Box
      as="nav"
      borderBottomWidth="1px"
      borderColor="purple.100"
      bg="white"
      px={6}
      py={3}
      boxShadow="0 1px 8px rgba(99,102,241,0.06)"
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Flex align="center" justify="space-between" maxW="5xl" mx="auto">
        <Text fontWeight="900" fontSize="lg" letterSpacing="-0.03em">
          <Link to="/dashboard" style={{ color: '#4f46e5', textDecoration: 'none' }}>
            Pitchlab
          </Link>
        </Text>
        <HStack gap={1} fontSize="sm" fontWeight="500">
          {[
            { to: '/dashboard', label: 'Dashboard' },
            { to: '/progress', label: 'Progress' },
            { to: '/settings', label: 'Settings' },
          ].map(({ to, label }) => (
            <Link key={to} to={to} style={{ textDecoration: 'none' }}>
              <Box
                px={3}
                py={1.5}
                rounded="lg"
                color={pathname === to ? 'purple.700' : 'fg.muted'}
                bg={pathname === to ? 'purple.50' : 'transparent'}
                fontWeight={pathname === to ? '600' : '500'}
                _hover={{ bg: 'purple.50', color: 'purple.700' }}
                style={{ transition: 'all 0.15s ease' }}
              >
                {label}
              </Box>
            </Link>
          ))}
        </HStack>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => logOut()}
          color="fg.muted"
          fontWeight="500"
          _hover={{ color: 'red.500', bg: 'red.50' }}
          style={{ transition: 'all 0.15s ease' }}
        >
          Log out
        </Button>
      </Flex>
    </Box>
  )
}
