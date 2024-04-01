import { FC } from 'react'
import { Box } from '@fower/react'
import { ArrowUp } from 'lucide-react'
import { useAccount, useSignMessage, useWriteContract } from 'wagmi'
import { Button, toast } from 'uikit'
import { passwordManagerAbi } from '@penx/abi'
import { encryptString } from '@penx/encryption'
import { addressMap } from '@penx/wagmi'

// import { WalletConnectButton } from '../WalletConnectButton'

interface Props {
  mnemonic: string
}

export const PasswordOnChain: FC<Props> = ({ mnemonic }) => {
  const { isConnected, address } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const { writeContractAsync } = useWriteContract()

  async function uploadPassword() {
    try {
      const signature = await signMessageAsync({ message: address! })
      const encrypted = encryptString(mnemonic, signature)

      await writeContractAsync({
        address: addressMap.PasswordManager,
        abi: passwordManagerAbi,
        functionName: 'setPassword',
        args: [encrypted],
      })

      toast.info('Recover phrase uploaded')
    } catch (error) {
      console.log('error', error)
      toast.info('Recover phrase failed to upload')
    }
  }

  // if (!isConnected) {
  //   return <WalletConnectButton></WalletConnectButton>
  // }

  return (
    <Box mt4 toCenterX w-100p>
      <Button
        size={65}
        colorScheme="white"
        roundedFull
        toLeft
        onClick={async () => {
          uploadPassword()
        }}
      >
        <ArrowUp></ArrowUp>
        <Box column gap1>
          <Box textBase fontSemibold>
            Store Recovery Phrase
          </Box>
          <Box textXS fontLight>
            Store current password to blockchain
          </Box>
        </Box>
      </Button>
    </Box>
  )
}
