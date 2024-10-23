'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  accessToken: string
  isOpen: boolean
  onOpenChange: any
}

export default function AccessTokenShowDialog({
  accessToken,
  isOpen,
  onOpenChange,
}: Props) {
  const handleCopy = () => {
    navigator.clipboard
      .writeText(accessToken)
      .then(() => {
        toast.success('Copied to clipboard.')
      })
      .catch((err) => {
        console.error('Could not copy text: ', err)
      })
  }
  return (
    <Dialog open={isOpen} onOpenChange={(v) => onOpenChange(v)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Access Token</DialogTitle>
          <DialogDescription>
            This token will only be displayed once. Please copy and store it
            securely.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input id="link" defaultValue={accessToken} readOnly />
          </div>
          <Button type="submit" size="sm" className="px-3" onClick={handleCopy}>
            <span className="sr-only">Copy</span>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
