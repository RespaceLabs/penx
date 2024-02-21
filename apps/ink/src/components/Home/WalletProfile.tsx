import { Box, FowerHTMLProps } from '@fower/react'
import { useAccount, useDisconnect, useReadContract } from 'wagmi'
import {
  Button,
  ButtonProps,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from 'uikit'
import { erc20Abi } from '@penx/abi'
import { precision } from '@penx/math'
import { addressMap } from '@penx/wagmi'
import { PointBalance } from './PointBalance'

interface Props
  extends Omit<FowerHTMLProps<'button'>, 'children'>,
    ButtonProps {}

export const WalletProfile = (props: Props) => {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const { data, isLoading } = useReadContract({
    address: addressMap.INK,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [address!],
  })

  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <Button
          size="lg"
          type="button"
          variant="filled"
          // colorScheme="black"
          colorScheme="brand500"
          roundedFull
          gap4--i
          {...props}
        >
          <Box>
            {address!.slice(0, 6)}...{address!.slice(-4)}
          </Box>

          <Box>( {!!data && precision.toTokenDecimal(data)} INK )</Box>
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
