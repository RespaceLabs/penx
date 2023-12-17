import { Box } from '@fower/react'
import { Check, ChevronDown } from 'lucide-react'
import { Menu, MenuItem, Popover, PopoverContent, PopoverTrigger } from 'uikit'
import { Filter, IColumnNode } from '@penx/model-types'
import { mappedByKey } from '@penx/shared'
import { useDatabaseContext } from '../../DatabaseContext'
import { FieldIcon } from '../../shared/FieldIcon'

interface FieldSelectProps {
  filter: Filter
  index: number // filter index
}
export function FieldSelect({ filter, index }: FieldSelectProps) {
  const { currentView, columns } = useDatabaseContext()

  const sortedColumns = currentView.props.viewColumns
    .map((o) => columns.find((c) => c.id === o.columnId)!)
    .filter((i) => {
      const { filters = [] } = currentView.props
      const find = filters.find((item) => item.columnId === i.id)
      return !find
    })

  const column = mappedByKey(columns)[filter.columnId]

  function onSelectField(column: IColumnNode) {
    console.log('select filter', column)
  }

  return (
    <Popover>
      <PopoverTrigger>
        {({ isOpen }) => (
          <Box
            toBetween
            toCenterY
            border
            borderNeutral200
            bgGray100--hover
            px2
            h-34
            roundedLG
            cursorPointer
            w-180
          >
            <Box toCenterY gap1>
              <FieldIcon fieldType={column.props.fieldType} />
              <Box textSM>{column.props.name}</Box>
            </Box>
            <ChevronDown size={16} />
          </Box>
        )}
      </PopoverTrigger>
      <PopoverContent w-180>
        {({ close }) => (
          <Menu>
            {!sortedColumns.length && (
              <Box toCenter px2 py4 textSM gray400 onClick={close}>
                No filters
              </Box>
            )}
            {sortedColumns.map((item) => (
              <MenuItem
                key={item.id}
                toBetween
                toCenterY
                onClick={() => {
                  onSelectField(item)
                  close()
                }}
              >
                <Box toCenterY gap2>
                  <FieldIcon fieldType={item.props.fieldType} />
                  <Box>{item.props.name}</Box>
                </Box>
                {item.id === filter.columnId && <Check size={18}></Check>}
              </MenuItem>
            ))}
          </Menu>
        )}
      </PopoverContent>
    </Popover>
  )
}
