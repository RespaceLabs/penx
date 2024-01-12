import { CSSProperties, forwardRef } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { Box, CSSObject, FowerHTMLProps } from '@fower/react'
import { ChevronDown, ChevronRight, Plus } from 'lucide-react'
import { CatalogueNode } from '@penx/catalogue'
import { CatalogueNodeType } from '@penx/model-types'
import { store } from '@penx/store'
import { CatalogueIconPopover } from './CatalogueIconPopover'
import { CatalogueMenuPopover } from './CatalogueMenuPopover'

interface CatalogueItemProps extends FowerHTMLProps<'div'> {
  depth: number
  name: string
  item: CatalogueNode
  style?: CSSProperties
  css?: CSSObject
  listeners?: ReturnType<typeof useSortable>['listeners']
  sortable?: ReturnType<typeof useSortable>
  onCollapse?: () => void
}

export const CatalogueItem = forwardRef<HTMLDivElement, CatalogueItemProps>(
  function CatalogueItem(
    {
      item,
      name,
      depth,
      sortable,
      listeners,
      onCollapse,
      style = {},
      css = {},
      ...rest
    }: CatalogueItemProps,
    ref,
  ) {
    return (
      <Box
        className="catalogueItem"
        ref={ref}
        relative
        rounded
        pr2
        toBetween
        toCenterY
        h-32
        mb-1
        bgGray100--hover
        transitionColors
        bgBrand500--T90--i={sortable?.isOver && item.isGroup}
        pl={depth * 24 + 6}
        css={css}
        style={style}
        {...listeners}
        {...rest}
      >
        <Box
          toCenterY
          gapX1
          flex-1
          h-100p
          cursorPointer
          gray500
          onClick={async (e) => {
            const node = store.node.getNode(item.id)
            store.node.selectNode(node)
          }}
        >
          {!!item.children?.length && (
            <Box
              inlineFlex
              gray500
              bgGray200--D8--hover
              square-20
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

          <Box
            inlineFlex
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            <CatalogueIconPopover node={item} />
          </Box>

          <Box textSM fontMedium>
            {name || 'Untitled'}
          </Box>
        </Box>
        <Box toCenterY gap1 opacity-0 opacity-100--$catalogueItem--hover>
          <CatalogueMenuPopover node={item} />

          <Box
            toCenter
            square6
            cursorPointer
            rounded
            bgGray200--hover
            inlineFlex
            gray600
            onClick={async (e) => {
              e.stopPropagation()
              await store.catalogue.addNode(CatalogueNodeType.NODE, item.id)
            }}
          >
            <Plus size={16} />
          </Box>
        </Box>
      </Box>
    )
  },
)
