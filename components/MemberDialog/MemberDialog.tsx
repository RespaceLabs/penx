'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useQueryEthBalance } from '@/hooks/useEthBalance'
import { RouterOutputs } from '@/server/_app'
import { useMutation } from '@tanstack/react-query'
import { ProfileAvatar } from '../Profile/ProfileAvatar'
import { AmountInput } from './AmountInput'
import { MemberForm } from './MemberForm'
import { useMemberDialog } from './useMemberDialog'
import { useSubscribe } from './useSubscribe'

interface Props {
  space: RouterOutputs['space']['byId']
}

export function MemberDialog({ space }: Props) {
  const { isOpen, setIsOpen } = useMemberDialog()
  useQueryEthBalance()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent className="sm:max-w-[425px]">
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
