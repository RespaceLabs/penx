import { FC, useState } from 'react'
import { Box } from '@fower/react'
import { readContract } from '@wagmi/core'
import { useSession } from 'next-auth/react'
import { useAccount, useReadContract, useSignMessage } from 'wagmi'
import { Button, Input, InputElement, InputGroup, Spinner, toast } from 'uikit'
import { passwordManagerAbi } from '@penx/abi'
import { decryptString } from '@penx/encryption'
import { getPublicKey, setMnemonicToLocal } from '@penx/mnemonic'
import { store } from '@penx/store'
import { addressMap, wagmiConfig } from '@penx/wagmi'

interface Props {
  refetch: any
}

export const RecoveryPhraseLogin: FC<Props> = ({ refetch }) => {
  const { data } = useSession()
  const [mnemonic, setMnemonic] = useState('')
  const { signMessageAsync } = useSignMessage()
  const { address } = useAccount()

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

  async function recoverPassword() {
    if (!data) return alert('Not data from blockchain')
    try {
      const signature = await signMessageAsync({ message: address! })

      const recoveryPhraseData = await readContract(wagmiConfig, {
        address: addressMap.PasswordManager,
        abi: passwordManagerAbi,
        functionName: 'getPassword',
        args: [address!],
      })

      const recoverPhrase = decryptString(recoveryPhraseData, signature)

      if (recoverPhrase) {
        setMnemonic(recoverPhrase)
      } else {
        // TODO: handle error
        toast.error('Restore recovery phrase failed')
      }
    } catch (error) {
      console.log('=======error:', error)

      toast.error('Restore recovery phrase failed')
    }
  }

  return (
    <Box column gap8 w={['100%', 600, 800]}>
      <Box>
        <Box text4XL fontBold textCenter>
          Recovery Phrase
        </Box>
        <Box textCenter gray600 leadingNormal textSM>
          Enter your recovery phrase to recovery your data in this device.
        </Box>
      </Box>

      <InputGroup zIndex-10>
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

        <InputElement w-210>
          <Button
            variant="light"
            size="lg"
            w-200
            roundedFull
            column
            gap-2
            onClick={() => {
              recoverPassword()
            }}
          >
            <Box textSM>Restore recover phrase</Box>
            <Box text-10>Restore recover phrase from blockchain</Box>
          </Button>
        </InputElement>
      </InputGroup>

      <Box toCenterY gap2 toCenterX>
        <Button size="lg" w-200 roundedFull onClick={() => confirm()}>
          Confirm
        </Button>
      </Box>
    </Box>
  )
}
