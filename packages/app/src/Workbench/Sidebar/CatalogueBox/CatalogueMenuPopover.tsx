import { FC, PropsWithChildren } from 'react'
import { Box } from '@fower/react'
import { MoreHorizontal, Trash2, User } from 'lucide-react'
import {
  Menu,
  MenuItem,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from 'uikit'
import { CatalogueNode } from '@penx/catalogue'
import { useCatalogue } from '@penx/hooks'
import { store } from '@penx/store'

interface Props {
  node: CatalogueNode
}

export const CatalogueMenuPopover: FC<PropsWithChildren<Props>> = ({
  node,
}) => {
  return (
    <Popover placement="right-start">
      <PopoverTrigger asChild>
        <Box
          toCenter
          square6
          cursorPointer
          rounded
          bgGray200--hover
          inlineFlex
          gray600
        >
          <MoreHorizontal size={16} />
        </Box>
      </PopoverTrigger>
      <PopoverContent w-200 textSM>
        <Box>
          <PopoverClose asChild>
            <MenuItem
              gap2
              onClick={async (e) => {
                e.stopPropagation()
                await store.catalogue.deleteNode(node.id)
              }}
            >
              <Trash2 size={18} />
              <Box>Delete</Box>
            </MenuItem>
          </PopoverClose>
        </Box>
      </PopoverContent>
    </Popover>
  )
}
