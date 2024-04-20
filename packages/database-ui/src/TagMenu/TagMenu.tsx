import { useState } from 'react'
import { Box } from '@fower/react'
import {
  Divider,
  Input,
  MenuItem,
  modalController,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
  toast,
  usePopoverContext,
} from 'uikit'
import { ModalNames } from '@penx/constants'
import { db, getColorNames } from '@penx/local-db'
import { Node } from '@penx/model'
import { IDatabaseNode } from '@penx/model-types'
import { useCopyToClipboard } from '@penx/shared'
import { store } from '@penx/store'
import { useDatabaseContext } from '../DatabaseContext'
import { DeleteDatabaseModal } from './DeleteDatabaseModal'

interface Props {
  database: IDatabaseNode
}

function ColorSelector({ database }: Props) {
  const { updateDatabaseProps } = useDatabaseContext()
  const { close } = usePopoverContext()
  const colorNames = getColorNames()

  async function selectColor(color: string) {
    updateDatabaseProps({ color })
    close()
  }

  return (
    <Box toCenterY flexWrap gap2 p4 toBetween>
      {colorNames.map((color) => (
        <Box
          key={color}
          square6
          roundedFull
          cursorPointer
          bg={color}
          bg--T20--hover={color}
          scale-110--hover
          transitionCommon
          title={color}
          onClick={() => selectColor(color)}
        />
      ))}
    </Box>
  )
}

function Content() {
  const { database, updateDatabaseProps } = useDatabaseContext()
  const [name, setName] = useState(database.props.name)
  const { close } = usePopoverContext()
  const { copy } = useCopyToClipboard()

  const node = new Node(database)

  const isBuiltin = node.isTodoDatabase || node.isFileDatabase

  return (
    <>
      {!isBuiltin && (
        <Box px3 pt3>
          <Input
            size="sm"
            value={name}
            onBlur={() => {
              updateDatabaseProps({ name })
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                updateDatabaseProps({ name })
                close()
              }
            }}
            onChange={(e) => {
              setName(e.target.value)
            }}
          />
        </Box>
      )}

      <ColorSelector database={database} />
      {!isBuiltin && (
        <>
          <Divider />
          <MenuItem
            onClick={() => {
              modalController.open(ModalNames.DELETE_DATABASE, database)
              close()
            }}
          >
            Delete database
          </MenuItem>
        </>
      )}

      <PopoverClose>
        <MenuItem
          onClick={() => {
            copy(database.id)
            toast.success('Copied to clipboard')
          }}
        >
          Copy database ID
        </MenuItem>
      </PopoverClose>
    </>
  )
}

export const TagMenu = () => {
  const { database } = useDatabaseContext()

  if (!database) return null
  const node = new Node(database)

  return (
    <Box toCenterY left3 top-2 h="1.5em">
      <DeleteDatabaseModal />
      <Popover>
        <PopoverTrigger asChild>
          <Box toCenterY gap1 cursorPointer>
            <Box
              bg={database.props.color || 'black'}
              square="1.5em"
              textSM
              white
              roundedFull
              toCenter
            >
              #
            </Box>
            <Box textLG fontBold>
              {node.title}
            </Box>
          </Box>
        </PopoverTrigger>
        <PopoverContent w-220>
          <Content></Content>
        </PopoverContent>
      </Popover>
    </Box>
  )
}
