import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { NavLinkForm } from './NavLinkForm'
import { useNavLinkDialog } from './useNavLinkDialog'

export function NavLinkDialog() {
  const { isOpen, setIsOpen } = useNavLinkDialog()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogDescription className="hidden"></DialogDescription>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Add Navigation</DialogTitle>
        </DialogHeader>
        <NavLinkForm />
      </DialogContent>
    </Dialog>
  )
}
