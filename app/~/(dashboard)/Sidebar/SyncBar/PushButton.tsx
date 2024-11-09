import { useState } from 'react'
import LoadingDots from '@/components/icons/loading-dots'
import { PopoverContent } from '@/components/plate-ui/popover'
import { Button } from '@/components/ui/button'
import { Popover, PopoverTrigger } from '@/components/ui/popover'
import { db } from '@/lib/local-db'
import { trpc } from '@/lib/trpc'
import { PopoverClose } from '@radix-ui/react-popover'
import { ArrowUp } from 'lucide-react'
import { toast } from 'sonner'

interface Props {}

export function PushButton({}: Props) {
  const [isOpen, setOpen] = useState(false)
  const { mutateAsync, isPending } = trpc.node.sync.useMutation()

  async function push() {
    const nodes = await db.listNodesByUserId()
    await mutateAsync({
      nodes: JSON.stringify(nodes),
    })
    setOpen(false)
    toast.success('Synced successfully!')
  }
  return (
    <Popover open={isOpen} onOpenChange={(v) => setOpen(v)}>
      <PopoverTrigger asChild>
        <div className="flex-1 flex items-center justify-center gap-1 cursor-pointer hover:bg-foreground/5 transition-all">
          <ArrowUp size={16}></ArrowUp>
          <div>Push</div>
        </div>
      </PopoverTrigger>
      <PopoverContent align="start" alignOffset={8} className="space-y-1 w-72">
        <div className="text-lg font-bold">Sync notes to server</div>
        <div className="text-sm text-foreground/60">
          Sync all your local notes to server. It will override the remote
          notes.
        </div>
        <div className="flex gap-2 pt-2">
          <PopoverClose asChild>
            <Button variant="outline" className="flex-1">
              Cancel
            </Button>
          </PopoverClose>

          <Button className="flex-1 flex gap-1" onClick={push}>
            {isPending ? (
              <>
                <div>Syncing</div>
                <LoadingDots></LoadingDots>
              </>
            ) : (
              <div>Push</div>
            )}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
