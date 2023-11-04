import { Box } from '@fower/react'
import { ICellNode, IColumnNode, IRowNode } from '@penx/types'
import { TableRow } from './TableRow'

interface Props {
  columns: IColumnNode[]
  rows: IRowNode[]
  cells: ICellNode[]
}

export const TableBody = ({ columns = [], rows = [], cells = [] }: Props) => {
  if (!columns.length) return null

  return (
    <Box column flex-1>
      {rows.map((row) => (
        <TableRow key={row.id} columns={columns} row={row} cells={cells} />
      ))}
    </Box>
  )
}
