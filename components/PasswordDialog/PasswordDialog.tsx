'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { PasswordForm } from './PasswordForm'
import { usePasswordDialog } from './usePasswordDialog'

interface Props {}

export function PasswordDialog({}: Props) {
  const { isOpen, setIsOpen } = usePasswordDialog()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent className="sm:max-w-[425px] grid gap-4">
        <DialogHeader>
          <DialogTitle className="">Username and Password</DialogTitle>
          <DialogDescription>Set username and password</DialogDescription>
        </DialogHeader>

        <PasswordForm />
      </DialogContent>
    </Dialog>
  )
}
