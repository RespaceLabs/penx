'use client'

import { Dispatch, SetStateAction, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { loadPage, usePage } from '@/lib/hooks/usePage'
import { trpc } from '@/lib/trpc'
import { cn } from '@/lib/utils'
import { PopoverClose } from '@radix-ui/react-popover'
import { LoadingDots } from '../icons/loading-dots'

interface Props {
  className?: string
}

export function PublishPagePopover({ className }: Props) {
  const [isOpen, setOpen] = useState(false)

  return (
    <Popover
      open={isOpen}
      onOpenChange={(v) => {
        setOpen(v)
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          className={cn('w-24', className)}
          onClick={() => {
            setOpen(true)
          }}
        >
          Publish
        </Button>
      </PopoverTrigger>
      <PublishPopoverContent setOpen={setOpen} />
    </Popover>
  )
}

interface PublishPopoverContentProps {
  setOpen: Dispatch<SetStateAction<boolean>>
}

function PublishPopoverContent({ setOpen }: PublishPopoverContentProps) {
  const { page } = usePage()
  const { mutateAsync: publish, isPending } = trpc.page.publish.useMutation()

  if (!page) return null

  return (
    <PopoverContent align="end" className="w-[360px] flex flex-col gap-5">
      <div className="text-center text-xl font-semibold">Publish this Page</div>

      <div className="flex gap-2 justify-center">
        <PopoverClose asChild>
          <Button variant="secondary" className="w-full">
            Cancel
          </Button>
        </PopoverClose>
        <Button
          className="w-full"
          onClick={async () => {
            try {
              await publish({
                pageId: page.id,
              })
              await loadPage({
                pageId: page.id,
              })
              toast.success('Page published!')
              setOpen(false)
            } catch (error) {
              console.log('========error:', error)
              const msg = extractErrorMessage(error)
              toast.error(msg)
            }
          }}
        >
          {isPending ? <LoadingDots /> : <div>Publish</div>}
        </Button>
      </div>
    </PopoverContent>
  )
}
