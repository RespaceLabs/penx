import { FC } from 'react'
import { Box } from '@fower/react'
import { get, set } from 'idb-keyval'
import { ArrowUp, Redo } from 'lucide-react'
import {
  useAccount,
  useReadContract,
  useSignMessage,
  useWriteContract,
} from 'wagmi'
import { Button, toast } from 'uikit'
import { passwordManagerAbi } from '@penx/abi'
import { decryptString, encryptString } from '@penx/encryption'
import { addressMap } from '@penx/wagmi'
import { WalletConnectButton } from '../WalletConnectButton'
import { MASTER_PASSWORD, useMasterPassword } from './useMasterPassword'

interface Props {}

export const PasswordOnChain: FC<Props> = () => {
  const { masterPassword, setMasterPassword } = useMasterPassword()
  const { isConnected, address } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const { data = '', error } = useReadContract({
    address: addressMap.PasswordManager,
    abi: passwordManagerAbi,
    functionName: 'getPassword',
    account: address,
  })

  const { writeContractAsync } = useWriteContract()

  async function uploadPassword() {
    try {
      const signature = await signMessageAsync({ message: address! })
      const rawPassword = await get(MASTER_PASSWORD)
      const encrypted = encryptString(rawPassword, signature)

      await writeContractAsync({
        address: addressMap.PasswordManager,
        abi: passwordManagerAbi,
        functionName: 'setPassword',
        args: [encrypted],
      })
    } catch (error) {}
  }

  async function recoverPassword() {
    if (!data) return alert('Not data from blockchain')
    try {
      const signature = await signMessageAsync({ message: address! })
      const rawPassword = decryptString(data, signature)

      if (rawPassword) {
        setMasterPassword({
          value: rawPassword,
          blur: false,
        })
        await set(MASTER_PASSWORD, rawPassword)
        toast.success('Password recovered')
      } else {
        // TODO: handle error
      }
    } catch (error) {}
  }

  if (!isConnected) {
    return <WalletConnectButton></WalletConnectButton>
  }
  return (
    <Box mt4>
      {/* <Box>{data || ''}</Box> */}
      <Box toCenterY gap2>
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
          <Box column gap1 toLeft>
            <Box textBase fontSemibold>
              Store password
            </Box>
            <Box textXS fontLight>
              Store current password to blockchain
            </Box>
          </Box>
        </Button>
        <Button
          size={65}
          colorScheme="white"
          roundedFull
          toLeft
          onClick={() => recoverPassword()}
        >
          <Redo></Redo>
          <Box column gap1 toLeft>
            <Box textBase fontSemibold>
              Recover password
            </Box>
            <Box textXS fontLight>
              Recover password from blockchain
            </Box>
          </Box>
        </Button>
      </Box>
    </Box>
  )
}
