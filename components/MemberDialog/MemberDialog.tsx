'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useQueryEthBalance } from '@/hooks/useEthBalance'
import { RouterOutputs } from '@/server/_app'
import { MemberForm } from './MemberForm'
import { useMemberDialog } from './useMemberDialog'

interface Props {
  space: RouterOutputs['space']['byId']
}

export function MemberDialog({ space }: Props) {
  const { isOpen, setIsOpen } = useMemberDialog()
  useQueryEthBalance()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogDescription></DialogDescription>
        <DialogHeader>
          <DialogTitle>Subscription</DialogTitle>
          <div className="text-sm text-neutral-600">
            Subscribe to become a member of the{' '}
            <span className="font-bold">{space.name}</span> space.
          </div>
        </DialogHeader>
        <MemberForm space={space} />
      </DialogContent>
    </Dialog>
  )
}
