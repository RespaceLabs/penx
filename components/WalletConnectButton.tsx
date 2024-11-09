'use client'

import { Button, ButtonProps } from '@/components/ui/button'
import { useAddress } from '@/hooks/useAddress'
import { AuthType } from '@prisma/client'
import { useAppKit } from '@reown/appkit/react'
import { signIn } from 'next-auth/react'
import { useSiteContext } from './SiteContext'
import { Avatar, AvatarFallback } from './ui/avatar'

interface Props extends ButtonProps {
  authType?: AuthType
}

export const ReownConnectButton = (props: Props) => {
  const address = useAddress()
  const { open } = useAppKit()
  async function onOpen() {
    await open()
  }

  function onClick() {
    onOpen()
  }

  if (address) {
    return (
      <Avatar className="h-8 w-8">
        <AvatarFallback></AvatarFallback>
      </Avatar>
    )
  }

  return (
    <Button onClick={onClick} {...props}>
      {props.children ? props.children : 'Connect'}
    </Button>
  )
}

export const WalletConnectButton = (props: Props) => {
  const { authType, ...rest } = props
  if (props.authType === AuthType.REOWN) return <ReownConnectButton {...rest} />

  return <ReownConnectButton {...rest} />
}
