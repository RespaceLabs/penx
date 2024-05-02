import { forwardRef } from 'react'
import { Box } from '@fower/react'
import { CellField } from '@penx/cell-fields'
import { useDatabase } from '@penx/node-hooks'
import { mappedByKey } from '@penx/shared'
import { PrimaryCell } from './Cell/PrimaryCell'
import { FieldIcon } from './shared/FieldIcon'

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

        const isRefCell = index === 0 && cell.props.ref

        const content = isRefCell ? (
          <PrimaryCell
            key={index}
            index={0}
            cell={cell}
            column={column}
            width={0}
            border
            roundedXL
            onBlur={() => {}}
            selected={false}
            updateCell={() => {}}
          />
        ) : (
          <CellField index={index} cell={cell} columns={sortedColumns} />
        )

        return (
          <Box key={cell.id}>
            <Box mb2 toCenterY gap1 gray600>
              <FieldIcon fieldType={column.props.fieldType} />
              <Box textXS>{column.props.displayName}</Box>
            </Box>
            {content}
          </Box>
        )
      })}
    </Box>
  )
})
