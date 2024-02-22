import { Box, FowerHTMLProps } from '@fower/react'
import { Gem } from 'lucide-react'
import { useAccount, useReadContract } from 'wagmi'
import { erc20Abi } from '@penx/abi'
import { precision } from '@penx/math'
import { addressMap } from '@penx/wagmi'

interface Props extends FowerHTMLProps<'div'> {}

export const InkBalance = (props: Props) => {
  const { address } = useAccount()
  const { data, isLoading } = useReadContract({
    address: addressMap.INK,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [address!],
  })

  return (
    <Box textXL toCenterY gap2 {...props}>
      <Box inlineFlex>
        <Gem size={20}></Gem>
      </Box>
      {isLoading && <Box>Loading...</Box>}
      {!isLoading && <Box>{precision.toTokenDecimal(data!)}</Box>}
      <Box>INK</Box>
    </Box>
  )
}
