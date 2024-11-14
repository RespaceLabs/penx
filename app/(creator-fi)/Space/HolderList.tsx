'use client'

import { useHolders } from '@/app/(creator-fi)/hooks/useHolders'
import { useSpaceContext } from '@/components/SpaceContext'
import { Skeleton } from '@/components/ui/skeleton'
import { UserAvatar } from '@/components/UserAvatar'
import { precision } from '@/lib/math'
import { cn, shortenAddress } from '@/lib/utils'

interface Props {}

export function HolderList({}: Props) {
  const space = useSpaceContext()
  const { holders, isLoading } = useHolders()

  if (isLoading) {
    return (
      <div className="mt-4 grid gap-3">
        {Array(10)
          .fill(null)
          .map((_, index) => (
            <Skeleton key={index} className="h-6" />
          ))}
      </div>
    )
  }

  if (!holders?.length) {
    return <div className="text-foreground/60">No trades yet!</div>
  }

  return (
    <div className="mt-4 space-y-3">
      {holders.map((item) => (
        <div key={item.id} className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-2">
            <UserAvatar address={item.account} className="h-6 w-6" />
            <div className="text-sm">{shortenAddress(item.account)}</div>
          </div>
          <div className="flex gap-1">
            <span className="font-bold">
              {precision.toDecimal(item.balance).toFixed(2)}
            </span>
            {space.symbolName}
          </div>
        </div>
      ))}
    </div>
  )
}
