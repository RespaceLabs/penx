import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ProfileDialogForm } from './ProfileDialogForm'
import { useProfileDialog } from './useProfileDialog'

export function ProfileDialog() {
  const { isOpen, setIsOpen } = useProfileDialog()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Edit Profile</DialogTitle>
        </DialogHeader>
        <ProfileDialogForm />
      </DialogContent>
    </Dialog>
  )
}
