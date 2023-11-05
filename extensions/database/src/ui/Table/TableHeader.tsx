import { Box } from '@fower/react'
import { FIRST_COL_WIDTH } from '../../constants'
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
        borderBottom
        borderLeft
        borderTop
        flexShrink-0
        w={FIRST_COL_WIDTH}
      >
        <Box as="input" type="checkbox" mr--8 />
      </Box>
      {columns.map((column, index) => (
        <ColumnItem key={column.id} column={column} index={index} />
      ))}
      <AddColumnBtn />
    </Box>
  )
}
