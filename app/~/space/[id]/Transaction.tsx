'use client'

import { useEffect, useMemo, useState } from 'react'
import { BuyPanel } from '@/components/spaceToken/BuyPanel'
import { SellPanel } from '@/components/spaceToken/SellPanel'
import { useAddress } from '@/hooks/useAddress'
import { useSpace } from '@/hooks/useSpace'
import { precision } from '@/lib/math'
import { Address } from 'viem'
import { useAccount, useBalance } from 'wagmi'

enum Direction {
  buy = 1,
  sell = 2,
}

export function Transaction() {
  const { space } = useSpace()
  const address = useAddress()
  const { isConnected } = useAccount()
  const [direction, setDirection] = useState<Direction>(Direction.buy)

  const onSwitch = (direction: Direction) => {
    setDirection(direction)
  }

  return (
    <div className="p-4 rounded-lg border border-neutral-100">
      <div className="rounded-lg">
        <div className="flex mb-3">
          <button
            onClick={() => onSwitch(Direction.buy)}
            className={`mr-[10px] text-[#222222] py-[6px] px-[16px] rounded-[16px] ${
              direction === Direction.buy ? 'bg-[#22222212]' : ''
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => onSwitch(Direction.sell)}
            className={`py-[6px] px-[16px] rounded-[16px] ${
              direction === Direction.sell ? 'bg-[#22222212]' : ''
            }`}
          >
            Sell
          </button>
        </div>

        <div
          style={{
            display: direction === Direction.buy ? 'block' : 'none',
          }}
        >
          <BuyPanel isConnected={isConnected} space={space} />
        </div>

        <div
          style={{
            display: direction === Direction.sell ? 'block' : 'none',
          }}
        >
          <SellPanel isConnected={isConnected} space={space} />
        </div>
      </div>
    </div>
  )
}
