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
import { UpdatePlanForm } from './UpdatePlanForm'
import { useUpdatePlanDialog } from './useUpdatePlanDialog'

export function UpdatePlanDialog() {
  const { isOpen, setIsOpen } = useUpdatePlanDialog()
  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Update Plan</DialogTitle>
        </DialogHeader>
        <UpdatePlanForm />
      </DialogContent>
    </Dialog>
  )
}
