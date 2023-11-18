import { Box } from '@fower/react'
import { ElementProps } from '@penx/extension-typings'
import { DatabaseElement } from '../types'
import { TableView } from './TableView'

export const Database = ({
  attributes,
  element,
  children,
}: ElementProps<DatabaseElement>) => {
  const { databaseId } = element

  return (
    <Box flex-1 contentEditable={false} {...attributes}>
      <TableView databaseId={databaseId}>{children}</TableView>
    </Box>
  )
}
