'use client'

import { Badge } from '@/components/ui/badge'
import { UserAvatar } from '@/components/UserAvatar'
import { SECONDS_PER_DAY } from '@/domains/Space'
import { useSpaceTrades } from '@/hooks/useSpaceTrades'
import { precision } from '@/lib/math'
import { cn, getEnsAvatar, shortenAddress } from '@/lib/utils'
import { Space } from '@prisma/client'

interface Props {
  space: Space
}

export function SpaceTradeList({ space }: Props) {
  const { trades } = useSpaceTrades(space.id)

  return (
    <div className="space-y-3 mt-4">
      {trades.map((item) => (
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
                item.type === 'BUY' && 'bg-green-500',
                item.type === 'SELL' && 'bg-red-500',
              )}
            >
              {item.type === 'BUY' ? 'Subscribe' : 'Unsubscribe'}
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
