'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Site } from '@/lib/theme.types'
import { useSubscribeNewsletterDialog } from './useSubscribeNewsletterDialog'

interface Props {
  site: Site
}

export function SubscribeNewsletterDialog({ site }: Props) {
  const { isOpen, setIsOpen } = useSubscribeNewsletterDialog()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent className="sm:max-w-[520px] grid gap-4">
        <DialogHeader className="hidden">
          <DialogTitle className=""></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
