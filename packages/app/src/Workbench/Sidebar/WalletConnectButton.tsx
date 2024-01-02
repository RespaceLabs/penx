import { Box, FowerHTMLProps } from '@fower/react'
import { useWeb3Modal } from '@web3modal/react'
import { MoreHorizontal } from 'lucide-react'
import { useAccount } from 'wagmi'
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
  Button,
  ButtonProps,
} from 'uikit'

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
      toBetween
      fontSemibold
      // colorScheme="white"
      // brand500
      variant="light"
      colorScheme="gray600"
      size="lg"
      onClick={onClick}
      {...props}
    >
      <AvatarGroup>
        <Avatar size="sm">
          <AvatarImage src="/images/metamask.png" />
        </Avatar>
        <Avatar size="sm">
          <AvatarImage src="/images/rainbow.png" />
        </Avatar>
        <Avatar size="sm">
          <AvatarImage src="/images/zion.png" />
        </Avatar>
        <Avatar size="sm">
          <AvatarFallback bgGray400>
            <MoreHorizontal size={16} />
          </AvatarFallback>
        </Avatar>
      </AvatarGroup>

      <Box display={['none', 'none', 'inline-flex']}>Connect Wallet</Box>

      <Box display={['inline-flex', 'inline-flex', 'none']}>Connect</Box>
    </Button>
  )
}
