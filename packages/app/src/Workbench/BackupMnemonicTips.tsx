import { Box } from '@fower/react'
import { AlertCircle } from 'lucide-react'
import { Button } from 'uikit'

export const BackupMnemonicTips = () => {
  return (
    <Box
      roundedXL
      fixed
      right3
      bottom3
      black
      zIndex-1000
      shadow2XL
      toCenterY
      gap2
      px3
      py3
      border
      borderYellow500
    >
      <Box yellow500 inlineFlex>
        <AlertCircle size={20} />
      </Box>
      <Box gray600 leadingNone textSM>
        Back up your{' '}
        <Box as="span" fontBold black>
          Recovery Phrase
        </Box>{' '}
        to keep data secure.
      </Box>
      <Button
        colorScheme="red500"
        ml4
        onClick={() => window.open('/recovery-phrase')}
      >
        Back up now
      </Button>
    </Box>
  )
}
