'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { LoadingDots } from '@/components/icons/loading-dots'
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
import { sleep } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import { useDeleteFieldDialog } from './useDeleteFieldDialog'

interface Props {
  onDeleteField: (fieldId: string) => Promise<void>
}

export function DeleteFieldDialog({ onDeleteField }: Props) {
  const { isOpen, setIsOpen, field } = useDeleteFieldDialog()
  const [loading, setLoading] = useState(false)

  async function deleteField() {
    setLoading(true)
    try {
      await onDeleteField(field?.id)
      setIsOpen(false)
    } catch (error) {
      toast.error('Failed to delete field')
    }
    setLoading(false)
  }

  if (!field) return null

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent closable={false} className="">
        <DialogHeader className="">
          <DialogTitle className="">
            Are you sure delete it permanently?
          </DialogTitle>
          <DialogDescription>
            Once deleted, You can't undo this action.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="text-left">
          <DialogClose asChild>
            <Button className="w-20" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="w-20"
            disabled={loading}
            variant="destructive"
            onClick={deleteField}
          >
            {loading ? <LoadingDots className="bg-white" /> : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
