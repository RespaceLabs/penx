'use client'

import { useMemberDialog } from '@/components/MemberDialog/useMemberDialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useUpdatePriceDialog } from '@/components/UpdatePriceDialog/useUpdatePriceDialog'
import { WalletConnectButton } from '@/components/WalletConnectButton'
import { useChainSpace } from '@/hooks/useChainSpace'
import { useEthPrice } from '@/hooks/useEthPrice'
import { useMembers } from '@/hooks/useMembers'
import { useSpace } from '@/hooks/useSpace'
import { cn } from '@/lib/utils'
import { PencilLine } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'

interface Props {}

export function MemberButton({}: Props) {
  const { isConnected } = useAccount()

  if (!isConnected) {
    return (
      <WalletConnectButton size="lg" className="rounded-lg">
        Become a member
      </WalletConnectButton>
    )
  }
  return (
    <div className="flex flex-col gap-1">
      <ConnectedButton></ConnectedButton>
      <SubscriptionPrice />
    </div>
  )
}

function ConnectedButton() {
  const { setIsOpen } = useMemberDialog()
  const { data: session } = useSession()
  const { space } = useSpace()
  const { members } = useMembers(space?.id)
  const isMember = members?.some((m) => m.userId === session?.userId)

  return (
    <Button
      size="lg"
      className={cn(
        'flex items-center gap-2 rounded-xl',
        isMember && 'border-2 border-yellow-500',
      )}
      onClick={() => {
        setIsOpen(true)
      }}
    >
      {/* <span className="i-[token--eth] w-6 h-6"></span> */}
      {isMember && <div>Update subscription</div>}
      {!isMember && <div>Become a member</div>}
    </Button>
  )
}

export function SubscriptionPrice() {
  const { space: chainSpace } = useChainSpace()
  const { ethPrice } = useEthPrice()
  const { space } = useSpace()
  const { data } = useSession()
  const { setIsOpen } = useUpdatePriceDialog()

  if (!chainSpace?.symbolName || !ethPrice) {
    return (
      <div className="flex justify-end">
        <Skeleton className="h-4 w-28"></Skeleton>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between h-6">
      <div className="text-sm text-neutral-500">
        ${chainSpace?.getUsdPrice(ethPrice).toFixed(2)}/month
      </div>
      <Button
        variant="ghost"
        size="xs"
        className="h-7 w-7 p-1 rounded"
        onClick={() => {
          if (space?.userId !== data?.userId) {
            toast.error('Only the owner can update the subscription price.')
            return
          }
          setIsOpen(true)
        }}
      >
        <PencilLine size={16}></PencilLine>
      </Button>
    </div>
  )
}
