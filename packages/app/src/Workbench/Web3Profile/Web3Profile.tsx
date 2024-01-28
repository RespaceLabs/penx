import { PropsWithChildren } from 'react'
import { Box } from '@fower/react'
import {
  useAccount,
  WalletConnectButton,
  WalletConnectProvider,
} from '@penx/wagmi'
import { ClientOnly } from '../../components/ClientOnly'
import { DisconnectButton } from '../../components/DisconnectButton'
import { MintPointButton } from './MintPointButton'
import { MyPoint } from './MyPoint'

export function Web3Profile() {
  return (
    <ClientOnly>
      <WalletConnectProvider>
        <Profile />
      </WalletConnectProvider>
    </ClientOnly>
  )
}

export function Profile() {
  const { isConnected } = useAccount()
  return (
    <Box p10 relative>
      <Box toBetween>
        <Box text2XL mb4 fontBold>
          Web3 profile
        </Box>
        {isConnected && <DisconnectButton />}
      </Box>
      {!isConnected && <WalletConnectButton>Connect</WalletConnectButton>}

      {isConnected && (
        <Box>
          <MyPoint />
          <MintPointButton />
        </Box>
      )}
    </Box>
  )
}
