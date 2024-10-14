'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { UserAvatar } from '@/components/UserAvatar'
import { useSpace } from '@/app/(creator-fi)/hooks/useSpace'
import { useTrades } from '@/app/(creator-fi)/hooks/useTrades'
import { precision } from '@/lib/math'
import { cn, shortenAddress } from '@/lib/utils'
import { TradeType } from '../constants'

interface Props {}

export function TradeList({}: Props) {
  const { space } = useSpace()
  const { trades, isLoading } = useTrades()

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

  if (!trades?.length) {
    return <div className="text-neutral-500">No trades yet!</div>
  }

  return (
    <div className="mt-4 space-y-3">
      {trades.map((item) => (
        <div key={item.id} className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-2">
            <UserAvatar address={item.account} className="h-6 w-6" />
            <div className="text-sm">{shortenAddress(item.account)}</div>
          </div>
          <div>
            <div
              className={cn(
                item.type === TradeType.BUY && 'text-green-500',
                item.type === TradeType.SELL && 'text-red-500'
              )}
            >
              {item.type === TradeType.BUY ? 'bought' : 'sold'}
            </div>
          </div>
          <div>
            <span className="font-bold">
              {precision
                .toDecimal(item.type === TradeType.BUY ? item.tokenAmount : item.ethAmount)
                .toFixed(2)}{' '}
            </span>
            <span>{space.symbolName}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
