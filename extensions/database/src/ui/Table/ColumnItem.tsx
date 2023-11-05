import { Box } from '@fower/react'
import { Input } from 'uikit'
import { IColumnNode } from '@penx/types'

interface Props {
  index: number
  column: IColumnNode
}

export const ColumnItem = ({ column, index }: Props) => {
  const { width = 120 } = column.props
  return (
    <Box
      borderTop
      borderBottom
      // borderLeft={index === 0}
      borderRight
      h-40
      toCenterY
      px3
      w={width}
    >
      {/* <Input defaultValue={column.props.name} /> */}
      <Box>{column.props.name}</Box>
    </Box>
  )
}
