import { Box } from '@fower/react'
import { FIRST_COL_WIDTH } from '../../constants'
import { useDatabaseContext } from '../DatabaseContext'
import { AddColumnBtn } from './AddColumnBtn'
import { ColumnItem } from './ColumnItem/ColumnItem'
import { DeleteColumnModal } from './ColumnItem/DeleteColumnModal'

export const TableHeader = () => {
  const { columns, views } = useDatabaseContext()
  if (!columns.length) return null

  // TODO: views[0] is too hack
  const sortedColumns = views[0].children
    .map((id) => {
      return columns.find((col) => col.id === id)!
    })
    .filter((col) => !!col)

  return (
    <Box flex-1 toLeft>
      <DeleteColumnModal />
      <Box
        toCenter
        bgWhite
        h-40
        borderBottom
        borderLeft
        borderTop
        flexShrink-0
        w={FIRST_COL_WIDTH}
      >
        <Box as="input" type="checkbox" mr--8 />
      </Box>
      {sortedColumns.map((column, index) => (
        <ColumnItem key={column.id} column={column} index={index} />
      ))}
      <AddColumnBtn />
    </Box>
  )
}
