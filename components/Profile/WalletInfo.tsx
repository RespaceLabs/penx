'use client'

import { useQueryEthBalance } from '@/hooks/useEthBalance'
import { precision } from '@/lib/math'
import { Skeleton } from '../ui/skeleton'

export function WalletInfo() {
  const { data, isLoading } = useQueryEthBalance()

  if (isLoading) {
    return <Skeleton className="h-10" />
  }

  return (
    <div className="text-xl font-bold h-10 flex items-center">
      {typeof data !== 'undefined' &&
        `${precision.toDecimal(data.value).toFixed(5)} ETH`}
    </div>
  )
}
