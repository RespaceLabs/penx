import { PropsWithChildren } from 'react'
import { Box } from '@fower/react'
import { DatabaseProvider } from './DatabaseContext'
import { DatabaseHeader } from './DatabaseHeader'
import { TableBody } from './Table/TableBody'
import { TableHeader } from './Table/TableHeader'

interface TableViewProps {
  databaseId: string
}

export const TableView = ({
  databaseId,
  children,
}: PropsWithChildren<TableViewProps>) => {
  return (
    <DatabaseProvider databaseId={databaseId}>
      <Box>
        {/* <DatabaseHeader /> */}
        <TableHeader />
        <TableBody />
        {children}
      </Box>
    </DatabaseProvider>
  )
}
