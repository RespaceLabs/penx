import { useState } from 'react'
import { useEthBalance } from '@/app/(creator-fi)/hooks/useEthBalance'
import { useSpaceContext } from '@/components/SpaceContext'
import { Button } from '@/components/ui/button'
import { precision } from '@/lib/math'
import { toFloorFixed } from '@/lib/utils'
import { AmountInput } from './AmountInput'
import { BuyBtn } from './BuyBtn'
import { EthBalance } from './EthBalance'
import { SpaceTokenBalance } from './SpaceTokenBalance'

export const BuyPanel = () => {
  const [ethAmount, setEthAmount] = useState<string>('')
  const [tokenAmount, setTokenAmount] = useState<string>('')
  const { ethBalance } = useEthBalance()
  const space = useSpaceContext()

  const isAmountValid = parseFloat(ethAmount) > 0 && parseFloat(tokenAmount) > 0

  const isInsufficientBalance = ethBalance.valueDecimal < parseFloat(ethAmount)

  const handleEthChange = (value: string) => {
    setEthAmount(value)
    if (!value) {
      return setTokenAmount('')
    }

    const tokenAmountDecimal = precision.toDecimal(
      space.getTokenAmount(precision.token(value)),
    )
    setTokenAmount(toFloorFixed(tokenAmountDecimal, 4).toString())
  }

  const handleTokenChange = (value: string) => {}

  const handleMax = () => {
    setEthAmount(toFloorFixed(ethBalance.valueDecimal, 6).toString())

    const tokenAmountDecimal = precision.toDecimal(
      space.getTokenAmount(ethBalance.value),
    )
    setTokenAmount(toFloorFixed(tokenAmountDecimal, 4).toString())
  }

  return (
    <>
      <div className="mb-2 rounded-xl bg-foreground/5 p-4">
        <div className="text-sm">Sell</div>
        <AmountInput
          symbolName="ETH"
          icon={
            <img src="/eth.png" alt="ETH" className="h-auto w-5 rounded-full" />
          }
          value={ethAmount}
          onChange={(value) => handleEthChange(value)}
        />
        <div className="flex h-6 items-center justify-end gap-2">
          <EthBalance></EthBalance>
          <Button
            onClick={handleMax}
            disabled={!ethBalance}
            className="h-6 cursor-pointer rounded-md px-2 text-xs"
          >
            Max
          </Button>
        </div>
      </div>

      <div className="mb-4 rounded-xl bg-foreground/5 p-4">
        <div className="text-sm">Buy</div>
        <AmountInput
          symbolName={space.symbolName}
          disabled
          icon={
            space.logo && (
              <img
                src={space.logo}
                alt={space.symbolName}
                className="h-auto w-5 rounded-2xl"
              />
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
