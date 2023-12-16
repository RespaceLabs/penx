import { Box } from '@fower/react'
import { ElementProps } from '@penx/extension-typings'
import { DatabaseElement } from '../types'
import { DatabaseProvider } from './DatabaseContext'
import { AddViewBtn } from './ViewNav/AddViewBtn'
import { ViewList } from './ViewNav/ViewList'
import { ViewRenderer } from './ViewRenderer'

export const Database = ({
  attributes,
  element,
  children,
}: ElementProps<DatabaseElement>) => {
  const { databaseId } = element

  return (
    <Box flex-1 {...attributes} contentEditable={false}>
      {children}

      <DatabaseProvider databaseId={databaseId}>
        <Box toCenterY gap2 mb2>
          <ViewList />
          <AddViewBtn />
        </Box>
        <ViewRenderer />
      </DatabaseProvider>
    </Box>
  )
}
