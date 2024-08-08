'use client'

import { useState } from 'react'
import LoadingDots from '@/components/icons/loading-dots'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAddress } from '@/hooks/useAddress'
import { useQueryUsdcBalance } from '@/hooks/useUsdcBalance'
import { usdcAbi } from '@/lib/abi/indieX'
import { addressMap } from '@/lib/address'
import { precision } from '@/lib/math'
import { wagmiConfig } from '@/lib/wagmi'
import { waitForTransactionReceipt } from '@wagmi/core'
import { toast } from 'sonner'
import { useWriteContract } from 'wagmi'
import { USDCBalance } from './USDCBalance'

export function Faucet() {
  const [value, setValue] = useState('1000')
  const address = useAddress()
  const { writeContractAsync, isPending } = useWriteContract()
  const { refetch } = useQueryUsdcBalance()
  return (
    <div className="flex flex-col items-center justify-center gap-4 w-64">
      <div className="font-bold text-lg">USDC amount</div>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="text-center w-full"
      />
      <Button
        className="w-full"
        size="lg"
        onClick={async () => {
          try {
            const hash = await writeContractAsync({
              address: addressMap.USDC,
              abi: usdcAbi,
              functionName: 'mint',
              args: [address, precision.token(value, 6)],
            })

            await waitForTransactionReceipt(wagmiConfig, { hash })
            refetch()
            toast.success('Successfully minted USDC')
          } catch (error) {
            toast.error('Failed to mint USDC')
          }
        }}
      >
        {isPending ? <LoadingDots color="white" /> : 'Get Mock USDC'}
      </Button>
      <USDCBalance></USDCBalance>
    </div>
  )
}
