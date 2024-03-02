import { Box } from '@fower/react'
import { useAccount, useReadContract } from 'wagmi'
import { erc20Abi } from '@penx/abi'
import { precision } from '@penx/math'
import { addressMap } from '@penx/wagmi'

export const PointBalance = () => {
  const { address } = useAccount()
  const { data, isLoading } = useReadContract({
    address: addressMap.INK,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [address!],
  })

  return (
    <Box text3XL toCenterY gap2>
      {isLoading && <Box>Loading...</Box>}
      {!!data && <Box>{precision.toDecimal(data)}</Box>}
      <Box>INK</Box>
    </Box>
  )
}
