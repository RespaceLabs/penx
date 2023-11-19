import { Box } from '@fower/react'
import { useDatabaseContext } from '../DatabaseContext'
import { AddRowBtn } from './AddRowBtn'
import { TableRow } from './TableRow'

export const TableBody = () => {
  const { columns, rows, cells } = useDatabaseContext()
  if (!columns.length) return null

  return (
    <Box column flex-1>
      {rows.map((row, index) => (
        <TableRow
          key={row.id}
          columns={columns}
          row={row}
          cells={cells}
          index={index}
        />
      ))}
      {/* <AddRowBtn /> */}
    </Box>
  )
}
