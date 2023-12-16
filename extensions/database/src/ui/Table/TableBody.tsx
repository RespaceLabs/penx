import { Box } from '@fower/react'
import { useDatabaseContext } from '../DatabaseContext'
import { AddRowBtn } from './AddRowBtn'
import { TableRow } from './TableRow'

export const TableBody = () => {
  const { columns, views, rows, cells, currentView } = useDatabaseContext()
  if (!columns.length) return null

  const sortedColumns = currentView.props.columns.map(({ id }) => {
    return columns.find((col) => col.id === id)!
  })

  return (
    <Box column flex-1>
      {rows.map((row, index) => (
        <TableRow
          key={row.id}
          columns={sortedColumns}
          row={row}
          cells={cells}
          index={index}
        />
      ))}
      {/* <AddRowBtn /> */}
    </Box>
  )
}
