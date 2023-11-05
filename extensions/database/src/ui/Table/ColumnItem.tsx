import { Box } from '@fower/react'
import { IColumnNode } from '@penx/types'
import { FieldIcon } from './FieldIcon'

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
      borderRight
      h-40
      toCenterY
      px3
      gap2
      cursorPointer
      w={width}
    >
      <FieldIcon fieldType={column.props.fieldType} />
      <Box>{column.props.name}</Box>
    </Box>
  )
}
