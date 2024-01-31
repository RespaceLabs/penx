import { Box, FowerHTMLProps } from '@fower/react'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount } from 'wagmi'
import { Button, ButtonProps } from 'uikit'

interface Props extends FowerHTMLProps<'button'>, ButtonProps {}

export const WalletConnectButton = (props: Props) => {
  const { open } = useWeb3Modal()
  const { isConnected } = useAccount()

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
      fontSemibold
      onClick={onClick}
      {...props}
    >
      {props.children ? props.children : 'Connect'}
    </Button>
  )
}
