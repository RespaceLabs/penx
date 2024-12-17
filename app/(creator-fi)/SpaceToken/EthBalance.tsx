'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { useEthBalance } from '@/app/(creator-fi)/hooks/useEthBalance'
import { IconWallet } from './IconWallet'

export const EthBalance = () => {
  const { ethBalance } = useEthBalance()
  if (!ethBalance.valueDecimal) return <Skeleton />
  return (
    <div className="flex items-center gap-1">
      <IconWallet />
      <div className="text-sm text-foreground/60">{ethBalance.valueFormatted}</div>
    </div>
  )
}
