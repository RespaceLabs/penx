'use client'

import { ProfileAvatar } from '@/components/Profile/ProfileAvatar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useBuyPrice } from '@/hooks/useBuyPrice'
import { useEthBalance, useQueryEthBalance } from '@/hooks/useEthBalance'
import { useEthPrice } from '@/hooks/useEthPrice'
import { precision } from '@/lib/math'
import { Space } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import { EthBalance } from './EthBalance'
import { useSponsorBuyDialog } from './hooks/useSponsorBuyDialog'
import { KeyPrice } from './KeyPrice'
import { SponsorBuyForm } from './SponsorBuyForm'

interface Props {
  space: Space
}

export function SponsorBuyDialog({ space }: Props) {
  const { isOpen, setIsOpen } = useSponsorBuyDialog()
  const creationId = BigInt(space.sponsorCreationId!)
  useQueryEthBalance()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Buy keys to sponsor</DialogTitle>
          <div className="text-sm text-neutral-600">
            Buy a key to become a member of the{' '}
            <span className="font-bold">{space.name}</span> space.
          </div>
        </DialogHeader>

        <ProfileAvatar showAddress />

        <EthBalance />
        <KeyPrice creationId={creationId} />
        <SponsorBuyForm space={space} />
      </DialogContent>
    </Dialog>
  )
}
