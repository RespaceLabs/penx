import { useState } from 'react'
import { Box } from '@fower/react'
import {
  Divider,
  Input,
  MenuItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  usePopoverContext,
} from 'uikit'
import { db, getColorNames } from '@penx/local-db'
import { IDatabaseNode } from '@penx/model-types'
import { store } from '@penx/store'
import { useDatabaseContext } from './DatabaseContext'

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

  return (
    <>
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

      <ColorSelector database={database} />
      <Divider />
      <MenuItem>Delete (coming)</MenuItem>
    </>
  )
}

export const TagMenu = () => {
  const { database, updateDatabaseProps } = useDatabaseContext()

  if (!database) return null
  return (
    <Box toCenterY left3 top-2 h="1.5em">
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
              {database.props.name}
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
