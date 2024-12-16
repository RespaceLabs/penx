import { penTokenAbi } from '@/lib/abi'
import { addressMap } from '@/lib/address'
import { precision } from '@/lib/math'
import { Address } from 'viem'
import { useAccount, useReadContract } from 'wagmi'

export function PenBalance() {
  const { address = '' } = useAccount()
  const { data } = useReadContract({
    address: addressMap.PenToken,
    abi: penTokenAbi,
    functionName: 'balanceOf',
    args: [address as Address],
  })

  if (!data) return null

  return (
    <div className="space-y-1">
      <div className="text-foreground/60">$PEN Balance</div>
      <div className="text-2xl font-bold">
        {typeof data !== 'undefined' &&
          `${precision.toDecimal(data).toFixed(5)}`}
      </div>
    </div>
  )
}
