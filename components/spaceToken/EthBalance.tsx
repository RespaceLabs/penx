'use client'

import { useEthBalance } from '@/hooks/useEthBalance'
import { Skeleton } from '../ui/skeleton'

export const EthBalance = () => {
  const { ethBalance } = useEthBalance()
  if (!ethBalance.valueDecimal) return <Skeleton></Skeleton>
  return (
    <div className="flex items-center gap-1">
      <span className="i-[iconoir--wallet-solid] w-5 h-5 bg-neutral-400"></span>
      <div className="text-sm text-neutral-500">
        {ethBalance.valueFormatted}
      </div>
    </div>
  )
}
