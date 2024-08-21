'use client'

import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { UserAvatar } from '@/components/UserAvatar'
import { SECONDS_PER_DAY } from '@/domains/Space'
import { useSubscriptionRecords } from '@/hooks/useSpaceTrades'
import { SubscriptionType } from '@/lib/constants'
import { cn, getEnsAvatar, shortenAddress } from '@/lib/utils'
import { Space } from '@prisma/client'

interface Props {
  space: Space
}

export function SubscriptionRecordList({ space }: Props) {
  const { records, isLoading } = useSubscriptionRecords(space.id)

  if (isLoading) {
    return (
      <div className="grid gap-3 mt-4">
        {Array(10)
          .fill(null)
          .map((_, index) => (
            <Skeleton key={index} className="h-9" />
          ))}
      </div>
    )
  }

  return (
    <div className="space-y-3 mt-4">
      {records.map((item) => (
        <div key={item.id} className="flex items-center gap-2">
          <div className="flex gap-2 items-center">
            <UserAvatar user={item.user as any} />
            <div>
              {item.user.ensName
                ? item.user.ensName
                : shortenAddress(item.user.address)}
            </div>
          </div>
          <div>
            <Badge
              className={cn(
                item.type === SubscriptionType.SUBSCRIBE && 'bg-green-500',
                item.type === SubscriptionType.UNSUBSCRIBE && 'bg-red-500',
              )}
            >
              {item.type === SubscriptionType.SUBSCRIBE
                ? 'Subscribe'
                : 'Unsubscribe'}
            </Badge>
          </div>
          <div>
            <span className="font-bold">
              {(item.duration / Number(SECONDS_PER_DAY)).toFixed(2)} days
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
