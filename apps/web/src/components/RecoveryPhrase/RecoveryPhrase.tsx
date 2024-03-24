import { FC, useState } from 'react'
import { Box } from '@fower/react'
import { useQuery } from '@tanstack/react-query'
import { Check, Copy, Eye, PencilLine } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { Button, Input, toast } from 'uikit'
import { getMnemonicFromLocal, getNewMnemonic } from '@penx/mnemonic'
import { useCopyToClipboard } from '@penx/shared'
import { PasswordOnChain } from './PasswordOnChain'

interface Props {}

export const RecoveryPhrase: FC<Props> = () => {
  const [blur, setBlur] = useState(true)
  const { data } = useSession()
  const { copy } = useCopyToClipboard()

  const { isLoading, data: mnemonic } = useQuery(
    ['Mnemonic', data?.secret],
    () => getMnemonicFromLocal(data?.secret!),
  )

  if (isLoading || !mnemonic) return null

  const words = mnemonic.split(' ')

  return (
    <Box column maxW-640 gap2>
      <Box mb4>
        <Box text4XL fontBold textCenter>
          Recovery Phrase
        </Box>
      </Box>

      <Box bgZinc100 p5 relative rounded2XL toBetween toCenterY gap2>
        <Box toCenterY gapY4 flexWrap toBetween>
          {words.map((word, index) => (
            <Box key={word} w-120 gap1 toCenterY textBase>
              <Box>{index + 1}.</Box>
              <Box>{word}</Box>
            </Box>
          ))}
        </Box>

        {blur && (
          <Box
            absolute
            top0
            bottom0
            right0
            left0
            toCenter
            style={{ backdropFilter: 'blur(5px)' }}
          >
            <Button
              relative
              isSquare
              size="sm"
              zIndex-10
              onClick={() => setBlur(!blur)}
            >
              <Eye></Eye>
            </Button>
          </Box>
        )}
      </Box>
      <Box toCenterX gap2>
        <Button variant="ghost" onClick={() => setBlur(true)}>
          <Eye size={18}></Eye>
          <Box>Hide recovery phrase</Box>
        </Button>

        <Button
          variant="ghost"
          onClick={() => {
            copy(mnemonic)
            toast.info('Copied to clipboard')
          }}
        >
          <Copy size={18}></Copy>
          <Box>Copy to clipboard</Box>
        </Button>
      </Box>
      <Box toCenterY gap2>
        <PasswordOnChain />
      </Box>
    </Box>
  )
}
