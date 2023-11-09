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
    store.selectNode(node)
  }
  return (
    <Box flex-1 contentEditable={false} {...attributes} leadingNormal>
      <Box inlineFlex px2 py1 rounded cursorPointer onClick={selectDatabase}>
        {element.name}
      </Box>
      {children}
    </Box>
  )
}
