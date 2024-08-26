'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { UserAvatar } from '@/components/UserAvatar'
import { useSpace } from '@/hooks/useSpace'
import { useTrades } from '@/hooks/useTrades'
import { TradeType } from '@/lib/constants'
import { precision } from '@/lib/math'
import { cn } from '@/lib/utils'

interface Props {}

export function TradeList({}: Props) {
  const { space } = useSpace()
  const { trades: trades, isLoading } = useTrades()

  if (isLoading) {
    return (
      <div className="grid gap-3 mt-4">
        {Array(10)
          .fill(null)
          .map((_, index) => (
            <Skeleton key={index} className="h-6" />
          ))}
      </div>
    )
  }

  if (!trades?.length) {
    return <div className="text-neutral-500">No trades yet!</div>
  }

  return (
    <div className="space-y-3 mt-4">
      {trades.map((item) => (
        <div key={item.id} className="flex items-center gap-2 text-sm">
          <div className="flex gap-2 items-center">
            <UserAvatar className="w-6 h-6" user={item.user as any} />
            <div className="text-sm">
              {item.user.ensName
                ? item.user.ensName
                : item.user.address.slice(0, 5)}
            </div>
          </div>
          <div>
            <div
              className={cn(
                item.type === TradeType.BUY && 'text-green-500',
                item.type === TradeType.SELL && 'text-red-500',
              )}
            >
              {item.type === TradeType.BUY ? 'bought' : 'sold'}
            </div>
          </div>
          <div>
            <span className="font-bold">
              {precision
                .toDecimal(
                  item.type === TradeType.BUY ? item.amountOut : item.amountIn,
                )
                .toFixed(2)}{' '}
            </span>
            <span>{space.symbolName}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
