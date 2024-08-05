'use client'

import { Button, ButtonProps } from '@/components/ui/button'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount } from 'wagmi'

interface Props extends ButtonProps {}

export const WalletConnectButton = (props: Props) => {
  const { open, close } = useWeb3Modal()
  const { address, isConnecting, isDisconnected } = useAccount()

  async function onOpen() {
    await open()
  }

  function onClick() {
    onOpen()
    // if (!isConnected) {
    //   onOpen()
    // }
  }

  return (
    <Button onClick={onClick} {...props}>
      {props.children ? props.children : 'Connect'}
    </Button>
  )
}
