'use client'

import { useQueryEthBalance } from '@/app/(creator-fi)/hooks/useEthBalance'
import { useSpaceContext } from '@/components/SpaceContext'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { MemberForm } from './MemberForm'
import { useMemberDialog } from './useMemberDialog'

interface Props {}

export function MemberDialog({}: Props) {
  const { isOpen, setIsOpen } = useMemberDialog()
  const space = useSpaceContext()
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
