'use client'

import { useUsdcBalance } from '@/hooks/useUsdcBalance'

export function UsdcBalance() {
  const { decimal } = useUsdcBalance()

  return (
    <div className="flex items-center gap-2">
      <div>Balance:</div>
      <div className="text-2xl font-bold">{decimal.toFixed(2)} USDC</div>
    </div>
  )
}
