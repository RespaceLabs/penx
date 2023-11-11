import { CSSProperties, forwardRef } from 'react'
import { mergeRefs } from '@bone-ui/utils'
import { useSortable } from '@dnd-kit/sortable'
import { Box, CSSObject, FowerHTMLProps } from '@fower/react'
import { ChevronDown } from 'lucide-react'
import { Node } from '@penx/model'
import { store } from '@penx/store'

interface TreeItemProps extends FowerHTMLProps<'div'> {
  level: number
  node: Node
  style?: CSSProperties
  css?: CSSObject
  sortable?: ReturnType<typeof useSortable>
}

export const TreeItem = forwardRef<HTMLDivElement, TreeItemProps>(
  function TreeItem(
    { node, level, sortable, style = {}, css = {}, ...rest },
    ref,
  ) {
    return (
      <Box
        ref={mergeRefs([sortable ? sortable?.setNodeRef : null, ref])}
        relative
        h-32
        toCenterY
        cursorPointer
        rounded
        bgGray200--hover
        transitionColors
        gap1
        gray800
        pl={level * 20}
        css={css}
        style={style}
        {...sortable?.listeners}
        {...rest}
        onClick={() => {
          store.selectNode(node.raw)
        }}
      >
        <Box toCenterY gap1>
          {node.hasChildren && (
            <Box inlineFlex gray500>
              <ChevronDown size={14} />
            </Box>
          )}

          {!node.hasChildren && (
            <Box ml1 mr-6 inlineFlex bgGray400 square-3 roundedFull></Box>
          )}

          <Box>{node.title}</Box>
        </Box>
      </Box>
    )
  },
)
