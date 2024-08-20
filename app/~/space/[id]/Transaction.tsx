'use client'

import { useEffect, useMemo, useState } from 'react';
import { useAddress } from '@/hooks/useAddress';
import { useTokenKxy } from '@/hooks/useTokenKxy';
import { precision } from '@/lib/math';
import { Address } from 'viem';
import { useAccount, useBalance } from 'wagmi';
import { useSpace } from "@/hooks/useSpace"
import { useSpaceTokenBalance } from '@/components/spaceToken/hooks/useSpaceTokenBalance';
import { Buy } from '@/components/spaceToken/Buy';
import { Sell } from '@/components/spaceToken/Sell';

enum Direction {
  buy = 1,
  sell = 2
}

export function Transaction() {
  const { space } = useSpace()
  const address = useAddress()
  const { isConnected } = useAccount()
  const { data: balanceData } = useBalance({ address })
  const { isLoading, data: tokenBalance } = useSpaceTokenBalance()
  const [direction, setDirection] = useState<Direction>(Direction.buy)
  const { updateTokenKxy } = useTokenKxy()

  const ethBalance = useMemo<string>(() => {
    if (balanceData?.value) {
      // Numerical precision issues: precision.toDecimal(tokenBalance).toString() 
      return precision.toExactDecimalString(balanceData?.value)
    }

    return '0.00'
  }, [balanceData])

  const onSwitch = (direction: Direction) => {
    setDirection(direction)
  }

  useEffect(() => {
    if (space) {
      updateTokenKxy(space.spaceAddress as Address)
    }
  }, [space])

  return (
    <div className="w-[350px]">
      <div className="rounded-lg">
        <div className='flex mb-[12px]'>
          <button
            onClick={() => onSwitch(Direction.buy)}
            className={`mr-[10px] text-[#222222] py-[6px] px-[16px] rounded-[16px] ${direction === Direction.buy ? 'bg-[#22222212]' : ''
              }`}
          >
            Buy
          </button>
          <button
            onClick={() => onSwitch(Direction.sell)}
            className={`py-[6px] px-[16px] rounded-[16px] ${direction === Direction.sell ? 'bg-[#22222212]' : '' }`}
          >
            Sell
          </button>
        </div>

        <div style={{
          display: direction === Direction.buy ? 'block' : 'none'
        }}>
          <Buy
            tokenBalance={tokenBalance}
            ethBalance={ethBalance}
            isConnected={isConnected}
            space={space}
          />
        </div>

        <div style={{
          display: direction === Direction.sell ? 'block' : 'none'
        }}>
          <Sell
            tokenBalance={tokenBalance}
            ethBalance={ethBalance}
            isConnected={isConnected}
            space={space}
          />
        </div>
      </div>
    </div>
  )
}
