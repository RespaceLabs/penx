import { useMemo } from 'react'
import { Bullet } from '@/components/Bullet'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Node } from '@/lib/model'
import { useNodes } from '@/lib/node-hooks'
import { NodeService } from '@/lib/service'
import { store } from '@/store'
import { ChevronRight } from 'lucide-react'
import { Node as SlateNode } from 'slate'

interface Props {
  node: Node
}

export const BreadcrumbPopover = ({ node }: Props) => {
  const { nodes } = useNodes()
  const nodeService = useMemo(() => new NodeService(node, nodes), [node, nodes])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="text-foreground/50 flex items-center justify-center -scroll-mb-2 w-4 h-4 rounded-full hover:bg-foreground/20 cursor-pointer transition-all">
          <ChevronRight size={14} />
        </div>
      </PopoverTrigger>
      <PopoverContent>
        {nodeService.childrenNodes.map((item) => {
          if (!item?.raw?.element?.[0]) return null
          if (!SlateNode.string(item.element[0])) return null
          return (
            <div key={item.id} onClick={() => store.node.selectNode(item.raw)}>
              <Bullet />
              <div>{item.title}</div>
            </div>
          )
        })}
      </PopoverContent>
    </Popover>
  )
}
