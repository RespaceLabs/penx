import { CSSProperties, forwardRef, memo } from 'react'
import isEqual from 'react-fast-compare'
import { useSortable } from '@dnd-kit/sortable'
import { Box, CSSObject, FowerHTMLProps } from '@fower/react'
import { Node } from '@penx/model'
import { NodeService } from '@penx/service'
import { store } from '@penx/store'

interface Props extends FowerHTMLProps<'div'> {
  node: Node
  style?: CSSProperties
  css?: CSSObject
  listeners?: ReturnType<typeof useSortable>['listeners']
}

export const NodeItem = memo(
  forwardRef<HTMLDivElement, Props>(function NodeItem(
    { node, style = {}, css = {}, listeners, ...rest },
    ref,
  ) {
    return (
      <Box
        ref={ref}
        className="nodeItem"
        relative
        toCenterY
        gap2
        gray800
        textSM
        h-30
        px2
        bgGray200--hover
        bgGray200--D4--active
        cursorPointer
        rounded
        css={css}
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
        <Box flex-1>{node.title || 'Untitled'}</Box>
      </Box>
    )
  }),

  (prev, next) => {
    const { node: n1, css: c1, style: s1 } = prev
    const { node: n2, css: c2, style: s2 } = next

    const equal = isEqual(n1.raw, n2.raw) && isEqual(c1, c2) && isEqual(s1, s2)

    return equal
  },
)
