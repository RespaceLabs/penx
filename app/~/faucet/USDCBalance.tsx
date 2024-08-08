'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { useQueryUsdcBalance } from '@/hooks/useUsdcBalance'
import { precision } from '@/lib/math'

export function USDCBalance() {
  const { data: data, isLoading } = useQueryUsdcBalance()

  if (isLoading) {
    return <Skeleton className="h-10" />
  }

  return (
    <div className="flex text-xl font-bold  items-start gap-2">
      <div>Balance:</div>
      <div>
        {typeof data !== 'undefined' &&
          `${precision.toDecimal(data!, 6).toFixed()} USDC`}
      </div>
    </div>
  )
}
