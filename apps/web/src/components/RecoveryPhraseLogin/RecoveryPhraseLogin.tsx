import { FC, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { Box, css } from '@fower/react'
import { readContract } from '@wagmi/core'
import { useSession } from 'next-auth/react'
import { useAccount, useSignMessage } from 'wagmi'
import { Button, toast } from 'uikit'
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

        <Button
          variant="light"
          size="lg"
          colorScheme="gray500"
          absolute
          bottom1
          right1
          w-200
          rounded3XL
          column
          gap-2
          onClick={() => {
            recoverPassword()
          }}
        >
          <Box textSM>Restore recover phrase</Box>
          <Box text-10>Restore recover phrase from blockchain</Box>
        </Button>
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
