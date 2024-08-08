'use client'

import { useBuyPrice } from '@/hooks/useBuyPrice'
import { precision } from '@/lib/math'

export function KeyPrice({ creationId }: { creationId: bigint }) {
  const { data, isLoading } = useBuyPrice(creationId)

  if (isLoading || !data) return <div>-</div>

  const keyPrice = precision.toDecimal(data.priceAfterFee, 6).toFixed(2)
  return (
    <div className="bg-muted rounded-lg flex items-center justify-between p-4 bg-amber-100">
      <div>Buy price</div>
      <div className="text-lg font-bold flex items-center gap-1">
        <div>{keyPrice} USDC</div>
      </div>
    </div>
  )
}
