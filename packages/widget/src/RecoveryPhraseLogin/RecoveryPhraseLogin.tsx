import { FC, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { Box, css } from '@fower/react'
import { Button, toast } from 'uikit'
import { getPublicKey, setMnemonicToLocal } from '@penx/mnemonic'
import { useSession } from '@penx/session'
import { store } from '@penx/store'
import { RecoverFromGoogleModal } from './RecoverFromGoogleModal'

interface Props {
  refetch: any
}

export const RecoveryPhraseLogin: FC<Props> = ({ refetch }) => {
  const { data } = useSession()
  const [mnemonic, setMnemonic] = useState('')

  async function confirm() {
    if (!mnemonic) return toast.error('Please enter your recovery phrase')

    const publicKey = getPublicKey(mnemonic.trim())

    if (data?.publicKey !== publicKey) {
      return toast.error('Invalid recovery phrase')
    }

    await setMnemonicToLocal(data.userId!, mnemonic)
    store.user.setMnemonic(mnemonic)
    await refetch()
  }

  return (
    <Box column gap8 w={['100%', 500, 600]} shadowPopover p6 rounded3XL>
      <Box>
        <Box text4XL fontBold textCenter>
          Recovery Phrase
        </Box>
        <Box textCenter gray600 leadingNormal textSM>
          Enter your recovery phrase to recovery your data in this device.
        </Box>
      </Box>

      <Box relative>
        <TextareaAutosize
          minRows={6}
          className={css(
            'm0 rounded3XL border-1 w-100p outlineNone px3 py3 flex placeholderGray400 bgWhite textBase gray300--dark bgTransparent bgTransparent--dark',
          )}
          value={mnemonic}
          onChange={(e) => {
            setMnemonic(e.target.value)
          }}
        />

        <Box absolute bottom1 right1 toCenter gap2>
          <RecoverFromGoogleModal setMnemonic={setMnemonic} />
          {/* <RecoverFromChainButton setMnemonic={setMnemonic} /> */}
        </Box>
      </Box>

      <Box toCenterY gap2 toCenterX>
        <Button
          size="lg"
          colorScheme="black"
          w-200
          roundedFull
          onClick={() => confirm()}
        >
          Confirm
        </Button>
      </Box>
    </Box>
  )
}
