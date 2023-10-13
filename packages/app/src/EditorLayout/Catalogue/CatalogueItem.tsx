import { CSSProperties, forwardRef, useState } from 'react'
import { mergeRefs } from '@bone-ui/utils'
import { useSortable } from '@dnd-kit/sortable'
import { Box, CSSObject, FowerHTMLProps } from '@fower/react'
import { Plus } from 'lucide-react'
import { Dot } from 'uikit'
import { CatalogueNode } from '@penx/catalogue'
import { ChangeService } from '@penx/domain'
import { useCatalogue, useSpaces } from '@penx/hooks'
import { AnimateArrow } from '../../components/AnimateArrow'
import { CatalogueIconPopover } from './CatalogueIconPopover'
import { CatalogueMenuPopover } from './CatalogueMenuPopover'
import { NewDocPopover } from './NewDocPopover'
import { RenameCatalogueInput } from './RenameCatalogueInput'

interface CatalogueItemProps extends FowerHTMLProps<'div'> {
  level: number
  item: CatalogueNode
  style?: CSSProperties
  css?: CSSObject
  sortable?: ReturnType<typeof useSortable>
}

export const CatalogueItem = forwardRef<HTMLDivElement, CatalogueItemProps>(
  function CatalogueItem(
    {
      item,
      level,
      sortable,
      style = {},
      css = {},
      ...rest
    }: CatalogueItemProps,
    ref,
  ) {
    const { activeSpace } = useSpaces()

    const catalogue = useCatalogue()
    const [isRenaming, setIsRenaming] = useState(false)
    const active = item.id === activeSpace.activeDocId

    const changeService = new ChangeService(activeSpace)

    if (isRenaming) {
      return <RenameCatalogueInput node={item} setIsRenaming={setIsRenaming} />
    }

    return (
      <Box
        className="catalogueItem"
        ref={mergeRefs([sortable ? sortable?.setNodeRef : null, ref])}
        relative
        rounded
        pr2
        toBetween
        toCenterY
        h-32
        mb-1
        bgGray100--hover
        transitionColors
        bgGray100={active}
        bgBrand500--T90--i={sortable?.isOver && item.isGroup}
        css={css}
        style={style}
        {...sortable?.listeners}
        {...rest}
      >
        <Box
          toCenterY
          gapX1
          flex-1
          h-100p
          cursorPointer
          gray500
          pl={level * 12 + 8}
          onClick={async () => {
            await catalogue.selectNode(item)
          }}
        >
          {item.isDoc && (
            <Box
              inlineFlex
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
            >
              <CatalogueIconPopover node={item} />
            </Box>
          )}
          {item.isGroup && <AnimateArrow isOpen={!item.isFolded} />}
          <Box textSM fontMedium>
            {item.name}
          </Box>
        </Box>

        <Box toCenterY gap1 opacity-0 opacity-100--$catalogueItem--hover>
          <CatalogueMenuPopover node={item} setIsRenaming={setIsRenaming} />

          <Box
            inlineFlex
            bgGray200--hover
            rounded
            cursorPointer
            gray600
            p-2
            onClick={() => catalogue.addNode(item.id)}
          >
            <Plus size={16} />
          </Box>
        </Box>

        {changeService.isAdded(item.id) && <Dot square-6 type="success" ml1 />}
        {changeService.isUpdated(item.id) && (
          <Dot square-6 type="warning" ml1 />
        )}
      </Box>
    )
  },
)
