import { FC } from 'react'
import {
  DocumentDuplicateOutline,
  HashtagOutline,
  PlusOutline,
  TrashOutline,
} from '@bone-ui/icons'
import { MenuItem } from '@bone-ui/menu'
import { Box } from '@fower/react'
import { Path, Transforms } from 'slate'
import { useSlate, useSlateStatic } from 'slate-react'
import { Popover, PopoverContent, PopoverTrigger } from 'uikit'
import { ElementType } from '@penx/editor-shared'
import { IconDrag } from '@penx/icons'

interface Props {
  id: string
  type: ElementType
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
        <MenuItem icon={<DocumentDuplicateOutline size={18} />}>
          Duplicate
        </MenuItem>
        <MenuItem icon={<HashtagOutline size={18} />}>Copy link</MenuItem>
        <MenuItem
          icon={<TrashOutline size={18} />}
          onClick={() => {
            Transforms.removeNodes(editor, { at: path })
          }}
        >
          Delete
        </MenuItem>
        <MenuItem icon={<PlusOutline size={18} />}>Add to below</MenuItem>
      </PopoverContent>
    </Popover>
  )
}
