import { FowerHTMLProps } from '@fower/react'
import { useAccount, useDisconnect } from 'wagmi'
import {
  Button,
  ButtonProps,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from 'uikit'
import { PointBalance } from './PointBalance'

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
      <PopoverContent w-280 p4 column toCenter gap4>
        <PointBalance />
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
