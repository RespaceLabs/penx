import { forwardRef } from 'react'
import { Box } from '@fower/react'
import { useDatabase } from '@penx/node-hooks'
import { mappedByKey } from '@penx/shared'
import { FieldIcon } from './shared/FieldIcon'
import { CellField } from './tag/fields'

interface Props {
  databaseId: string
  rowId: string
}

export const RowForm = forwardRef<HTMLDivElement, Props>(function TagForm(
  { databaseId, rowId },
  ref,
) {
  const database = useDatabase(databaseId)
  const { columns, views, cells } = database

  // console.log('========cells；', cells, 'rowId:', rowId)

  const currentView = views[0]

  const columnMap = mappedByKey(columns, 'id')
  const { viewColumns = [] } = currentView.props
  const sortedColumns = viewColumns.map(({ columnId }) => columnMap[columnId])

  const rowCells = sortedColumns.map((column) => {
    return cells.find(
      (cell) => cell.props.rowId === rowId && cell.props.columnId === column.id,
    )!
  })

  // console.log('========rowCells:', rowCells)

  return (
    <Box ref={ref} column gap4>
      {rowCells.map((cell, index) => {
        // console.log('=====cell:', cell)

        const column = columns.find((col) => col.id === cell.props.columnId)!

        if (!column) return null

        return (
          <Box key={cell.id}>
            <Box mb2 toCenterY gap1 gray600>
              <FieldIcon fieldType={column.props.fieldType} />
              <Box textXS>{column.props.displayName}</Box>
            </Box>

            <CellField index={index} cell={cell} columns={sortedColumns} />
          </Box>
        )
      })}
    </Box>
  )
})
