import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { GiveShareForm } from './GiveShareForm'
import { useGiveShareDialog } from './useGiveShareDialog'

export function GiveShareDialog() {
  const { isOpen, setIsOpen } = useGiveShareDialog()
  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle>Give share</DialogTitle>
        </DialogHeader>
        <GiveShareForm />
      </DialogContent>
    </Dialog>
  )
}
