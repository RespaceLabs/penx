import { Box } from '@fower/react'
import { ICellNode, IColumnNode, IRowNode } from '@penx/types'
import { TableCell } from './Cell'

interface Props {
  row: IRowNode
  columns: IColumnNode[]
  cells: ICellNode[]
}

export const TableRow = ({ columns = [], row, cells = [] }: Props) => {
  const rowCells = cells.filter((cell) => cell.props.rowId === row.id)
  return (
    <Box flex-1 toLeft>
      {rowCells.map((cell, index) => (
        <TableCell key={cell.id} cell={cell} columns={columns} index={index} />
      ))}
    </Box>
  )
}
