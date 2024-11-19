import { useState } from 'react'
import LoadingDots from '@/components/icons/loading-dots'
import { PopoverContent } from '@/components/plate-ui/popover'
import { Button } from '@/components/ui/button'
import { Popover, PopoverTrigger } from '@/components/ui/popover'
import { db } from '@/lib/local-db'
import { INode } from '@/lib/model'
import { api, trpc } from '@/lib/trpc'
import { store } from '@/store'
import { PopoverClose } from '@radix-ui/react-popover'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { toast } from 'sonner'

interface Props {}

export function PullButton({}: Props) {
  const [isOpen, setOpen] = useState(false)
  const [isLoading, setLoading] = useState(false)

  async function pull() {
    setLoading(true)
    const remoteNodes = await api.node.myNodes.query()
    if (remoteNodes.length) {
      await db.deleteNodeByUserId()
      for (const node of remoteNodes) {
        await db.createNode(node as INode)
      }
    }
    const nodes = await db.listNodesByUserId()
    store.node.setNodes(nodes)
    setOpen(false)
    setLoading(false)
    toast.success('Pull successfully!')
  }
  return (
    <Popover open={isOpen} onOpenChange={(v) => setOpen(v)}>
      <PopoverTrigger asChild>
        <div className="flex-1 flex items-center justify-center gap-1 cursor-pointer hover:bg-foreground/5 transition-all border-x border-foreground/10">
          <ArrowDown size={16}></ArrowDown>
          <div>Pull</div>
        </div>
      </PopoverTrigger>
      <PopoverContent align="start" className="space-y-1 w-72">
        <div className="text-lg font-bold">Sync notes to local</div>
        <div className="text-sm text-foreground/60">
          Sync all your remote notes to local. It will override the local notes.
        </div>
        <div className="flex gap-2 pt-2">
          <PopoverClose asChild>
            <Button variant="outline" className="flex-1">
              Cancel
            </Button>
          </PopoverClose>

          <Button className="flex-1 flex gap-1" onClick={pull}>
            {isLoading ? (
              <>
                <div>Sync</div>
                <LoadingDots></LoadingDots>
              </>
            ) : (
              <div>Pull</div>
            )}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
