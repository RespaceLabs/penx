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
import { useDatabases } from '@/lib/hooks/useDatabases'
import { usePages } from '@/lib/hooks/usePages'
import { api } from '@/lib/trpc'
import { useDeletePageDialog } from './useDeleteDatabaseDialog'

interface Props {}

export function DeletePageDialog({}: Props) {
  const { isOpen, setIsOpen, pageId } = useDeletePageDialog()
  const [loading, setLoading] = useState(false)
  const { refetch } = usePages()

  async function deleteField() {
    setLoading(true)
    try {
      await api.post.delete.mutate(pageId)
      await refetch()
      toast.success('Page deleted successfully')
      setIsOpen(false)
    } catch (error) {
      toast.error('Failed to delete')
    }
    setLoading(false)
  }
  if (!pageId) return null

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent closable={false} className="">
        <DialogHeader className="">
          <DialogTitle className="">
            Are you sure delete this page permanently?
          </DialogTitle>
          <DialogDescription>
            Once deleted, You can't undo this action.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-row gap-2">
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
