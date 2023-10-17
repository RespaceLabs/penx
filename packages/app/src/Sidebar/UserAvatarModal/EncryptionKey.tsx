import { FC, useState } from 'react'
import { Box } from '@fower/react'
import { Eye } from 'lucide-react'
import { Button } from 'uikit'

interface Props {}

export const EncryptionKey: FC<Props> = () => {
  const [blur, setBlur] = useState(true)
  return (
    <Box column gap2>
      <Box textLG fontSemibold>
        End-to-End Encryption key
      </Box>
      <Box gray600 leadingNormal textSM>
        The key to encrypt you data, please remember it, and don't forget it!
      </Box>
      <Box
        bgZinc100
        px4
        py3
        relative
        rounded2XL
        toBetween
        toCenterY
        onClick={() => setBlur(!blur)}
      >
        {blur && (
          <Box
            absolute
            top0
            bottom0
            right0
            left0
            style={{ backdropFilter: 'blur(5px)' }}
          />
        )}
        <Box>sexerwdrerwwdfsrwerdderersserwe</Box>
        <Button
          relative
          isSquare
          size="sm"
          variant="light"
          colorScheme="gray500"
          zIndex-10
          onClick={() => setBlur(!blur)}
        >
          <Eye></Eye>
        </Button>
      </Box>
    </Box>
  )
}
