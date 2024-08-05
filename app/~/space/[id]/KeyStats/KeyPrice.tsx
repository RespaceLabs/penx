'use client'

import { Creation } from '@/domains/Creation'
import { useBuyPrice } from '@/hooks/useBuyPrice'
import { useEthPrice } from '@/hooks/useEthPrice'
import { precision } from '@/lib/math'

interface Props {
  creation: Creation
}

export function KeyPrice({ creation }: Props) {
  const { data, isLoading } = useBuyPrice(creation.id)
  const { ethPrice } = useEthPrice()

  if (isLoading || !data) return <div>-</div>

  const keyPrice = precision.toDecimal(data.priceAfterFee)
  const usdPrice = keyPrice * ethPrice!
  return (
    <div className="leading-none gap-1 flex items-center justify-center">
      <div>{keyPrice.toFixed(4)} ETH</div>
      <div className="text-sm font-light">${usdPrice.toFixed(2)}</div>
    </div>
  )
}
