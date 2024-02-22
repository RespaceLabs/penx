import { Box, FowerHTMLProps } from '@fower/react'
import { useAccount, useDisconnect } from 'wagmi'
import {
  Button,
  ButtonProps,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from 'uikit'
import { InkBalance } from './InkBalance'
import { UsdtBalance } from './UsdtBalance'

interface Props
  extends Omit<FowerHTMLProps<'button'>, 'children'>,
    ButtonProps {}

export const WalletProfile = (props: Props) => {
  const { address = '' } = useAccount()
  const { disconnect } = useDisconnect()
  if (!address) return null
  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <Button
          type="button"
          variant="light"
          colorScheme="gray600"
          rounded2XL
          {...props}
        >
          {address.slice(0, 6)}...{address.slice(-4)}
        </Button>
      </PopoverTrigger>
      <PopoverContent p4 column gap4 minW-280>
        <Box column gap2>
          <InkBalance />
          <UsdtBalance />
        </Box>
        <PopoverClose>
          <Button
            type="button"
            colorScheme="white"
            rounded2XL
            onClick={() => {
              disconnect()
            }}
          >
            Disconnect
          </Button>
        </PopoverClose>
      </PopoverContent>
    </Popover>
  )
}
