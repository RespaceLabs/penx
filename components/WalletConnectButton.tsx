'use client'

import { Button, ButtonProps } from '@/components/ui/button'
import { isPrivy } from '@/lib/constants'
import { api } from '@/lib/trpc'
import { getAccessToken, useLogin } from '@privy-io/react-auth'
import { useAppKit } from '@reown/appkit/react'
import { signIn } from 'next-auth/react'

interface Props extends ButtonProps {}

const ReownConnectButton = (props: Props) => {
  const { open } = useAppKit()
  async function onOpen() {
    await open()
  }

  function onClick() {
    onOpen()
  }

  return (
    <Button onClick={onClick} {...props}>
      {props.children ? props.children : 'Connect'}
    </Button>
  )
}

const PrivyConnectButton = (props: Props) => {
  const { login } = useLogin({
    onComplete: async (
      user,
      isNewUser,
      wasAlreadyAuthenticated,
      loginMethod,
      linkedAccount,
    ) => {
      console.log(
        '>>>>>>>>>>>>>>===privy user logged in',
        user,
        isNewUser,
        wasAlreadyAuthenticated,
        loginMethod,
        linkedAccount,
      )
      const token = await getAccessToken()
      console.log('token===:', token)

      await signIn('privy', {
        address: user.wallet?.address || '',
        token: token,
        redirect: false,
      })

      // Any logic you'd like to execute if the user is/becomes authenticated while this
      // component is mounted
    },
    onError: (error) => {
      console.log(error)
      // Any logic you'd like to execute after a user exits the login flow or there is an error
    },
  })

  return (
    <Button
      onClick={() => {
        login()
      }}
      {...props}
    >
      {props.children ? props.children : 'Connect'}
    </Button>
  )
}

export const WalletConnectButton = (props: Props) => {
  if (isPrivy) return <PrivyConnectButton {...props} />
  return <ReownConnectButton {...props} />
}
