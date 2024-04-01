import { Dispatch, SetStateAction, useState } from 'react'
import { Box } from '@fower/react'
import { readContract } from '@wagmi/core'
import { useSession } from 'next-auth/react'
import { useAccount, useSignMessage } from 'wagmi'
import { Button, toast } from 'uikit'
import { passwordManagerAbi } from '@penx/abi'
import { decryptString } from '@penx/encryption'
import { addressMap, wagmiConfig } from '@penx/wagmi'

interface Props {
  setMnemonic: Dispatch<SetStateAction<string>>
}

export const RecoverFromChainButton = ({ setMnemonic }: Props) => {
  const { data } = useSession()
  const { signMessageAsync } = useSignMessage()
  const { address } = useAccount()

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
    <Button
      variant="light"
      size="lg"
      colorScheme="gray500"
      w-200
      rounded3XL
      column
      gap-2
      onClick={() => {
        recoverPassword()
      }}
    >
      <Box textSM>Restore recovery phrase</Box>
      <Box text-10>Restore recovery phrase from blockchain</Box>
    </Button>
  )
}
