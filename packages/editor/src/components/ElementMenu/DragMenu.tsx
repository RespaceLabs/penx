import { FC } from 'react'
import { Box } from '@fower/react'
import { Copy, Hash, Plus, Trash2 } from 'lucide-react'
import { Path, Transforms } from 'slate'
import { useSlateStatic } from 'slate-react'
import { MenuItem, Popover, PopoverContent, PopoverTrigger } from 'uikit'
import { IconDrag } from '@penx/icons'

interface Props {
  id: string
  type: any
  path: Path
  listeners: any
}

export const DragMenu: FC<Props> = ({ id = '', path, listeners }) => {
  const editor = useSlateStatic()

  return (
    <Popover placement="left-start">
      <PopoverTrigger>
        <Box
          toCenter
          rounded
          transitionCommon
          bgGray100--hover
          py-2
          opacity-0
          opacity-100--$editorElement--hover
          {...listeners}
        >
          <IconDrag size={18} gray400></IconDrag>
        </Box>
      </PopoverTrigger>
      <PopoverContent>
        <MenuItem>
          <Copy size={18} />
          <Box>Duplicate</Box>
        </MenuItem>
        <MenuItem>
          <Hash size={18} />
          <Box>Copy link</Box>
        </MenuItem>
        <MenuItem
          onClick={() => {
            Transforms.removeNodes(editor, { at: path })
          }}
        >
          <Trash2 size={18} />
          <Box>Delete</Box>
        </MenuItem>
        <MenuItem>
          <Plus size={18} />
          <Box>Add to below</Box>
        </MenuItem>
      </PopoverContent>
    </Popover>
  )
}
