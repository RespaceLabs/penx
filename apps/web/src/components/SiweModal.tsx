import { useCallback, useEffect, useState } from 'react'
import { Box } from '@fower/react'
import { getCsrfToken, signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { SiweMessage } from 'siwe'
import { useAccount, useChainId, useDisconnect, useSignMessage } from 'wagmi'
import {
  Button,
  Modal,
  ModalContent,
  modalController,
  ModalOverlay,
  Spinner,
  toast,
} from 'uikit'
import { ModalNames } from '@penx/constants'

export function SiweModal() {
  const { isConnected, address = '' } = useAccount()
  const { disconnect } = useDisconnect()
  const { signMessageAsync } = useSignMessage()
  const chainId = useChainId()
  const { data, status } = useSession()
  const [loading, setLoading] = useState(false)
  const { push, pathname } = useRouter()

  // console.log(
  //   '=====isConnected, address:',
  //   isConnected,
  //   address,
  //   'data:',
  //   data,
  //   'status:',
  //   status,
  // )

  const handleLogin = useCallback(async () => {
    console.log('========chainId:', chainId)

    setLoading(true)
    try {
      const message = new SiweMessage({
        version: '1',
        statement: 'Sign in with Ethereum to PenX.',
        domain: window.location.host,
        uri: window.location.origin,
        address,
        chainId,
        nonce: await getCsrfToken(),
      })

      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      })

      await signIn('credentials', {
        message: JSON.stringify(message),
        redirect: false,
        signature,
        callbackUrl: '/',
      })

      if (pathname === '/login') {
        push('/')
      }

      // if (pathname === '/login/web3') {
      //   push('/')
      // }

      modalController.close(ModalNames.SIWE)
    } catch (error: any) {
      console.log('===========login=error:', error)
      toast.error(error?.message || 'Something went wrong')
      setLoading(false)
    }
  }, [address, chainId, signMessageAsync, push, pathname])

  useEffect(() => {
    if (isConnected && !data && status == 'unauthenticated') {
      modalController.open(ModalNames.SIWE)
    }
  }, [isConnected, data, handleLogin, status])

  const shortenAddress = `${address?.slice(0, 18)}...${address?.slice(-4)}`

  return (
    <Modal name={ModalNames.SIWE} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent w={['100%', 360]} p={[20, 20]} py0 column gap4>
        <Box column toCenterX>
          <Box fontSemibold text2XL leadingNone>
            Sign in to PenX
          </Box>
        </Box>

        <Box toCenter>
          <Box gray800 py1 px3 bgNeutral100 roundedFull inlineFlex>
            {shortenAddress}
          </Box>
        </Box>

        <Box textCenter gray400 leadingTight textSM>
          Sign this message to prove you own this wallet and proceed. Canceling
          will disconnect you.
        </Box>

        <Box toCenterY gap2 mt2>
          <Button
            type="button"
            roundedFull
            colorScheme="white"
            flex-1
            onClick={() => {
              modalController.close(ModalNames.SIWE)
              disconnect()
            }}
          >
            Cancel
          </Button>

          <Button
            roundedFull
            gap2
            flex-1
            disabled={loading}
            onClick={async () => {
              if (loading) return
              await handleLogin()
            }}
          >
            {loading && <Spinner white square5 />}
            <Box>Sign in</Box>
          </Button>
        </Box>
      </ModalContent>
    </Modal>
  )
}
