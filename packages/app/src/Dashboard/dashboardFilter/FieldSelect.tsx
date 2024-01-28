import { Box } from '@fower/react'
import { Check, ChevronDown } from 'lucide-react'
import { Menu, MenuItem, Popover, PopoverContent, PopoverTrigger } from 'uikit'
import { Filter, IColumnNode } from '@penx/model-types'
import { DashboradViewColumn } from '..'

interface FieldSelectProps {
  filter: Filter
  sortedColumns: DashboradViewColumn[]
  updateFilter: (
    columnId: string,
    newColumnId: string,
    props?: Partial<Filter>,
  ) => void
}
export function FieldSelect({
  sortedColumns,
  filter,
  updateFilter,
}: FieldSelectProps) {
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
              <Box textSM>{filter.columnId}</Box>
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
                key={item.name}
                toBetween
                toCenterY
                onClick={() => {
                  updateFilter(filter.columnId, item.name)
                  close()
                }}
              >
                <Box toCenterY gap2>
                  <Box>{item.name}</Box>
                </Box>
                {item.name === filter.columnId && <Check size={18}></Check>}
              </MenuItem>
            ))}
          </Menu>
        )}
      </PopoverContent>
    </Popover>
  )
}
