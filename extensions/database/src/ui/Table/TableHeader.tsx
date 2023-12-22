import { Box } from '@fower/react'
import { FIRST_COL_WIDTH } from '../../constants'
import { useDatabaseContext } from '../DatabaseContext'
import { AddColumnBtn } from './AddColumnBtn'
import { ColumnItem } from './ColumnItem/ColumnItem'

export const TableHeader = () => {
  const { columns, views, currentView } = useDatabaseContext()
  if (!columns.length) return null

  let { viewColumns = [] } = currentView.props

  // TODO: fallback to old data
  if (!viewColumns.length) {
    viewColumns = (currentView.props as any)?.columns.map((i: any) => ({
      columnId: i.id,
      ...i,
    }))
  }

  const sortedColumns = viewColumns
    .map(({ columnId }) => {
      return columns.find((col) => col.id === columnId)!
    })
    .filter((col) => !!col)

  return (
    <Box flex-1 toLeft>
      <Box
        toCenter
        bgWhite
        h-36
        borderBottom
        borderLeft
        borderTop
        flexShrink-0
        w={FIRST_COL_WIDTH}
      >
        <Box as="input" type="checkbox" mr--8 />
      </Box>
      {sortedColumns.map((column, index) => (
        <ColumnItem
          key={column.id}
          column={column}
          view={currentView}
          index={index}
        />
      ))}
      <AddColumnBtn />
    </Box>
  )
}
