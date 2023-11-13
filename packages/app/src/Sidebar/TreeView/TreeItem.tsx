import { CSSProperties, forwardRef, memo } from 'react'
import isEqual from 'react-fast-compare'
import { useSortable } from '@dnd-kit/sortable'
import { Box, CSSObject, FowerHTMLProps } from '@fower/react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useNode } from '@penx/hooks'
import { Node } from '@penx/model'
import { store } from '@penx/store'

interface TreeItemProps extends FowerHTMLProps<'div'> {
  level: number
  node: Node
  style?: CSSProperties
  css?: CSSObject
  listeners?: ReturnType<typeof useSortable>['listeners']
}

export const TreeItem = memo(
  forwardRef<HTMLDivElement, TreeItemProps>(function TreeItem(
    { node, level, listeners, style = {}, css = {}, ...rest },
    ref,
  ) {
    const { nodeService } = useNode()

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
        bgGray200={nodeService.isEqual(node)}
        transitionColors
        gray800
        mb-1
        pl={level * 16 + 6}
        css={css}
        style={style}
        {...listeners}
        {...rest}
        onClick={() => {
          store.selectNode(node.raw)
        }}
      >
        <Box toCenterY gap-2>
          {node.hasChildren && (
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
                nodeService.toggleFolded(node)
              }}
            >
              {node.folded && <ChevronRight size={14} />}
              {!node.folded && <ChevronDown size={14} />}
            </Box>
          )}

          {!node.hasChildren && (
            <Box
              ml-14={level === 0}
              ml-10
              mr-6
              inlineFlex
              bgGray400
              square-3
              roundedFull
            />
          )}

          <Box>{node.title}</Box>
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
