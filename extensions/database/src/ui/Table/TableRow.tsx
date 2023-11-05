import { Box } from '@fower/react'
import { ICellNode, IColumnNode, IRowNode } from '@penx/types'
import { IconDrag } from '../icons/IconDrag'
import { IconExpandRecord } from '../icons/IconExpandRecord'
import { TableCell } from './Cell'

interface Props {
  index: number
  row: IRowNode
  columns: IColumnNode[]
  cells: ICellNode[]
}

export const TableRow = ({ columns = [], row, cells = [], index }: Props) => {
  const firstColumnWidth = 70

  // TODO: need to improve performance
  const rowCells = columns.map((column) => {
    return cells.find(
      (cell) =>
        cell.props.rowId === row.id && cell.props.columnId === column.id,
    )!
  })
  return (
    <Box flex-1 toLeft>
      <Box
        className="grid-cell"
        inlineFlex
        toCenterY
        pl3
        px2
        sticky
        left0
        w={firstColumnWidth}
        // h-100p
        bgTransparent
        borderBottom
        borderLeft
        // borderRight
        flexShrink={0}
        zIndex-100
      >
        <IconDrag invisible visible--$gridrow--hover bgTransparent />
        <Box as="input" type="checkbox" hidden inlineBlock--$gridrow--hover />
        <Box textXS inlineBlock hidden--$gridrow--hover>
          {(index || 0) + 1}
        </Box>

        <IconExpandRecord
          size={12}
          gray600
          ml1
          invisible
          visible--$gridrow--hover
          cursorPointer
        />
      </Box>

      {rowCells.map((cell, index) => (
        <TableCell key={cell.id} cell={cell} columns={columns} index={index} />
      ))}
    </Box>
  )
}
