'use client'

import { Creation } from '@/domains/Creation'
import { useBuyPrice } from '@/hooks/useBuyPrice'
import { precision } from '@/lib/math'

interface Props {
  creation: Creation
}

export function KeyPrice({ creation }: Props) {
  const { data, isLoading } = useBuyPrice(creation.id)

  if (isLoading || !data) return <div>-</div>

  const keyPrice = precision.toDecimal(data.priceAfterFee, 6).toFixed(2)
  return (
    <div className="leading-none gap-1 flex items-center justify-center">
      <div>{keyPrice} USDC</div>
    </div>
  )
}
