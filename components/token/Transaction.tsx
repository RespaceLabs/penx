import { ChangeEvent, useMemo, useState } from 'react'
import { useAddress } from '@/hooks/useAddress'
import { remirrorTokenAbi } from '@/lib/abi'
import { addressMap } from '@/lib/address'
import { precision } from '@/lib/math'
import { wagmiConfig } from '@/lib/wagmi'
import { readContract } from '@wagmi/core'
import { useDebouncedCallback } from 'use-debounce'
import { useAccount, useBalance } from 'wagmi'
import { Button } from '../ui/button'
import { BuyTokenButton } from './BuyTokenButton'
import { useRemirrorBalance } from './hooks/useRemirrorBalance'

const formatAmount = (value: string): string => {
  // Remove leading zeroes and limit decimals
  return value.replace(/^0+(\d)|(\.\d{18})\d+$/, '$1$2')
}

export const Transaction = () => {
  const address = useAddress()
  const { isConnected } = useAccount()
  const { data: balanceData } = useBalance({ address })
  const [ethAmount, setEthAmount] = useState<string>('0')
  const [purchasedAmount, setPurchasedAmount] = useState<string>('0')
  const { isLoading, data: remirrorBalance } = useRemirrorBalance()

  const ethBalance = useMemo<string>(() => {
    return balanceData?.value
      ? precision.toDecimal(balanceData.value).toString()
      : '0.00'
  }, [balanceData])

  const calculatepurchasedAmount = useDebouncedCallback(
    async (value: number) => {
      const amount = await readContract(wagmiConfig, {
        address: addressMap.RemirrorToken,
        abi: remirrorTokenAbi,
        functionName: 'getTokenAmount',
        args: [precision.token(value, 18)],
      })

      const decimalAmount = precision.toDecimal(amount)
      if (!ethAmount || !decimalAmount) {
        setPurchasedAmount('')
      } else {
        setPurchasedAmount(decimalAmount.toString())
      }
    },
    400,
  )

  const validateAndSetEthAmount = (value: string) => {
    // Validate and format input
    if (/^\d*\.?\d*$/.test(value) && !value.startsWith('.')) {
      const formattedValue = formatAmount(value)
      setEthAmount(formattedValue)
      calculatepurchasedAmount(formattedValue ? parseFloat(formattedValue) : 0)
    }
  }

  const validateAndsetPurchasedAmount = (value: string) => {
    // Validate and format input
    if (/^\d*\.?\d*$/.test(value) && !value.startsWith('.')) {
      // const formattedValue = formatAmount(value)
      // TODO: setPurchasedAmount
      // setPurchasedAmount(formattedValue)
      // TODO: setEthAmount
      // setEthAmount(
      //   formattedValue
      //     ? (parseFloat(formattedValue) / ETH_TO_BTC_RATE).toFixed(18)
      //     : '',
      // )
    }
  }

  const handleMaxClick = () => {
    setEthAmount(ethBalance)
    calculatepurchasedAmount(Number(ethBalance))
  }

  const isInsufficientBalance = parseFloat(ethAmount) > parseFloat(ethBalance)
  const isAmountValid =
    parseFloat(ethAmount) > 0 && parseFloat(purchasedAmount) > 0

  return (
    <div className="rounded-lg">
      <h2 className="text-xl mb-2 font-[600]">Buy Remirror</h2>
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
            onClick={handleMaxClick}
            className="h-[20px] text-white px-[4px] rounded ml-2"
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
          <span className="text-[18px]">Remirror</span>
        </div>
        <div className="text-right text-[#222222]">
          Balance:{' '}
          {remirrorBalance
            ? precision.toDecimal(remirrorBalance).toFixed(4)
            : '0.00'}
        </div>
      </div>
      <BuyTokenButton
        ethAmount={ethAmount}
        purchasedAmount={purchasedAmount}
        isConnected={isConnected}
        handleSwap={() => {
          setEthAmount('')
          setPurchasedAmount('')
        }}
        isInsufficientBalance={isInsufficientBalance}
        isAmountValid={isAmountValid}
      />
    </div>
  )
}
