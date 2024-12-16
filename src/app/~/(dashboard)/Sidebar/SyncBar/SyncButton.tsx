import { useState } from 'react'
import LoadingDots from '@/components/icons/loading-dots'
import { PopoverContent } from '@/components/plate-ui/popover'
import { Button } from '@/components/ui/button'
import { Popover, PopoverTrigger } from '@/components/ui/popover'
import { sync } from '@/lib/sync'
import { PopoverClose } from '@radix-ui/react-popover'
import { useMutation } from '@tanstack/react-query'
import { ArrowUp, RefreshCcw } from 'lucide-react'
import { toast } from 'sonner'

interface Props {}

export function SyncButton({}: Props) {
  const [isOpen, setOpen] = useState(false)
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['syncNode'],
    mutationFn: () => sync(false),
  })

  async function syncNotes() {
    await mutateAsync()
    setOpen(false)
    toast.success('Sync successfully!')
  }

  return (
    <Popover open={isOpen} onOpenChange={(v) => setOpen(v)}>
      <PopoverTrigger asChild>
        <div className="flex-1 flex items-center justify-center gap-1 cursor-pointer hover:bg-foreground/5 transition-all border-x">
          <RefreshCcw size={16}></RefreshCcw>
          <div>Sync</div>
        </div>
      </PopoverTrigger>
      <PopoverContent align="start" alignOffset={8} className="space-y-1 w-72">
        <div className="text-lg font-bold">Sync notes</div>
        <div className="text-sm text-foreground/60">
          Sync changes to server or pull changes from server.
        </div>
        <div className="flex gap-2 pt-2">
          <PopoverClose asChild>
            <Button variant="outline" className="flex-1">
              Cancel
            </Button>
          </PopoverClose>

          <Button className="flex-1 flex gap-1" onClick={syncNotes}>
            {isPending ? (
              <>
                <div>Syncing</div>
                <LoadingDots></LoadingDots>
              </>
            ) : (
              <div>Sync</div>
            )}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
