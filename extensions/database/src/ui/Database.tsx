import { Box } from '@fower/react'
import { ElementProps } from '@penx/extension-typings'
import { DatabaseElement } from '../types'
import { DatabaseProvider } from './DatabaseContext'
import { DatabaseHeader } from './DatabaseHeader'
import { TableBody } from './Table/TableBody'
import { TableHeader } from './Table/TableHeader'

export const Database = ({
  attributes,
  element,
  children,
}: ElementProps<DatabaseElement>) => {
  const { databaseId } = element

  return (
    <Box flex-1 contentEditable={false} {...attributes}>
      <DatabaseProvider databaseId={databaseId}>
        <Box>
          <DatabaseHeader />
          <TableHeader />
          <TableBody />
          {children}
        </Box>
      </DatabaseProvider>
    </Box>
  )
}
