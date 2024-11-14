'use client'

import { Dispatch, SetStateAction, useState } from 'react'
import LoadingDots from '@/components/icons/loading-dots'
import { useSiteContext } from '@/components/SiteContext'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCreations } from '@/hooks/useCreations'
import { useWagmiConfig } from '@/hooks/useWagmiConfig'
import { creationFactoryAbi, tipAbi } from '@/lib/abi'
import { addressMap } from '@/lib/address'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { precision } from '@/lib/math'
import { Post } from '@penxio/types'
import { waitForTransactionReceipt } from '@wagmi/core'
import { toast } from 'sonner'
import { zeroAddress } from 'viem'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { CollectionAmountInput } from './CollectionAmountInput'

interface Props {
  isLoading: boolean
  isOpen: boolean
  setState: Dispatch<
    SetStateAction<{
      isLoading: boolean
      isOpen: boolean
    }>
  >
  post: Post
}

export function CollectDialog({ isLoading, isOpen, setState, post }: Props) {
  const [amount, setAmount] = useState('1')
  const { spaceId } = useSiteContext()
  const { refetch } = useCreations(spaceId!)

  let { data: creation } = useReadContract({
    address: addressMap.CreationFactory,
    abi: creationFactoryAbi,
    functionName: 'getCreation',
    args: [BigInt(post.creationId)],
  })

  const { writeContractAsync } = useWriteContract()
  const wagmiConfig = useWagmiConfig()

  async function collect() {
    setState((prev) => ({ ...prev, isLoading: true }))

    try {
      const hash = await writeContractAsync({
        address: addressMap.CreationFactory,
        abi: creationFactoryAbi,
        functionName: 'mint',
        args: [creation!.id, Number(amount), zeroAddress, ''],
        value: BigInt(amount) * creation!.price,
      })

      await waitForTransactionReceipt(wagmiConfig, { hash })

      setTimeout(() => {
        refetch()
      }, 4000)
      setState({
        isLoading: false,
        isOpen: false,
      })
      toast.success('Collect successfully')
    } catch (error) {
      console.log('====error>>>:', error)
      setState((prev) => ({ ...prev, isLoading: false }))

      const msg = extractErrorMessage(error)
      toast.error(msg)
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        setState((prev) => ({ ...prev, isOpen: v }))
      }}
    >
      <DialogContent className="sm:max-w-[400px] grid gap-6">
        <DialogHeader>
          <DialogTitle className="">Collect this post</DialogTitle>
          <DialogDescription>
            You retain ownership of this post even if the author deletes it
            after being collected.
          </DialogDescription>
        </DialogHeader>

        <CollectionAmountInput
          value={amount}
          onChange={(value) => {
            setAmount(value)
          }}
        />

        <div className="flex h-6 items-center justify-between -my-3">
          <div className="text-sm text-foreground/60">Total cost</div>
          {!creation && <div className="text-sm">-</div>}
          {creation && (
            <div className="text-sm">
              {precision.toDecimal(BigInt(amount) * creation!.price).toFixed(6)}{' '}
              ETH
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <Button
            variant="brand"
            size="lg"
            className="w-full flex gap-1"
            disabled={isLoading}
            onClick={collect}
          >
            {isLoading ? (
              <>
                <span className="">Collecting</span>
                <LoadingDots />
              </>
            ) : (
              'Collect'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
