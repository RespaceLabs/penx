import { Box } from '@fower/react'
import { useQuery } from '@tanstack/react-query'
import { Button } from 'uikit'
import { ElementProps } from '@penx/extension-typings'
import { db } from '@penx/local-db'
import { DatabaseElement } from '../types'
import { DatabaseProvider } from './DatabaseContext'
import { TableBody } from './Table/TableBody'
import { TableHeader } from './Table/TableHeader'

export const Database = ({
  attributes,
  element,
  children,
}: ElementProps<DatabaseElement>) => {
  const { databaseId } = element

  return (
    <Box flex-1 mb8 mt8 contentEditable={false} {...attributes}>
      <DatabaseProvider databaseId={databaseId}>
        <Box>
          <TableHeader />
          <TableBody />
          {children}
        </Box>
      </DatabaseProvider>
    </Box>
  )
}
