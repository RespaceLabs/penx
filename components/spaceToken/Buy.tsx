import { ChangeEvent, useMemo, useState } from 'react'
import { Space } from '@/app/~/space/[id]/hooks/useSpace'
import { Button } from '../ui/button'
import { BuyBtn } from './BuyBtn'
import { precision } from '@/lib/math'
import { formatAmount } from './Transaction'
import { useTokenKxy } from '@/hooks/useTokenKxy'

interface Props {
  ethBalance: string
  tokenBalance: bigint | undefined
  isConnected: boolean
  space: Space
}

export const Buy = ({ space, ethBalance, tokenBalance, isConnected }: Props) => {
  const [ethAmount, setEthAmount] = useState<string>('0')
  const [purchasedAmount, setPurchasedAmount] = useState<string>('0')
  const { updateTokenKxy, getBuyTokenAmount } = useTokenKxy()

  const isAmountValid =
    parseFloat(ethAmount) > 0 && parseFloat(purchasedAmount) > 0

  const isInsufficientBalance = parseFloat(ethAmount) > parseFloat(ethBalance)

  const validateAndSetEthAmount = (value: string) => {
    // Validate and format input
    if (/^\d*\.?\d*$/.test(value) && !value.startsWith('.')) {
      const formattedValue = formatAmount(value)
      setEthAmount(formattedValue)
      const decimalAmount = getBuyTokenAmount(precision.toExactDecimalBigint(value))
      if (!ethAmount || !decimalAmount) {
        setPurchasedAmount('')
      } else {
        setPurchasedAmount(precision.toExactDecimalString(decimalAmount))
      }
    }
  }

  const validateAndsetPurchasedAmount = (value: string) => {
    // Validate and format input
    // if (/^\d*\.?\d*$/.test(value) && !value.startsWith('.')) { }
  }

  const handleMax = () => {
    setEthAmount(ethBalance)
    const decimalAmount = getBuyTokenAmount(precision.toExactDecimalBigint(ethBalance))
    if (!ethAmount || !decimalAmount) {
      setPurchasedAmount('')
    } else {
      setPurchasedAmount(precision.toExactDecimalString(decimalAmount))
    }
  }

  const displayBalance = useMemo(() => {
    if (tokenBalance) {
      return precision.toExactDecimalString(tokenBalance)
    }

    return '0.0000'
  }, [tokenBalance]);

  return <>
    <div className="mb-2 bg-gray-100 rounded-[16px] p-[16px] border border-transparent hover:border-[#18181b] transition-colors duration-300">
      <div className="text-[12px]">Sell</div>
      <div className="flex font-[600] items-center gap-1">
        <input
          type="text"
          value={ethAmount}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            validateAndSetEthAmount(e.target.value)
          }
          placeholder="Amount in ETH"
          className="p-2 font-[600] text-[24px] text-[#222222] pl-0 bg-gray-100 rounded w-full border-none focus:border-none outline-none"
        />
        <img src="/eth.png" alt="ETH" className="w-[20px] h-auto" />
        <span className="text-[18px]">ETH</span>
      </div>
      <div className="text-right text-[#222222]">
        Balance: {ethBalance}
        <Button
          onClick={handleMax}
          disabled={!ethBalance}
          className="h-[20px] cursor-pointer text-white px-[4px] rounded ml-2"
        >
          Max
        </Button>
      </div>
    </div>

    <div className="mb-4 bg-gray-100 rounded-[16px] p-[16px] border border-transparent hover:border-[#18181b] transition-colors duration-300">
      <div className="text-[12px]">Buy</div>
      <div className="flex font-[600] items-center gap-1">
        <input
          type="text"
          value={purchasedAmount}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            validateAndsetPurchasedAmount(e.target.value)
          }
          placeholder="Amount in PenX"
          className="p-2 font-[500] text-[24px] text-[#222222] pl-0 bg-gray-100 rounded w-full border-none focus:border-none outline-none"
        />
        <img
          src="https://cryptologos.cc/logos/bitcoin-btc-logo.png"
          alt="PenX"
          className="w-[20px] h-auto"
        />
        <span className="text-[18px]">{space?.name}</span>
      </div>
      <div className="text-right text-[#222222]">
        Balance: {displayBalance}
      </div>
    </div>
    <BuyBtn
      ethAmount={ethAmount}
      purchasedAmount={purchasedAmount}
      isConnected={isConnected}
      handleSwap={() => {
        setEthAmount('')
        setPurchasedAmount('')
        updateTokenKxy(space.spaceAddress as Address)
      }}
      isInsufficientBalance={isInsufficientBalance}
      isAmountValid={isAmountValid}
      space={space}
    />
  </>
}