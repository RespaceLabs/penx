import { Box } from '@fower/react'
import { Check, ChevronDown } from 'lucide-react'
import { Menu, MenuItem, Popover, PopoverContent, PopoverTrigger } from 'uikit'
import { Filter, IColumnNode } from '@penx/model-types'
import { mappedByKey } from '@penx/shared'
import { FieldIcon } from '../../shared/FieldIcon'

interface FieldSelectProps {
  filter: Filter
  columns: IColumnNode[]
  sortedColumns: IColumnNode[]
  updateFilter: (
    columnId: string,
    newColumnId: string,
    props?: Partial<Filter>,
  ) => void
}
export function FieldSelect({
  sortedColumns,
  filter,
  columns,
  updateFilter,
}: FieldSelectProps) {
  const column = mappedByKey(columns)[filter.columnId]

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
                  updateFilter(filter.columnId, item.id)
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
