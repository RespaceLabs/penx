'use client'

import { useBuyPrice } from '@/hooks/useBuyPrice'
import { useEthPrice } from '@/hooks/useEthPrice'
import { precision } from '@/lib/math'

export function KeyPrice({ creationId }: { creationId: bigint }) {
  const { data, isLoading } = useBuyPrice(creationId)
  const { ethPrice } = useEthPrice()

  if (isLoading || !data) return <div>-</div>

  const keyPrice = precision.toDecimal(data.priceAfterFee)
  const usdPrice = keyPrice * ethPrice!
  return (
    <div className="bg-muted rounded-lg flex items-center justify-between p-4 bg-amber-100">
      <div>Buy price</div>
      <div className="text-lg font-bold flex items-center gap-1">
        <div>{keyPrice.toFixed(4)} ETH</div>
        <div className="text-sm font-light">(${usdPrice.toFixed(2)})</div>
      </div>
    </div>
  )
}
