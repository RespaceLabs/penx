'use client'

import { Badge } from '@/components/ui/badge'
import { UserAvatar } from '@/components/UserAvatar'
import { PostWithSpace } from '@/hooks/usePost'
import { usePostTrades } from '@/hooks/usePostTrades'
import { precision } from '@/lib/math'
import { cn, getEnsAvatar, shortenAddress } from '@/lib/utils'

interface Props {
  post: PostWithSpace
}

export function PostTradeList({ post }: Props) {
  const { trades } = usePostTrades(post.id)

  return (
    <div className="space-y-3 mt-4">
      {trades.map((item) => (
        <div key={item.id} className="flex items-center gap-2">
          <div className="flex gap-2 items-center">
            <UserAvatar className="w-7 h-7" user={item.user as any} />
            <div>{item.user.ensName || shortenAddress(item.user.address)}</div>
          </div>
          <div>
            <Badge
              className={cn(
                item.type === 'BUY' && 'bg-green-500',
                item.type === 'SELL' && 'bg-red-500',
              )}
            >
              {item.type === 'BUY' ? 'Bought' : 'Sold'}
            </Badge>
          </div>
          <div>
            <span className="font-bold">{item.amount}</span> keys
          </div>
          /
          <div>
            <span className="font-bold">
              {precision.toDecimal(BigInt(item.price), 6)}
            </span>{' '}
            USDC
          </div>
        </div>
      ))}
    </div>
  )
}
