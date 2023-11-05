import { Box } from '@fower/react'
import { ICellNode, IColumnNode, IRowNode } from '@penx/types'
import { TableCell } from './Cell'

interface Props {
  row: IRowNode
  columns: IColumnNode[]
  cells: ICellNode[]
}

export const TableRow = ({ columns = [], row, cells = [] }: Props) => {
  // TODO: need to improve performance
  const rowCells = columns.map((column) => {
    return cells.find(
      (cell) =>
        cell.props.rowId === row.id && cell.props.columnId === column.id,
    )!
  })
  return (
    <Box flex-1 toLeft>
      {rowCells.map((cell, index) => (
        <TableCell key={cell.id} cell={cell} columns={columns} index={index} />
      ))}
    </Box>
  )
}
