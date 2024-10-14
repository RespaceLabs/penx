'use client'

import { useState } from 'react'
import { useSpace } from '@/app/(creator-fi)/hooks/useSpace'
import { useAccount } from 'wagmi'
import { BuyPanel } from '../SpaceToken/BuyPanel'
import { SellPanel } from '../SpaceToken/SellPanel'
import { cn } from '@/lib/utils'

enum Direction {
  buy = 1,
  sell = 2,
}

export function Transaction() {
  const { isConnected } = useAccount()
  const [direction, setDirection] = useState<Direction>(Direction.buy)

  const onSwitch = (direction: Direction) => {
    setDirection(direction)
  }

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-zinc-950/50">
      <div className="rounded-lg">
        <div className="mb-3 flex  text-neutral-800 dark:text-zinc-100">
          <button
            onClick={() => onSwitch(Direction.buy)}
            className={cn(
              'mr-2 rounded-full px-4 py-[6px]',
              direction === Direction.buy && 'bg-gray-100 dark:bg-zinc-800'
            )}
          >
            Buy
          </button>
          <button
            onClick={() => onSwitch(Direction.sell)}
            className={cn(
              'dark: mr-2 rounded-full px-4 py-[6px]',
              direction === Direction.sell && 'bg-gray-100 dark:bg-zinc-800'
            )}
          >
            Sell
          </button>
        </div>

        <div
          style={{
            display: direction === Direction.buy ? 'block' : 'none',
          }}
        >
          <BuyPanel isConnected={isConnected} />
        </div>

        <div
          style={{
            display: direction === Direction.sell ? 'block' : 'none',
          }}
        >
          <SellPanel isConnected={isConnected} />
        </div>
      </div>
    </div>
  )
}
