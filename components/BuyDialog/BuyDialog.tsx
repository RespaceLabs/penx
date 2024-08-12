'use client'

import { useEffect, useState } from 'react'
import LoadingDots from '@/components/icons/loading-dots'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCreation } from '@/hooks/useCreation'
import { useEthBalance, useQueryEthBalance } from '@/hooks/useEthBalance'
import { indieXAbi } from '@/lib/abi'
import { addressMap } from '@/lib/address'
import { INDIE_X_APP_ID } from '@/lib/constants'
import { precision } from '@/lib/math'
import { wagmiConfig } from '@/lib/wagmi'
import { RouterOutputs } from '@/server/_app'
import { Post } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import { readContract } from '@wagmi/core'
import { ProfileAvatar } from '../Profile/ProfileAvatar'
import { AmountInput } from './AmountInput'
import { useBuyDialog } from './useBuyDialog'
import { useBuyKey } from './useBuyKey'

interface Props {
  space: RouterOutputs['space']['byId']
  post?: Post
}

export function BuyDialog({ space, post }: Props) {
  const isPost = !!post
  const creationId = BigInt(isPost ? post.creationId! : space.creationId!)

  const { isOpen, setIsOpen } = useBuyDialog()
  useQueryEthBalance()
  const [amount, setAmount] = useState('1')
  const [price, setPrice] = useState(BigInt(0))

  async function fetchPrice(amount: number) {
    const { priceAfterFee } = await readContract(wagmiConfig, {
      address: addressMap.IndieX,
      abi: indieXAbi,
      functionName: 'getBuyPriceAfterFee',
      args: [creationId, amount, INDIE_X_APP_ID],
    })

    setPrice(priceAfterFee)
  }

  useEffect(() => {
    fetchPrice(Number(amount))
  }, [])

  const buy = useBuyKey(space, post)

  const { isPending, mutateAsync } = useMutation({
    mutationKey: ['buy'],
    mutationFn: async () => buy(creationId, Number(amount)),
  })

  const { creation } = useCreation()
  if (!creation) return null

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent className="sm:max-w-[425px] grid gap-4">
        <DialogHeader>
          <DialogTitle>Buy Keys</DialogTitle>
          <div className="text-sm text-neutral-600">
            Buy key to become a member of the{' '}
            <span className="font-bold">{space.name}</span> space.
          </div>
        </DialogHeader>

        <div className="flex justify-between">
          <ProfileAvatar showAddress />
          <EthBalance />
        </div>

        <AmountInput
          value={amount}
          onChange={(v) => {
            fetchPrice(Number(v))
            setAmount(v)
          }}
        />

        <div className="flex items-center justify-between h-6">
          <div className="text-sm text-neutral-500">Total cost</div>
          <div className="text-sm">
            {precision.toDecimal(price).toFixed(5)} ETH
          </div>
        </div>

        <Button
          size="lg"
          disabled={isPending || Number(amount) < 1}
          onClick={async () => {
            await mutateAsync()
            setIsOpen(false)
          }}
        >
          {isPending ? <LoadingDots color="white" /> : 'Buy Key'}
        </Button>
      </DialogContent>
    </Dialog>
  )
}

function EthBalance() {
  const { ethBalance } = useEthBalance()
  return (
    <div className="flex items-center gap-1">
      <div className="font-bold">{ethBalance.valueDecimal.toFixed(5)}</div>
      <div className="text-xs">ETH</div>
    </div>
  )
}
