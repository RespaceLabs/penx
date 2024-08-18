import { useMemo, useState } from 'react'
import { useAddress } from '@/hooks/useAddress'
import { useAccount, useBalance } from 'wagmi'
import { useSpaceTokenBalance } from './hooks/useSpaceTokenBalance'
import { precision } from '@/lib/math'
import { Space } from '@/app/~/space/[id]/hooks/useSpace'
import { Buy } from './Buy'
import { Sell } from './Sell'

export const formatAmount = (value: string): string => {
  // Remove leading zeroes and limit decimals
  return value.replace(/^0+(\d)|(\.\d{18})\d+$/, '$1$2')
}

enum Direction {
  buy = 1,
  sell = 2
}

export const Transaction = ({ space }: { space: Space }) => {
  const address = useAddress()
  const { isConnected } = useAccount()
  const { data: balanceData } = useBalance({ address })
  const { isLoading, data: tokenBalance } = useSpaceTokenBalance()
  const [direction, setDirection] = useState<Direction>(Direction.buy)

  const ethBalance = useMemo<string>(() => {
    if(balanceData?.value){
      // Numerical precision issues: precision.toDecimal(tokenBalance).toString() 
      return precision.toExactDecimalString(balanceData?.value)
    }

    return '0.00'
  }, [balanceData])

  const onSwitch = (direction: Direction) => {
    setDirection(direction)
  }

  console.log('%c=tokenBalance', 'color:red', {isConnected,tokenBalance, space })

  return (
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
          className={`py-[6px] px-[16px] rounded-[16px] ${direction === Direction.sell ? 'bg-[#22222212]' : ''
            }`}
        >
          Sell
        </button>
      </div>

      <div style={{
        display: direction === Direction.buy ? 'block': 'none'
      }}>
        <Buy
          tokenBalance={tokenBalance}
          ethBalance={ethBalance}
          isConnected={isConnected}
          space={space}
        />
      </div>

      <div style={{
        display: direction === Direction.sell ? 'block': 'none'
      }}>
      <Sell
        tokenBalance={tokenBalance}
        ethBalance={ethBalance}
        isConnected={isConnected}
        space={space}
      />
      </div>
    </div>
  )
}
