import { Box, FowerHTMLProps } from '@fower/react'
import { Button } from 'uikit'
import { IconDisconnect } from '@penx/icons'
import { useDisconnect } from '@penx/wagmi'

interface DisconnectButtonProps extends FowerHTMLProps<'button'> {}

export function DisconnectButton(props: DisconnectButtonProps) {
  const { disconnect } = useDisconnect()
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
