import { FC, useState } from 'react'
import { Box } from '@fower/react'
import { useSession } from 'next-auth/react'
import { Button, Input, InputElement, InputGroup, Spinner, toast } from 'uikit'
import { getPublicKey, setMnemonicToLocal } from '@penx/mnemonic'
import { store } from '@penx/store'
import { api } from '@penx/trpc-client'

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

    await setMnemonicToLocal(data.secret!, mnemonic)
    store.user.setMnemonic(mnemonic)
    await refetch()
  }

  return (
    <Box column gap8 w={['100%', 500, 700]}>
      <Box>
        <Box text4XL fontBold textCenter>
          Recovery Phrase
        </Box>
        <Box textCenter gray600 leadingNormal textSM>
          Enter your recovery phrase to recovery your data in this device.
        </Box>
      </Box>

      <InputGroup>
        <Input
          size={56}
          flex-1
          borderNone
          shadowPopover
          roundedFull
          textBase
          // shadow3XL
          placeholder="Enter recover phrase"
          value={mnemonic}
          onChange={(e) => {
            setMnemonic(e.target.value)
          }}
        />

        {/* {!isLoading && !isNewUser && (
          <InputElement w-190>
            <Button variant="light" size="lg" w-180 roundedFull column gap-2>
              <Box textSM>Recover</Box>
              <Box text-10>Recover from blockchain</Box>
            </Button>
          </InputElement>
        )} */}
      </InputGroup>

      <Box toCenterY gap2 toCenterX>
        <Button size="lg" w-200 roundedFull onClick={() => confirm()}>
          Confirm
        </Button>
      </Box>
    </Box>
  )
}
