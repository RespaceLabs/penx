import { Box, FowerHTMLProps } from '@fower/react'
import { Button } from 'uikit'
import { IconDisconnect } from '@penx/icons'
import { useAccount, useDisconnect } from '@penx/wagmi'

interface DisconnectButtonProps extends FowerHTMLProps<'button'> {}

export function DisconnectButton(props: DisconnectButtonProps) {
  const { disconnect } = useDisconnect()
  const { isConnected } = useAccount()
  if (!isConnected) return null
  return (
    <Button
      colorScheme="gray500"
      variant="light"
      onClick={() => disconnect()}
      roundedFull
      {...props}
    >
      <Box inlineFlex>
        <IconDisconnect size={20} />
      </Box>
      <Box>Disconnect</Box>
    </Button>
  )
}
