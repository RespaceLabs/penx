import { FC, useState } from 'react'
import { Box } from '@fower/react'
import { useQuery } from '@tanstack/react-query'
import { Copy, Eye } from 'lucide-react'
import { Button, toast } from 'uikit'
import { getMnemonicFromLocal } from '@penx/mnemonic'
import { useSession } from '@penx/session'
import { useCopyToClipboard } from '@penx/shared'
import { trpc } from '@penx/trpc-client'
import { CloudBackup } from './CloudBackup'
import { HaveBackedUpButton } from './HaveBackedUpButton'
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
        <Box text3XL fontBold textCenter>
          Recovery Phrase
        </Box>
      </Box>

      <Box bgZinc100 p5 relative rounded2XL toBetween toCenterY gap2>
        <Box gapY4 grid gridTemplateColumns-3 w-100p>
          {words.map((word, index) => (
            <Box key={word} gap1 toCenterY textBase flex-1>
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
      <Box toCenter gap4 column>
        {/* <PasswordOnChain mnemonic={mnemonic} /> */}

        <CloudBackup />
        <HaveBackedUpButton />
      </Box>
    </Box>
  )
}
