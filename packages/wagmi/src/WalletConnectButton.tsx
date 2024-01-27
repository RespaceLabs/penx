import { useEffect } from 'react'
import { Box, FowerHTMLProps } from '@fower/react'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount } from 'wagmi'
import { Button, ButtonProps } from 'uikit'

interface Props extends FowerHTMLProps<'button'>, ButtonProps {}

export const WalletConnectButton = (props: Props) => {
  const { open } = useWeb3Modal()
  const { isConnected, address } = useAccount()

  async function onOpen() {
    await open()
  }

  function onClick() {
    if (!isConnected) {
      onOpen()
    }
  }

  return (
    <Button
      type="button"
      textSM
      roundedFull
      size="sm"
      fontSemibold
      onClick={onClick}
      {...props}
    >
      <Box display={['none', 'none', 'inline-flex']}>
        {props.children ? props.children : 'Connect'}
      </Box>

      <Box display={['inline-flex', 'inline-flex', 'none']}>
        {props.children ? props.children : 'Connect'}
      </Box>
    </Button>
  )
}
