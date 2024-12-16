'use client'

import * as React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import LoadingDots from './icons/loading-dots'
import { Button } from './ui/button'

interface Props {
  title: string
  content: string
  onConfirm: () => Promise<any>
  tooltipContent?: string
}

export function DeleteConfirmDialog({
  title,
  content,
  onConfirm,
  tooltipContent,
}: Props) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  return (
    <AlertDialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <AlertDialogTrigger asChild>
        <TooltipProvider delayDuration={50}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Trash2
                className="h-4 w-4 cursor-pointer text-destructive hover:text-destructive/90"
                onClick={() => setIsOpen(true)}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltipContent}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{content}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="w-24" onClick={() => setIsOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <Button
            disabled={isLoading}
            className="w-24"
            onClick={async () => {
              setIsLoading(true)
              try {
                await onConfirm()
                setIsOpen(false)
              } catch (error) {
                toast.error(extractErrorMessage(error) || 'Failed to delete')
              }
              setIsLoading(false)
            }}
          >
            {isLoading ? <LoadingDots /> : 'Continue'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
