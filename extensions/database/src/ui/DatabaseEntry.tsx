import { Box } from '@fower/react'
import { ElementProps } from '@penx/extension-typings'
import { db } from '@penx/local-db'
import { store } from '@penx/store'
import { DatabaseEntryElement } from '../types'

export const DatabaseEntry = ({
  attributes,
  element,
  children,
}: ElementProps<DatabaseEntryElement>) => {
  async function selectDatabase() {
    const node = await db.getNode(element.databaseId)
    store.node.selectNode(node)
  }

  return (
    <Box flex-1 contentEditable={false} {...attributes} leadingNormal>
      <Box
        inlineFlex
        px2
        py1
        rounded
        cursorPointer
        textSM
        transitionColors
        bg--T92={element.props.color}
        bg--T88--hover={element.props.color}
        color={element.props.color}
        color--D4--hover={element.props.color}
        onClick={selectDatabase}
      >
        # {element.name}
      </Box>
      {children}
    </Box>
  )
}
