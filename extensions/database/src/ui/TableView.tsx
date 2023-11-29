import { PropsWithChildren } from 'react'
import { Box } from '@fower/react'
import { DatabaseHeader } from './DatabaseHeader'
import { TableBody } from './Table/TableBody'
import { TableHeader } from './Table/TableHeader'

interface TableViewProps {}

export const TableView = ({}: PropsWithChildren<TableViewProps>) => {
  return (
    <Box>
      {/* <DatabaseHeader /> */}
      <TableHeader />
      <TableBody />
    </Box>
  )
}
