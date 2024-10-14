'use client'

import { Button, ButtonProps } from '@/components/ui/button'
import { useAppKit } from '@reown/appkit/react'

interface Props extends ButtonProps {}

export const WalletConnectButton = (props: Props) => {
  const { open } = useAppKit()
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
