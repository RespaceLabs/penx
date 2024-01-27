import { useEffect } from 'react'
import { Box } from '@fower/react'
import { Button } from 'uikit'
import { useUser } from '@penx/hooks'
import { useSession } from '@penx/session'
import { api, trpc } from '@penx/trpc-client'
import { useAccount, useDisconnect, WalletConnectButton } from '@penx/wagmi'
import { Title } from './Title'

export function AccountBinding() {
  const user = useUser()
  const { disconnect } = useDisconnect()
  const { isConnected, address } = useAccount()
  const { data } = useSession()
  console.log('=======user:', user, 'data:', data)

  useEffect(() => {
    if (isConnected && address) {
      api.user.updateAddress.mutate({ address })
    }
  }, [isConnected, address])

  return (
    <Box>
      <Title text="ACCOUNT BINDING" />
      <Box>
        <Box toCenterY toBetween>
          <Box>Wallet</Box>
          <Box toCenterY gap1>
            <Box>{user.address}</Box>
            {!isConnected && <WalletConnectButton></WalletConnectButton>}
            {isConnected && (
              <Button colorScheme="red500" onClick={() => disconnect()}>
                Disconnect
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
