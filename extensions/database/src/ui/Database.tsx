import { Box } from '@fower/react'
import { ElementProps } from '@penx/extension-typings'
import { DatabaseElement } from '../types'
import { DatabaseProvider } from './DatabaseContext'
import { ViewList } from './ViewList'
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
        <ViewList />
        <ViewRenderer />
      </DatabaseProvider>
    </Box>
  )
}
