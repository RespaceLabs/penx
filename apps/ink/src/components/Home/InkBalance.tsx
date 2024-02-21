import React from 'react'
import { Box } from '@fower/react'
import { useAccount, useReadContract } from 'wagmi'
import { Button } from 'uikit'
import { precision } from '@penx/math'
import { WalletConnectButton } from '../WalletConnectButton'
import { WalletConnectProvider } from '../WalletConnectProvider'
import { WalletProfile } from './WalletProfile'

export function InkBalance() {
  const { isConnected } = useAccount()
  if (!isConnected) {
    return (
      <WalletConnectButton colorScheme="black" size="lg" roundedFull w-240>
        Check my $INK balance
      </WalletConnectButton>
    )
  }
  return <WalletProfile></WalletProfile>
}
