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
import { useEthPrice } from '@/hooks/useEthPrice'
import { useKeyBalance } from '@/hooks/useKeyBalance'
import { useSellPrice } from '@/hooks/useSellPrice'
import { precision } from '@/lib/math'
import { RouterOutputs } from '@/server/_app'
import { Post } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import { ProfileAvatar } from '../Profile/ProfileAvatar'
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
  const sell = useSellKey(space, post)
  const { data, isLoading } = useKeyBalance(creationId)
  const { isPending, mutateAsync } = useMutation({
    mutationKey: ['sell'],
    mutationFn: async () => sell(creationId),
  })

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sell Keys</DialogTitle>
        </DialogHeader>

        <ProfileAvatar showAddress />

        <div className="bg-muted rounded-lg flex items-center justify-between p-4">
          <div>My keys</div>
          <div className="text-lg font-bold">
            {typeof data !== 'undefined' && data!.toString()}
          </div>
        </div>

        <KeyPrice creationId={creationId} />

        {precision.toDecimal(data!) === 0 && (
          <div className="text-neutral-400 text-sm">
            You currently have no keys.
          </div>
        )}

        <Button
          size="lg"
          disabled={Number(data!) < 1}
          onClick={async () => {
            await mutateAsync()
            setIsOpen(false)
          }}
        >
          {isPending ? <LoadingDots color="white" /> : 'Sell 1 Key'}
        </Button>
      </DialogContent>
    </Dialog>
  )
}

function KeyPrice({ creationId }: { creationId: bigint }) {
  const { data, isLoading } = useSellPrice(creationId)

  if (isLoading || !data) return <div>-</div>

  const keyPrice = precision.toDecimal(data.priceAfterFee, 6).toFixed(2)
  return (
    <div className="bg-muted rounded-lg flex items-center justify-between p-4 bg-amber-100">
      <div>Sell price</div>
      <div className="text-lg font-bold flex items-center gap-1">
        <div>{keyPrice} USDC</div>
      </div>
    </div>
  )
}
