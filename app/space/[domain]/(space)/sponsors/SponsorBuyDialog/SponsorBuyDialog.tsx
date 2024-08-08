'use client'

import { ProfileAvatar } from '@/components/Profile/ProfileAvatar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useQueryUsdcBalance } from '@/hooks/useUsdcBalance'
import { precision } from '@/lib/math'
import { Space } from '@prisma/client'
import { EthBalance } from './EthBalance'
import { useSponsorBuyDialog } from './hooks/useSponsorBuyDialog'
import { KeyPrice } from './KeyPrice'
import { SponsorBuyForm } from './SponsorBuyForm'
import { UsdcBalance } from './UsdcBalance'

interface Props {
  space: Space
}

export function SponsorBuyDialog({ space }: Props) {
  const { isOpen, setIsOpen } = useSponsorBuyDialog()
  const creationId = BigInt(space.sponsorCreationId!)
  useQueryUsdcBalance()

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

        <UsdcBalance />
        <KeyPrice creationId={creationId} />
        <SponsorBuyForm space={space} />
      </DialogContent>
    </Dialog>
  )
}
