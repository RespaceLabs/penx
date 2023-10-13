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
import { CatalogueNode } from '@penx/catalogue'
import { useCatalogue } from '@penx/hooks'
import { db, IDoc } from '@penx/local-db'

interface Props {
  doc: IDoc
}

export const DocItemMenu: FC<PropsWithChildren<Props>> = ({ doc: node }) => {
  const catalogue = useCatalogue()

  const onShare = async (node: CatalogueNode) => {
    const doc = await db.getDoc(node.id)
    if (doc) {
      // appEmitter.emit('onShare', doc)
    } else {
      toast.error('Failed to generate sharing link')
    }
  }

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
          opacity-100--$docItem--hover
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
