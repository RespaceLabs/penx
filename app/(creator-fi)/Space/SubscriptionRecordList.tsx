'use client'

import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { UserAvatar } from '@/components/UserAvatar'
import { Space } from '@/app/(creator-fi)/domains/Space'
import { useSubscriptionRecords } from '@/app/(creator-fi)/hooks/useSubscriptionRecords'
import { cn } from '@/lib/utils'
import { SECONDS_PER_DAY, SubscriptionType } from '../constants'

interface Props {
  space: Space
}

export function SubscriptionRecordList({ space }: Props) {
  const { records, isLoading } = useSubscriptionRecords()

  if (isLoading) {
    return (
      <div className="mt-4 grid gap-3">
        {Array(10)
          .fill(null)
          .map((_, index) => (
            <Skeleton key={index} className="h-9" />
          ))}
      </div>
    )
  }

  return (
    <div className="mt-4 space-y-3">
      {records.map((item) => (
        <div key={item.id} className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <UserAvatar address={item.account} />
          </div>
          <div>
            <Badge
              className={cn(
                item.type === SubscriptionType.SUBSCRIBE && 'bg-green-500',
                item.type === SubscriptionType.UNSUBSCRIBE && 'bg-red-500'
              )}
            >
              {item.type === SubscriptionType.SUBSCRIBE ? 'Subscribe' : 'Unsubscribe'}
            </Badge>
          </div>
          <div>
            <span className="font-bold">
              {(Number(item.duration) / Number(SECONDS_PER_DAY)).toFixed(2)} days
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
