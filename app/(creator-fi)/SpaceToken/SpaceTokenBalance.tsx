'use client'

import { precision } from '@/lib/math'
import { useSpaceTokenBalance } from './hooks/useSpaceTokenBalance'
import { Skeleton } from '@/components/ui/skeleton'
import { IconWallet } from './IconWallet'

export const SpaceTokenBalance = () => {
  const { isLoading, data } = useSpaceTokenBalance()
  if (isLoading) return <Skeleton />

  return (
    <div className="flex items-center gap-1">
      <IconWallet />
      <div className="text-sm text-foreground/60">{precision.toDecimal(data!).toFixed(4)}</div>
    </div>
  )
}
