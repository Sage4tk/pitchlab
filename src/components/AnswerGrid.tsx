import { SimpleGrid, Button, Text } from '@chakra-ui/react'

interface Props {
  options: string[]
  onAnswer: (answer: string) => void
  correct?: string
  selected?: string
  disabled?: boolean
}

type ButtonVariant = 'outline' | 'subtle'

function getButtonProps(
  option: string,
  correct: string | undefined,
  selected: string | undefined,
): { colorPalette: string; variant: ButtonVariant } {
  if (selected !== undefined || correct !== undefined) {
    if (option === correct) return { colorPalette: 'green', variant: 'subtle' }
    if (option === selected && option !== correct) return { colorPalette: 'red', variant: 'subtle' }
    return { colorPalette: 'gray', variant: 'outline' }
  }
  return { colorPalette: 'blue', variant: 'outline' }
}

export function AnswerGrid({ options, onAnswer, correct, selected, disabled }: Props) {
  return (
    <SimpleGrid columns={{ base: 2, sm: 3 }} gap={3} width="full">
      {options.map((option, i) => {
        const btnProps = getButtonProps(option, correct, selected)
        return (
          <Button
            key={option}
            onClick={() => !disabled && onAnswer(option)}
            disabled={disabled}
            colorPalette={btnProps.colorPalette}
            variant={btnProps.variant}
            position="relative"
            size="md"
          >
            {i < 9 && (
              <Text position="absolute" top={1} left={2} fontSize="xs" color="fg.muted">
                {i + 1}
              </Text>
            )}
            {option}
          </Button>
        )
      })}
    </SimpleGrid>
  )
}
