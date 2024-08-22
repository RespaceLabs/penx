import { useState } from 'react'
import { useChainSpace, useQueryChainSpace } from '@/hooks/useChainSpace'
import { precision } from '@/lib/math'
import { toFloorFixed } from '@/lib/utils'
import { Space } from '@prisma/client'
import { Button } from '../ui/button'
import { AmountInput } from './AmountInput'
import { EthBalance } from './EthBalance'
import { useSpaceTokenBalance } from './hooks/useSpaceTokenBalance'
import { SellBtn } from './SellBtn'
import { SpaceTokenBalance } from './SpaceTokenBalance'

interface Props {
  isConnected: boolean
  space: Space
}

export const SellPanel = ({ space, isConnected }: Props) => {
  const [ethAmount, setEthAmount] = useState<string>('')
  const [tokenAmount, setTokenAmount] = useState<string>('')
  const { space: chainSpace } = useChainSpace()
  const { refetch: refetchChainSpace } = useQueryChainSpace()
  const { data: tokenBalance } = useSpaceTokenBalance()

  const isAmountValid = parseFloat(tokenAmount) > 0

  const isInsufficientBalance =
    precision.toDecimal(tokenBalance! || '0') < parseFloat(tokenAmount)

  const handleEthAmount = (value: string) => {}

  const handleTokenChange = (value: string) => {
    setTokenAmount(value)
    if (!value) {
      return setEthAmount('')
    }

    const ethAmountDecimal = precision.toDecimal(
      chainSpace.getEthAmount(precision.token(value)),
    )
    setEthAmount(toFloorFixed(ethAmountDecimal, 4).toString())
  }

  const handleMax = () => {
    if (!tokenBalance) return

    setTokenAmount(
      toFloorFixed(precision.toDecimal(tokenBalance), 4).toString(),
    )

    const ethAmountDecimal = precision.toDecimal(
      chainSpace.getEthAmount(tokenBalance),
    )

    setEthAmount(toFloorFixed(ethAmountDecimal, 4).toString())
  }

  return (
    <>
      <div className="mb-2 bg-gray-100 rounded-xl p-4">
        <div className="text-sm">Sell</div>

        <AmountInput
          symbolName={space.symbolName}
          icon={
            <img
              src={space.logo || ''}
              alt={space.symbolName}
              className="w-5 h-auto rounded-full"
            />
          }
          value={tokenAmount}
          onChange={(value) => handleTokenChange(value)}
        />

        <div className="flex items-center justify-end gap-2 h-6">
          <SpaceTokenBalance />
          <Button
            onClick={handleMax}
            disabled={
              typeof tokenBalance === undefined ||
              precision.toDecimal(tokenBalance!) <= 0
            }
            className="h-6 cursor-pointer text-xs text-white rounded-md px-2"
          >
            Max
          </Button>
        </div>
      </div>

      <div className="mb-4 bg-gray-100 rounded-xl p-4">
        <div className="text-sm">Buy</div>

        <AmountInput
          symbolName="ETH"
          disabled
          icon={
            <img src="/eth.png" alt="ETH" className="w-5 h-auto rounded-full" />
          }
          value={ethAmount}
          onChange={(value) => handleEthAmount(value)}
        />
        <div className="flex items-center justify-end gap-2 h-6">
          <EthBalance />
        </div>
      </div>

      <SellBtn
        ethAmount={ethAmount}
        tokenAmount={tokenAmount}
        isConnected={isConnected}
        handleSwap={() => {
          setEthAmount('')
          setTokenAmount('')
          refetchChainSpace()
        }}
        isInsufficientBalance={isInsufficientBalance}
        isAmountValid={isAmountValid}
        space={space}
      />
    </>
  )
}
