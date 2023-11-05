import { Box } from '@fower/react'
import { useDatabaseContext } from '../DatabaseContext'
import { AddColumnBtn } from './AddColumnBtn'
import { ColumnItem } from './ColumnItem'

export const TableHeader = () => {
  const { columns } = useDatabaseContext()
  if (!columns.length) return null

  return (
    <Box flex-1 toLeft>
      {columns.map((column, index) => (
        <ColumnItem key={column.id} column={column} index={index} />
      ))}
      <AddColumnBtn />
    </Box>
  )
}
