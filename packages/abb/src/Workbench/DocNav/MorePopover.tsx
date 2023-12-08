import { Box } from '@fower/react'
import { LogOut, MoreHorizontal, StarOff, Trash2 } from 'lucide-react'
import {
  Button,
  MenuItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from 'uikit'

export const MorePopover = () => {
  return (
    <Popover placement="bottom-end">
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost" colorScheme="gray500" isSquare>
          <MoreHorizontal />
        </Button>
      </PopoverTrigger>
      <PopoverContent w-260 column>
        <MenuItem gap2 onClick={async () => {}}>
          <StarOff size={18} />
          <Box>Remove from Favorites</Box>
        </MenuItem>

        <MenuItem gap2 onClick={async () => {}}>
          <LogOut size={18} />
          <Box>Export</Box>
        </MenuItem>
      </PopoverContent>
    </Popover>
  )
}
