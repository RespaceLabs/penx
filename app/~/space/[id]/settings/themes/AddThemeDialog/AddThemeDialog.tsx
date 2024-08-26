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
import { AddThemeForm } from './AddThemeForm'
import { useAddThemeDialog } from './useAddContributorDialog'

export function AddThemeDialog() {
  const { isOpen, setIsOpen } = useAddThemeDialog()
  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogTrigger asChild>
        <Button className="rounded-xl" onClick={() => setIsOpen(true)}>
          Create theme
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create theme</DialogTitle>
        </DialogHeader>
        <AddThemeForm />
      </DialogContent>
    </Dialog>
  )
}
