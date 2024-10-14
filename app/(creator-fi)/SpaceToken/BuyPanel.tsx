import { useState } from 'react'
import { useEthBalance } from '@/app/(creator-fi)/hooks/useEthBalance'
import { useSpace } from '@/app/(creator-fi)/hooks/useSpace'
import { precision } from '@/lib/math'
import { toFloorFixed } from '@/lib/utils'
import { AmountInput } from './AmountInput'
import { BuyBtn } from './BuyBtn'
import { EthBalance } from './EthBalance'
import { SpaceTokenBalance } from './SpaceTokenBalance'
import { Button } from '@/components/ui/button'

interface Props {
  isConnected: boolean
}

export const BuyPanel = ({ isConnected }: Props) => {
  const [ethAmount, setEthAmount] = useState<string>('')
  const [tokenAmount, setTokenAmount] = useState<string>('')
  const { ethBalance } = useEthBalance()
  const { space } = useSpace()

  const isAmountValid = parseFloat(ethAmount) > 0 && parseFloat(tokenAmount) > 0

  const isInsufficientBalance = ethBalance.valueDecimal < parseFloat(ethAmount)

  const handleEthChange = (value: string) => {
    setEthAmount(value)
    if (!value) {
      return setTokenAmount('')
    }

    const tokenAmountDecimal = precision.toDecimal(space.getTokenAmount(precision.token(value)))
    setTokenAmount(toFloorFixed(tokenAmountDecimal, 4).toString())
  }

  const handleTokenChange = (value: string) => {}

  const handleMax = () => {
    setEthAmount(toFloorFixed(ethBalance.valueDecimal, 6).toString())

    const tokenAmountDecimal = precision.toDecimal(space.getTokenAmount(ethBalance.value))
    setTokenAmount(toFloorFixed(tokenAmountDecimal, 4).toString())
  }

  return (
    <>
      <div className="mb-2 rounded-xl bg-gray-100 p-4 dark:bg-zinc-900">
        <div className="text-sm">Sell</div>
        <AmountInput
          symbolName="ETH"
          icon={<img src="/eth.png" alt="ETH" className="h-auto w-5 rounded-full" />}
          value={ethAmount}
          onChange={(value) => handleEthChange(value)}
        />
        <div className="flex h-6 items-center justify-end gap-2">
          <EthBalance></EthBalance>
          <Button
            onClick={handleMax}
            disabled={!ethBalance}
            className="h-6 cursor-pointer rounded-md px-2 text-xs text-white dark:bg-zinc-800"
          >
            Max
          </Button>
        </div>
      </div>

      <div className="mb-4 rounded-xl bg-gray-100 p-4 dark:bg-zinc-900">
        <div className="text-sm">Buy</div>
        <AmountInput
          symbolName={space.symbolName}
          disabled
          icon={
            space.logo && (
              <img src={space.logo} alt={space.symbolName} className="h-auto w-5 rounded-2xl" />
            )
          }
          value={tokenAmount}
          onChange={(value) => handleTokenChange(value)}
        />

        <div className="flex h-6 items-center justify-end gap-2">
          <SpaceTokenBalance />
        </div>
      </div>
      <BuyBtn
        ethAmount={ethAmount}
        tokenAmount={tokenAmount}
        isConnected={isConnected}
        afterSwap={() => {
          setEthAmount('')
          setTokenAmount('')
        }}
        isInsufficientBalance={isInsufficientBalance}
        isAmountValid={isAmountValid}
      />
    </>
  )
}
