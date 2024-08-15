'use client'

import { useEffect, useState } from 'react'
import LoadingDots from '@/components/icons/loading-dots'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useKeyBalance } from '@/hooks/useKeyBalance'
import { useSellPrice } from '@/hooks/useSellPrice'
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
import { useSellDialog } from './useSellDialog'
import { useSellKey } from './useSellKey'

interface Props {
  space: RouterOutputs['space']['byId']
  post?: Post
}

export function SellDialog({ space, post }: Props) {
  const isPost = !!post
  const creationId = BigInt(isPost ? post.creationId! : space.creationId!)

  const { isOpen, setIsOpen } = useSellDialog()
  const [amount, setAmount] = useState('1')
  const [price, setPrice] = useState(BigInt(0))
  const sell = useSellKey(space, post)
  const { data, isLoading } = useKeyBalance(creationId)

  const { isPending, mutateAsync } = useMutation({
    mutationKey: ['sell'],
    mutationFn: async () => sell(creationId),
  })

  async function fetchPrice(amount: number) {
    const { priceAfterFee } = await readContract(wagmiConfig, {
      address: addressMap.IndieX,
      abi: indieXAbi,
      functionName: 'getSellPriceAfterFee',
      args: [creationId, amount, INDIE_X_APP_ID],
    })

    setPrice(priceAfterFee)
  }

  useEffect(() => {
    fetchPrice(Number(amount))
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sell Keys</DialogTitle>
        </DialogHeader>

        <div className="flex justify-between">
          <ProfileAvatar showAddress />
          <div className="flex items-center justify-between gap-1">
            <div className="text-lg font-bold">
              {typeof data !== 'undefined' && data!.toString()}
            </div>
            <div className="text-xs">keys</div>
          </div>
        </div>

        <KeyPrice creationId={creationId} />
        <AmountInput
          keyNum={typeof data !== 'undefined' ? data!.toString() : ''}
          value={amount}
          onChange={(v) => {
            if (Number(v) > 0 && Number(v) <= Number(data)) {
              fetchPrice(Number(v))
            }
            setAmount(v)
          }}
        />

        <div className="flex items-center justify-between h-6">
          <div className="text-sm text-neutral-500">Total get</div>
          <div className="text-sm">
            {precision.toDecimal(price).toFixed(5)} ETH
          </div>
        </div>

        <Button
          size="lg"
          disabled={
            Number(data!) < 1 ||
            Number(amount) > Number(data!) ||
            Number(amount) === 0
          }
          onClick={async () => {
            await mutateAsync()
            setIsOpen(false)
          }}
        >
          {isPending ? <LoadingDots color="white" /> : 'Sell Key'}
        </Button>
      </DialogContent>
    </Dialog>
  )
}

function KeyPrice({ creationId }: { creationId: bigint }) {
  const { data, isLoading } = useSellPrice(creationId)

  if (isLoading || !data) return <div>-</div>

  const keyPrice = precision.toDecimal(data.priceAfterFee).toFixed(5)
  return (
    <div className="bg-muted rounded-lg flex items-center justify-between p-4 bg-amber-100">
      <div>Sell price</div>
      <div className="text-lg font-bold flex items-center gap-1">
        <div>{keyPrice} ETH</div>
      </div>
    </div>
  )
}
