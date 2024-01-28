import { Box } from '@fower/react'
import { penxPointAbi } from '@penx/abi'
import { precision } from '@penx/math'
import { addressMap, useAccount, useReadContract } from '@penx/wagmi'

export function MyPoint() {
  const { address } = useAccount()
  const { data, ...rest } = useReadContract({
    address: addressMap.PenxPoint,
    abi: penxPointAbi,
    functionName: 'balanceOf',
    args: [address!],
  })

  if (typeof data === 'undefined') return null

  return (
    <Box column gap2>
      <Box gray500>My Points</Box>
      <Box text3XL fontBold>
        {precision.toTokenDecimal(data)} PXP
      </Box>
    </Box>
  )
}
