import { Box } from '@fower/react'
import { LogOut, MoreHorizontal, StarOff, Trash2 } from 'lucide-react'
import {
  Button,
  MenuItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  toast,
} from 'uikit'
import { useDoc } from '@penx/hooks'
import { useCopyToClipboard } from '@penx/shared'

export const MorePopover = () => {
  const doc = useDoc()

  const { copy } = useCopyToClipboard()

  if (!doc.raw) return null

  const url = process.env.NEXT_PUBLIC_NEXTAUTH_URL + `/share/${doc?.id}`
  return (
    <Popover placement="bottom-end">
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost" colorScheme="gray500" isSquare>
          <MoreHorizontal />
        </Button>
      </PopoverTrigger>
      <PopoverContent w-260 column>
        <MenuItem gap2 onClick={async () => {}}>
          <Trash2 size={18} />
          <Box>Delete</Box>
        </MenuItem>

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
