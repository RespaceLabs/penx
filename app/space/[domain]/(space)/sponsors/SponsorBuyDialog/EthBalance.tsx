'use client'

import { useEthBalance } from '@/hooks/useEthBalance'

export function EthBalance() {
  const { ethBalance } = useEthBalance()

  return (
    <div className="flex items-center gap-2">
      <div>Balance:</div>
      <div className="text-2xl font-bold">
        {ethBalance.valueDecimal.toFixed(5)} ETH
      </div>
    </div>
  )
}
