import { Box } from '@fower/react'
import { Input } from 'uikit'
import { ICellNode, IColumnNode } from '@penx/types'

interface Props {
  index: number
  columns: IColumnNode[]
  cell: ICellNode
}

export const TableCell = ({ columns, cell, index }: Props) => {
  const column = columns.find((c) => c.id === cell.props.columnId)!
  const { width = 120 } = column.props

  return (
    <Box
      borderRight
      borderBottom
      borderLeft={index === 0}
      w={width}
      px2
      py2
      minH-40
    >
      <Input defaultValue={'GO'} />
      {/* <Box>{cell.props.data}Cell</Box> */}
    </Box>
  )
}
