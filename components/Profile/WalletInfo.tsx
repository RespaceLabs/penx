'use client'

import { useQueryEthBalance } from '@/hooks/useEthBalance'
import { useQueryUsdcBalance } from '@/hooks/useUsdcBalance'
import { precision } from '@/lib/math'
import { Skeleton } from '../ui/skeleton'

export function WalletInfo() {
  const { data, isLoading } = useQueryEthBalance()
  const { data: usdcValue, isLoading: loadingUSDC } = useQueryUsdcBalance()

  if (isLoading || loadingUSDC) {
    return <Skeleton className="h-10" />
  }

  return (
    <div className="flex flex-col text-xl font-bold  items-start">
      <div>
        {typeof data !== 'undefined' &&
          `${precision.toDecimal(data.value).toFixed(5)} ETH`}
      </div>

      <div>
        {typeof data !== 'undefined' &&
          `${precision.toDecimal(usdcValue!, 6).toFixed()} USDC`}
      </div>
    </div>
  )
}
