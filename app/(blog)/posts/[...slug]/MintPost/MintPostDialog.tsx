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
import { MintPostForm } from './MintPostForm'
import { useMintPostDialog } from './useMintPostDialog'

export function MintPostDialog() {
  const { isOpen, setIsOpen } = useMintPostDialog()
  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Mint this post NFT</DialogTitle>
        </DialogHeader>
        <MintPostForm />
      </DialogContent>
    </Dialog>
  )
}
