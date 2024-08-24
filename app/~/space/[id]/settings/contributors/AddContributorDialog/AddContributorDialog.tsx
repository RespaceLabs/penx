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
import { AddContributorForm } from './AddContributorForm'
import { useAddContributorDialog } from './useAddContributorDialog'

export function AddContributorDialog() {
  const { isOpen, setIsOpen } = useAddContributorDialog()
  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogTrigger asChild>
        <Button className="rounded-xl" onClick={() => setIsOpen(true)}>
          Add Contributor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Contributor</DialogTitle>
        </DialogHeader>
        <AddContributorForm />
      </DialogContent>
    </Dialog>
  )
}
