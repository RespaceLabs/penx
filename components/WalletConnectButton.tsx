'use client'

import { Button, ButtonProps } from '@/components/ui/button'
import { useAddress } from '@/hooks/useAddress'
import { AuthType } from '@prisma/client'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { signIn } from 'next-auth/react'
import { useSiteContext } from './SiteContext'
import { Avatar, AvatarFallback } from './ui/avatar'

interface Props extends ButtonProps {}

export const WalletConnectButton = (props: Props) => {
  const { openConnectModal } = useConnectModal()
  const address = useAddress()

  async function onOpen() {
    openConnectModal?.()
  }

  function onClick() {
    onOpen()
  }

  // if (address) {
  //   return (
  //     <Avatar className="h-8 w-8">
  //       <AvatarFallback></AvatarFallback>
  //     </Avatar>
  //   )
  // }

  return (
    <Button onClick={onClick} {...props}>
      {props.children ? props.children : 'Connect'}
    </Button>
  )
}
