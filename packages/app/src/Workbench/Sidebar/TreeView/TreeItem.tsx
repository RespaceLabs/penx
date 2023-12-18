import { CSSProperties, forwardRef, memo } from 'react'
import isEqual from 'react-fast-compare'
import { useSortable } from '@dnd-kit/sortable'
import { Box, CSSObject, FowerHTMLProps } from '@fower/react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useNodes, useSidebarDrawer } from '@penx/hooks'
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
    const { nodes, nodeList } = useNodes()
    const node = new Node(item as any)
    const hasChildren = !!item.children.length
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
        pl={depth * 16 + 6}
        css={css}
        style={style}
        {...listeners}
        {...rest}
        onClick={() => {
          close?.()
          const node = nodeList.getNode(item.id)
          store.node.selectNode(node.raw)
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
                e.preventDefault()
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
      </Box>
    )
  }),

  (prev, next) => {
    const { item: i1, depth: d1, css: c1, style: s1 } = prev
    const { item: i2, depth: d2, css: c2, style: s2 } = next

    const equal =
      isEqual(i1, i2) && isEqual(c1, c2) && isEqual(s1, s2) && isEqual(d1, d2)

    return equal
  },
)
