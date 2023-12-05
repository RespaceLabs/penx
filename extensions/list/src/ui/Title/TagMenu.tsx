import { Box } from '@fower/react'
import {
  Divider,
  MenuItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  usePopoverContext,
} from 'uikit'
import { db, getColorNames } from '@penx/local-db'
import { store } from '@penx/store'
import { TitleElement } from '../../types'

interface Props {
  element: TitleElement
}

function ColorSelector({ element }: Props) {
  const { close } = usePopoverContext()
  const colorNames = getColorNames()

  async function selectColor(color: string) {
    const node = await db.getNode(element.id!)
    const newNode = await db.updateNode(element.id!, {
      props: {
        ...node.props,
        color: color,
      },
    })

    close()
    const nodes = await db.listNodesBySpaceId(node.spaceId)
    store.node.setNodes(nodes)
    store.node.selectNode(newNode)
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

export const TagMenu = ({ element }: Props) => {
  return (
    <Box absolute toCenterY left3 top-2 h="1.5em">
      <Popover>
        <PopoverTrigger asChild>
          <Box
            contentEditable={false}
            cursorPointer
            bg={element.props?.color || 'black'}
            square="1.5em"
            textSM
            white
            roundedFull
            toCenter
          >
            #
          </Box>
        </PopoverTrigger>
        <PopoverContent w-220>
          <ColorSelector element={element} />
          <Divider />

          <MenuItem>Delete (coming)</MenuItem>
        </PopoverContent>
      </Popover>
    </Box>
  )
}
