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
import { Plus } from 'lucide-react'
import { UpdatePriceForm } from './UpdatePriceForm'
import { useUpdatePriceDialog } from './useUpdatePriceDialog'

export function UpdatePriceDialog() {
  const { isOpen, setIsOpen } = useUpdatePriceDialog()
  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Channel</DialogTitle>
        </DialogHeader>
        <UpdatePriceForm />
      </DialogContent>
    </Dialog>
  )
}
