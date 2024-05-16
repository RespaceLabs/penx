import { Box } from '@fower/react'
import { Button } from 'uikit'
import { Logo } from '@penx/widget'

interface DesktopWelcomeProps {
  isLoading: boolean
  onGetStarted: () => void
}
export function DesktopWelcome({ onGetStarted }: DesktopWelcomeProps) {
  return (
    <Box w-100p h-100p toCenter bgWhite column gap3>
      <Box toCenterY gap2>
        <Box text2XL fontLight gray300>
          Welcome to
        </Box>

        <Logo></Logo>
      </Box>
      <Box text4XL toCenterY gap2>
        <Box fontLight>Your personal</Box>
        <Box fontBold>Database</Box>
      </Box>
      <Button
        variant="outline"
        colorScheme="black"
        size="lg"
        mt5
        onClick={() => onGetStarted()}
      >
        Get Started
      </Button>
    </Box>
  )
}
