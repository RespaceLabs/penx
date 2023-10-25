import { FC, PropsWithChildren } from 'react'
import { Box } from '@fower/react'
import { MoreHorizontal, Trash } from 'lucide-react'
import {
  MenuItem,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
  toast,
} from 'uikit'
import { Node } from '@penx/model'

interface Props {
  node: Node
}

export const NodeItemMenu: FC<PropsWithChildren<Props>> = ({ node }) => {
  return (
    <Popover placement="right-start">
      <PopoverTrigger asChild>
        <Box
          inlineFlex
          bgGray200--hover
          rounded
          cursorPointer
          gray700
          p-2
          opacity-0
          opacity-100--$nodeItem--hover
        >
          <MoreHorizontal size={18} />
        </Box>
      </PopoverTrigger>
      <PopoverContent w-200 textSM>
        <Box>
          <PopoverClose asChild>
            <MenuItem gap2 onClick={async () => {}}>
              <Trash size={18} />
              <Box>Delete</Box>
            </MenuItem>
          </PopoverClose>
        </Box>
      </PopoverContent>
    </Popover>
  )
}
