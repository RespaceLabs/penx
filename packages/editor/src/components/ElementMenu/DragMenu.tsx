import { FC } from 'react'
import { MenuItem } from '@bone-ui/menu'
import { Box } from '@fower/react'
import { Copy, Hash, Plus, Trash2 } from 'lucide-react'
import { Path, Transforms } from 'slate'
import { useSlateStatic } from 'slate-react'
import { Popover, PopoverContent, PopoverTrigger } from 'uikit'
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
        <MenuItem icon={<Copy size={18} />}>Duplicate</MenuItem>
        <MenuItem icon={<Hash size={18} />}>Copy link</MenuItem>
        <MenuItem
          icon={<Trash2 size={18} />}
          onClick={() => {
            Transforms.removeNodes(editor, { at: path })
          }}
        >
          Delete
        </MenuItem>
        <MenuItem icon={<Plus size={18} />}>Add to below</MenuItem>
      </PopoverContent>
    </Popover>
  )
}
