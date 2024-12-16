import { CSSProperties, forwardRef, memo } from 'react'
import isEqual from 'react-fast-compare'
import { Node } from '@/lib/model'
import { NodeService } from '@/lib/service'
import { store } from '@/store'
import { useSortable } from '@dnd-kit/sortable'
import { File, Hash } from 'lucide-react'

interface Props {
  node: Node
  style?: CSSProperties
  listeners?: ReturnType<typeof useSortable>['listeners']
}

export const NodeItem = memo(
  forwardRef<HTMLDivElement, Props>(function NodeItem(
    { node, style = {}, listeners, ...rest },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className="nodeItem relative flex items-center gap-2 text-foreground/80 text-sm h-8 px-2 hover:text-foreground/20 cursor-pointer rounded"
        style={style}
        {...listeners}
        {...rest}
        onClick={() => {
          const nodeService = new NodeService(
            node,
            store.node.getNodes().map((node) => new Node(node)),
          )

          nodeService.selectNode()
        }}
      >
        {node.isDatabase ? (
          <div className="inline-flex text-foreground/50">
            <Hash size={16} />
          </div>
        ) : (
          <div className="inline-flex">
            <File size={16} />
          </div>
        )}
        <div flex-1>{node.title || 'Untitled'}</div>
      </div>
    )
  }),

  (prev, next) => {
    const { node: n1, style: s1 } = prev
    const { node: n2, style: s2 } = next

    const equal = isEqual(n1.raw, n2.raw) && isEqual(s1, s2)

    return equal
  },
)
