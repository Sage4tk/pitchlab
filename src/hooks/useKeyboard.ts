import { useEffect } from 'react'

export function useKeyboardAnswer(
  options: string[],
  onAnswer: (answer: string) => void,
  enabled = true,
): void {
  useEffect(() => {
    if (!enabled) return

    function handleKeyDown(e: KeyboardEvent) {
      const idx = parseInt(e.key, 10) - 1
      if (idx >= 0 && idx < options.length) {
        onAnswer(options[idx])
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [options, onAnswer, enabled])
}
