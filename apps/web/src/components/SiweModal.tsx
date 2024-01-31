import { useCallback, useEffect, useState } from 'react'
import { Box } from '@fower/react'
import { getCsrfToken, signIn, useSession } from 'next-auth/react'
import { SiweMessage } from 'siwe'
import { useAccount, useDisconnect, useNetwork, useSignMessage } from 'wagmi'
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
  const { chain } = useNetwork()
  const { data, status } = useSession()
  const [loading, setLoading] = useState(false)

  const handleLogin = useCallback(async () => {
    setLoading(true)
    try {
      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: 'Sign in with Ethereum to PenX.',
        uri: window.location.origin,
        version: '1',
        chainId: chain?.id,
        nonce: await getCsrfToken(),
      })
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      })
      await signIn('credentials', {
        message: JSON.stringify(message),
        redirect: true,
        signature,
        callbackUrl: '/editor',
      })
      // setLoading(false)
    } catch (error: any) {
      toast.error(error?.message || 'Something went wrong')
      setLoading(false)
    }
  }, [address, chain, signMessageAsync])

  useEffect(() => {
    if (isConnected && !data && status !== 'loading') {
      modalController.open(ModalNames.SIWE)
    }
  }, [isConnected, data, handleLogin, status])

  const shortenAddress = `${address?.slice(0, 18)}...${address?.slice(-4)}`

  return (
    <Modal name={ModalNames.SIWE}>
      <ModalOverlay />
      <ModalContent w={['96%', 360]} px={[20, 20]} py0 column gap4>
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
