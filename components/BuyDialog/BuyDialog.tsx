'use client'

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
import { useBuyPrice } from '@/hooks/useBuyPrice'
import { useCreation } from '@/hooks/useCreation'
import { useEthBalance, useQueryEthBalance } from '@/hooks/useEthBalance'
import { useEthPrice } from '@/hooks/useEthPrice'
import { useQueryUsdcBalance, useUsdcBalance } from '@/hooks/useUsdcBalance'
import { precision } from '@/lib/math'
import { RouterOutputs } from '@/server/_app'
import { Post } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import { ProfileAvatar } from '../Profile/ProfileAvatar'
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
  useQueryUsdcBalance()

  const buy = useBuyKey(space, post)

  const { isPending, mutateAsync } = useMutation({
    mutationKey: ['buy'],
    mutationFn: async () => buy(creationId),
  })

  const { creation } = useCreation()
  if (!creation) return null

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Buy Keys</DialogTitle>
          <div className="text-sm text-neutral-600">
            Buy a key to become a member of the{' '}
            <span className="font-bold">{space.name}</span> space.
          </div>
        </DialogHeader>

        <ProfileAvatar showAddress />

        <USDCBalance />
        <KeyPrice creationId={creationId} />

        <Button
          size="lg"
          onClick={async () => {
            await mutateAsync()
            setIsOpen(false)
          }}
        >
          {isPending ? <LoadingDots color="white" /> : 'Buy a Key'}
        </Button>
      </DialogContent>
    </Dialog>
  )
}

function KeyPrice({ creationId }: { creationId: bigint }) {
  const { data, isLoading } = useBuyPrice(creationId)

  if (isLoading || !data) return <div>-</div>

  const keyPrice = precision.toDecimal(data.priceAfterFee, 6).toFixed(2)
  return (
    <div className="bg-muted rounded-lg flex items-center justify-between p-4 bg-amber-100">
      <div>Buy price</div>
      <div className="text-lg font-bold flex items-center gap-1">
        <div>{keyPrice} USDC</div>
      </div>
    </div>
  )
}

function EthBalance() {
  const { ethBalance } = useEthBalance()

  return (
    <div className="flex items-center gap-2">
      <div>Balance:</div>
      <div className="text-2xl font-bold">
        {ethBalance.valueDecimal.toFixed(5)} ETH
      </div>
    </div>
  )
}

function USDCBalance() {
  const { decimal } = useUsdcBalance()

  return (
    <div className="flex items-center gap-2">
      <div>Balance:</div>
      <div className="text-2xl font-bold">{decimal} USDC</div>
    </div>
  )
}
