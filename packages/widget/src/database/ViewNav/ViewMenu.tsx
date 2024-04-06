import { useState } from 'react'
import { Box } from '@fower/react'
import { Copy, MoreVertical, Trash2 } from 'lucide-react'
import {
  Button,
  Divider,
  Input,
  MenuItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  toast,
  usePopoverContext,
} from 'uikit'
import { IViewNode } from '@penx/model-types'
import { useDatabaseContext } from '../DatabaseContext'

interface ViewMenuProps {
  index: number
  view: IViewNode
}

export const ViewMenu = ({ view, index }: ViewMenuProps) => {
  return (
    <Popover placement="bottom-start">
      <PopoverTrigger asChild>
        <Button isSquare size={22} colorScheme="gray500" variant="ghost" p1>
          <MoreVertical />
        </Button>
      </PopoverTrigger>
      <PopoverContent w-200>
        <Content view={view} index={index} />
      </PopoverContent>
    </Popover>
  )
}

function Content({ view, index }: ViewMenuProps) {
  const { close } = usePopoverContext()
  const { database, updateView, deleteView, views, setActiveViewId } =
    useDatabaseContext()
  const [name, setName] = useState(view.props.name)

  return (
    <>
      <Box p2>
        <Input
          size="sm"
          value={name}
          onBlur={() => {
            updateView(view.id, { name })
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              updateView(view.id, { name })
              close()
            }
          }}
          onChange={(e) => {
            setName(e.target.value)
          }}
        />
      </Box>
      <Divider />

      <MenuItem
        gap2
        onClick={() => {
          toast.info('Coming soon..')
          close()
        }}
      >
        <Box>
          <Copy size={16} />
        </Box>
        <Box>Duplicate View</Box>
      </MenuItem>

      <MenuItem
        disabled={index === 0}
        gap2
        onClick={async () => {
          if (index === 0) return
          await deleteView(view.id)
          setActiveViewId(database.props.viewIds[0])
          close()
        }}
      >
        <Box>
          <Trash2 size={16} />
        </Box>
        <Box>Delete View</Box>
      </MenuItem>
    </>
  )
}
