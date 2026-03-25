import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { SessionProvider } from '@/hooks/useSession'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider value={defaultSystem}>
      <SessionProvider>
        <App />
      </SessionProvider>
    </ChakraProvider>
  </StrictMode>,
)
