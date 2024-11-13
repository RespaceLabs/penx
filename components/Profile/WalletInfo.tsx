'use client'

import { useQueryEthBalance } from '@/hooks/useEthBalance'
import { penTokenAbi } from '@/lib/abi'
import { addressMap } from '@/lib/address'
import { precision } from '@/lib/math'
import { Address } from 'viem'
import { useAccount, useReadContract } from 'wagmi'
import { Skeleton } from '../ui/skeleton'

export function WalletInfo() {
  const { data, isLoading } = useQueryEthBalance()

  const { address = '' } = useAccount()
  const { data: penBalance } = useReadContract({
    address: addressMap.PenToken,
    abi: penTokenAbi,
    functionName: 'balanceOf',
    args: [address as Address],
    query: {
      enabled: !!address,
    },
  })

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center gap-1 h-12">
        <Skeleton className="h-5" />
        <Skeleton className="h-5" />
      </div>
    )
  }

  return (
    <div className="flex flex-col text-base font-semibold">
      <div className="flex items-center justify-between h-6">
        <div className="text-sm text-foreground/60">$ETH</div>
        <div>
          {typeof data !== 'undefined' &&
            `${precision.toDecimal(data.value).toFixed(5)}`}
        </div>
      </div>

      <div className="flex items-center justify-between h-6">
        <div className="text-sm text-foreground/60">$PEN</div>
        <div>
          {typeof data !== 'undefined' &&
            `${precision.toDecimal(penBalance).toFixed(0)}`}
        </div>
      </div>
    </div>
  )
}
