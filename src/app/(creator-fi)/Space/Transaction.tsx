'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { BuyPanel } from '../SpaceToken/BuyPanel'
import { SellPanel } from '../SpaceToken/SellPanel'

enum Direction {
  buy = 1,
  sell = 2,
}

export function Transaction() {
  const [direction, setDirection] = useState<Direction>(Direction.buy)

  const onSwitch = (direction: Direction) => {
    setDirection(direction)
  }

  return (
    <div className="rounded-2xl bg-background p-4 shadow-sm">
      <div className="rounded-lg">
        <div className="mb-3 flex text-foreground/80">
          <button
            onClick={() => onSwitch(Direction.buy)}
            className={cn(
              'mr-2 rounded-full px-4 py-[6px]',
              direction === Direction.buy && 'bg-foreground/5',
            )}
          >
            Buy
          </button>
          <button
            onClick={() => onSwitch(Direction.sell)}
            className={cn(
              'dark: mr-2 rounded-full px-4 py-[6px]',
              direction === Direction.sell && 'bg-foreground/5',
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
          <BuyPanel />
        </div>

        <div
          style={{
            display: direction === Direction.sell ? 'block' : 'none',
          }}
        >
          <SellPanel />
        </div>
      </div>
    </div>
  )
}
