import { Box } from '@fower/react'
import { IColumnNode } from '@penx/types'
import { ColumnItem } from './ColumnItem'

interface Props {
  columns: IColumnNode[]
}

export const TableHeader = ({ columns = [] }: Props) => {
  if (!columns.length) return null

  return (
    <Box flex-1 toLeft>
      {columns.map((column, index) => (
        <ColumnItem key={column.id} column={column} index={index} />
      ))}
    </Box>
  )
}
