import { useMemo } from 'react'
import { Box } from '@fower/react'
import { ArraySorter } from '@penx/indexeddb'
import { IRowNode } from '@penx/model-types'
import { useDatabaseContext } from '../DatabaseContext'
import { AddRowBtn } from './AddRowBtn'
import { TableRow } from './TableRow'

export const TableBody = () => {
  const { columns, rows, cells, currentView } = useDatabaseContext()

  const sortedColumns = currentView.props.columns.map(({ id }) => {
    return columns.find((col) => col.id === id)!
  })

  // TODO:
  const sortedRows = rows

  if (!columns.length) return null

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
