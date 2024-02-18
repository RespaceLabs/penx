import React from 'react'
import { Box } from '@fower/react'
import { useAccount } from 'wagmi'
import { WalletConnectButton } from '../WalletConnectButton'
import { WalletProfile } from '../WalletProfile'
import MintInk from './MintInk'
import MintUSDT from './MintUSDT'
import MyInk from './MyInk'
import MyUSDT from './MyUSDT'
import VaultInk from './VaultInk'
import VaultUSDT from './VaultUSDT'

const Vault = () => {
  const { isConnected } = useAccount()
  return (
    <Box p10>
      <WalletProfile />
      {!isConnected && <WalletConnectButton />}
      {isConnected && (
        <Box column gap4>
          <VaultInk></VaultInk>
          <MyInk></MyInk>
          <MyUSDT></MyUSDT>
          <VaultUSDT></VaultUSDT>
          <MintInk />
          <MintUSDT></MintUSDT>
        </Box>
      )}
    </Box>
  )
}

export default Vault
