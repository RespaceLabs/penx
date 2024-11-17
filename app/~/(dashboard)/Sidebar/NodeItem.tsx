import { HTMLAttributes, useState } from 'react'
import { DropdownMenu, DropdownMenuGroup } from '@/components/ui/dropdown-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Node } from '@/lib/model'
import { cn } from '@/lib/utils'
import { store } from '@/store'
import { Ellipsis, Link, Trash2 } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

interface Props {
  node: Node
}

export function NodeItem({ node }: Props) {
  const params = useParams()
  const { push } = useRouter()
  const [open, setOpen] = useState(false)
  const { title = '' } = node
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild onClick={(e) => e.preventDefault()}>
        <div
          className={cn(
            'flex items-center justify-between gap-1 rounded px-2 text-foreground/70 hover:bg-foreground/5 py-1 transition-all cursor-pointer w-full text-sm group h-7',
            params.nodeId === node.id && 'bg-foreground/5',
          )}
          onClick={(e) => {
            push(`/~/objects/${node.id}`)
          }}
        >
          <div className="flex-1 truncate overflow-hidden w-20">
            {title.length > 40
              ? title?.slice(0, 100) + '...'
              : title || 'Untitled'}
          </div>

          <div
            className="hidden group-hover:inline-flex text-foreground/50 hover:text-foreground/90 transition-all"
            onClick={(e) => {
              // e.preventDefault()
              e.stopPropagation()
              setOpen(true)
            }}
          >
            <Ellipsis size={18} />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent
        align="center"
        side="right"
        className="w-52 flex flex-col p-2 gap-[1px]"
      >
        <Item className="disabled cursor-not-allowed">
          <Link size={16} />
          <div>Copy link</div>
        </Item>
        <Item
          onClick={() => {
            setOpen(false)
            store.node.deleteNode(node.id)
            push(`/~/objects/today`)
          }}
        >
          <Trash2 size={16} />
          <div>Delete</div>
        </Item>
      </PopoverContent>
    </Popover>
  )
}

interface ItemProps extends HTMLAttributes<HTMLDivElement> {}
function Item({ className, ...rest }: ItemProps) {
  return (
    <div
      className={cn(
        'hover:bg-foreground/5 rounded-md py-2 px-2 transition-all text-sm cursor-pointer flex items-center gap-2 text-foreground/80',
        className,
      )}
      {...rest}
    ></div>
  )
}
