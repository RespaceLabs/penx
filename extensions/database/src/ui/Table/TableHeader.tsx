import { Box } from '@fower/react'
import { useDatabaseContext } from '../DatabaseContext'
import { AddColumnBtn } from './AddColumnBtn'
import { ColumnItem } from './ColumnItem'

export const TableHeader = () => {
  const { columns } = useDatabaseContext()
  if (!columns.length) return null

  return (
    <Box flex-1 toLeft>
      <Box
        sticky
        toCenter
        left0
        bgWhite
        h-40
        zIndex-1000
        w-70
        borderBottom
        borderLeft
        borderTop
        flexShrink={0}
      >
        <Box as="input" type="checkbox" />
      </Box>
      {columns.map((column, index) => (
        <ColumnItem key={column.id} column={column} index={index} />
      ))}
      <AddColumnBtn />
    </Box>
  )
}
