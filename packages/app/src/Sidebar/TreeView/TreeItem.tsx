import { CSSProperties, forwardRef, memo } from 'react'
import isEqual from 'react-fast-compare'
import { useSortable } from '@dnd-kit/sortable'
import { Box, CSSObject, FowerHTMLProps } from '@fower/react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useNode } from '@penx/hooks'
import { Node } from '@penx/model'
import { store } from '@penx/store'
import { FlattenedItem } from './types'

interface TreeItemProps extends FowerHTMLProps<'div'> {
  depth: number
  item: FlattenedItem
  style?: CSSProperties
  css?: CSSObject
  listeners?: ReturnType<typeof useSortable>['listeners']
  onCollapse?: () => void
}

export const TreeItem = memo(
  forwardRef<HTMLDivElement, TreeItemProps>(function TreeItem(
    { item, depth, listeners, style = {}, css = {}, onCollapse, ...rest },
    ref,
  ) {
    const { node: currentNode, nodeService } = useNode()
    const node = new Node(item as any)

    const isEqual = item.id === currentNode.id
    const hasChildren = !!item.children.length

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
        bgGray200={isEqual}
        transitionColors
        gray800
        mb-1
        pl={depth * 16 + 6}
        css={css}
        style={style}
        {...listeners}
        {...rest}
        onClick={() => {
          // TODO: need to improve performance
          const nodes = store.getNodes()
          const node = nodes.find((n) => n.id === item.id)!
          store.selectNode(node)
        }}
      >
        <Box toCenterY gap-2>
          {hasChildren && (
            <Box
              inlineFlex
              gray500
              bgGray200--D8--hover
              // bgGray200
              square-22
              rounded
              toCenter
              onKeyDown={(e) => {
                e.preventDefault()
              }}
              onPointerDown={(e) => {
                e.preventDefault()
              }}
              onClick={(e) => {
                e.stopPropagation()
                // nodeService.toggleFolded(node)
                onCollapse?.()
              }}
            >
              {item.folded && <ChevronRight size={14} />}
              {!item.folded && <ChevronDown size={14} />}
            </Box>
          )}

          {!hasChildren && (
            <Box
              ml-14={depth === 0}
              ml-10
              mr-6
              inlineFlex
              bgGray400
              square-3
              roundedFull
            />
          )}

          <Box opacity-40={!node.title}>{node.title || 'Untitled'}</Box>
        </Box>
      </Box>
    )
  }),

  (prev, next) => {
    const { listeners: l1, ...prevProps } = prev
    const { listeners: l2, ...nextProps } = next
    return isEqual(prevProps, nextProps)
  },
)
