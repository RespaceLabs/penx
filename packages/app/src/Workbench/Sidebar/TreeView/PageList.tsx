import { CSSProperties, forwardRef, memo } from 'react'
import isEqual from 'react-fast-compare'
import { Box, FowerHTMLProps } from '@fower/react'
import { FileText } from 'lucide-react'
import { useNodes, useSidebarDrawer } from '@penx/hooks'
import { Node } from '@penx/model'
import { store } from '@penx/store'
import { TreeViewHeader } from './TreeViewHeader'

export function PageList() {
  const { nodeList } = useNodes()

  return (
    <Box>
      <TreeViewHeader />
      {nodeList.pageNodes.map((node) => (
        <PageItem key={node.id} node={node} />
      ))}
    </Box>
  )
}

interface TreeItemProps extends FowerHTMLProps<'div'> {
  node: Node
}

export const PageItem = memo(
  forwardRef<HTMLDivElement, TreeItemProps>(function PageItem(
    { node, ...rest },
    ref,
  ) {
    const { nodes, nodeList } = useNodes()
    const hasChildren = !!node.children.length
    const { isOpen, close, open } = useSidebarDrawer()

    return (
      <Box
        ref={ref}
        relative
        h-30
        toCenterY
        cursorPointer
        rounded
        bgGray200--hover
        bgGray200--D4--active
        transitionColors
        gray800
        w-100p
        mb-1
        gap2
        pl2
        {...rest}
        onClick={() => {
          close?.()
          store.node.selectNode(node.raw)
        }}
      >
        <Box inlineFlex gray500>
          <FileText size={16} />
        </Box>
        <Box
          opacity-40={!node.title}
          flex-1
          style={{
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          {node.title || 'Untitled'}
        </Box>
      </Box>
    )
  }),

  (prev, next) => {
    const equal = isEqual(prev.node.raw, next.node.raw)
    return equal
  },
)
