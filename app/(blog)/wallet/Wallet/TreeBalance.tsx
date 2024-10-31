import { treeTokenAbi } from '@/lib/abi'
import { addressMap } from '@/lib/address'
import { precision } from '@/lib/math'
import { Address } from 'viem'
import { useAccount, useReadContract } from 'wagmi'

export function TreeBalance() {
  const { address = '' } = useAccount()
  const { data } = useReadContract({
    address: addressMap.TreeToken,
    abi: treeTokenAbi,
    functionName: 'balanceOf',
    args: [address as Address],
  })

  console.log('tree data:', data)

  if (!data) return null

  return (
    <div className="space-y-1">
      <div className="text-foreground/60">$TREE Balance</div>
      <div className="text-2xl font-bold">
        {typeof data !== 'undefined' &&
          `${precision.toDecimal(data).toFixed(5)}`}
      </div>
    </div>
  )
}
