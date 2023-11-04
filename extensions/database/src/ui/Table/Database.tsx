import { Box } from '@fower/react'
import { useQuery } from '@tanstack/react-query'
import { Button } from 'uikit'
import { ElementProps } from '@penx/extension-typings'
import { db } from '@penx/local-db'
import { DatabaseElement } from '../../types'
import { TableBody } from './TableBody'
import { TableHeader } from './TableHeader'

export const Database = ({
  attributes,
  element,
  children,
}: ElementProps<DatabaseElement>) => {
  const { databaseId } = element

  const { data } = useQuery([`table-${databaseId}`], () =>
    db.getDatabase(databaseId),
  )

  return (
    <Box flex-1 mb8 mt8 contentEditable={false} {...attributes}>
      <Box>
        <TableHeader columns={data?.columns as any} />
        <TableBody
          columns={data?.columns as any}
          rows={data?.rows as any}
          cells={data?.cells as any}
        />
        {children}
      </Box>
    </Box>
  )
}
