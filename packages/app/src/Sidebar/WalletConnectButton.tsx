import { Box, FowerHTMLProps } from '@fower/react'
import { Trans } from '@lingui/macro'
import { useWeb3Modal } from '@web3modal/react'
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
      size="sm"
      onClick={onClick}
      {...props}
    >
      <Box display={['none', 'none', 'inline-flex']}>
        <Trans>Connect Wallet</Trans>
      </Box>

      <Box display={['inline-flex', 'inline-flex', 'none']}>
        <Trans>Connect</Trans>
      </Box>
    </Button>
  )
}
