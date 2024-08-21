'use client'

import { precision } from '@/lib/math'
import { Skeleton } from '../ui/skeleton'
import { useSpaceTokenBalance } from './hooks/useSpaceTokenBalance'

export const SpaceTokenBalance = () => {
  const { isLoading, data } = useSpaceTokenBalance()
  if (isLoading) return <Skeleton></Skeleton>
  return (
    <div className="flex items-center gap-1">
      <span className="i-[iconoir--wallet-solid] w-5 h-5 bg-neutral-400"></span>
      <div className="text-sm text-neutral-500">
        {precision.toDecimal(data!).toFixed(4)}
      </div>
    </div>
  )
}
