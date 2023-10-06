import { FC, PropsWithChildren } from 'react'
import {
  EllipsisHorizontalOutline,
  TrashOutline,
  UserGroupOutline,
} from '@bone-ui/icons'
import { Box } from '@fower/react'
import {
  Menu,
  MenuItem,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from 'uikit'
import { CatalogueNode } from '@penx/catalogue'
import { useCatalogue, useDoc } from '@penx/hooks'
import { shareEmitter } from '../../AppEmitter'

interface Props {
  node: CatalogueNode
  setIsRenaming: (isRenaming: boolean) => void
}

export const CatalogueMenuPopover: FC<PropsWithChildren<Props>> = ({
  node,
  setIsRenaming,
}) => {
  const catalogue = useCatalogue()
  const { raw } = useDoc()

  const onShare = async () => {
    shareEmitter.emit('onShare', raw)
  }

  return (
    <Popover placement="right-start">
      <PopoverTrigger asChild>
        <EllipsisHorizontalOutline
          p0--i
          square5
          cursorPointer
          rounded
          bgGray200--hover
          stroke-2
        />
      </PopoverTrigger>
      <PopoverContent w-200 textSM>
        <Box>
          <PopoverClose asChild>
            <MenuItem
              gap2
              onClick={() => {
                setIsRenaming(true)
              }}
            >
              <UserGroupOutline size={18} />
              <Box>Rename</Box>
            </MenuItem>
          </PopoverClose>

          <PopoverClose asChild>
            <MenuItem
              gap2
              onClick={async () => {
                await catalogue.deleteNode(node)
              }}
            >
              <TrashOutline size={18} />
              <Box>Delete</Box>
            </MenuItem>
          </PopoverClose>

          <PopoverClose asChild>
            <MenuItem gap2 onClick={onShare}>
              <TrashOutline size={18} />
              <Box>Share</Box>
            </MenuItem>
          </PopoverClose>
        </Box>
      </PopoverContent>
    </Popover>
  )
}
