import { Box, FowerHTMLProps } from '@fower/react'
import { useAccount, useReadContract } from 'wagmi'
import { erc20Abi } from '@penx/abi'
import { precision } from '@penx/math'
import { addressMap } from '@penx/wagmi'

interface Props extends FowerHTMLProps<'div'> {}

export const UsdtBalance = (props: Props) => {
  const { address } = useAccount()
  const { data, isLoading, isError } = useReadContract({
    address: addressMap.USDT,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [address!],
  })

  // console.log('====data', data, 'isError:', isError, 'isLoading:', isLoading)

  return (
    <Box textXL toCenterY gap2>
      <Box as="img" src="/images/USDT.svg" square6 />
      {isLoading && <Box>Loading...</Box>}
      {!isLoading && <Box>{precision.toDecimal(data!, 6)}</Box>}
      <Box>USDT</Box>
    </Box>
  )
}
