'use client'

import { Check, ChevronDown } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { mappedByKey } from '@/lib/shared'
import { Filter } from '@/lib/types'
import { Field } from '@/server/db/schema'
import { Menu, MenuItem } from '@ariakit/react'
import { FieldIcon } from '../../shared/FieldIcon'

interface FieldSelectProps {
  filter: Filter
  columns: Field[]
  sortedColumns: Field[]
  updateFilter: (
    fieldId: string,
    newFieldId: string,
    props?: Partial<Filter>,
  ) => void
}
export function FieldSelect({
  sortedColumns,
  filter,
  columns,
  updateFilter,
}: FieldSelectProps) {
  const column = mappedByKey(columns)[filter.fieldId]

  return (
    <Popover>
      <PopoverTrigger>
        <div className="flex items-center justify-between border px-2 h-8 w-32 rounded-lg text-sm">
          <div className="flex items-center gap-1">
            <FieldIcon fieldType={column.fieldType as any} />
            <div className="text-sm">{column.displayName}</div>
          </div>
          <ChevronDown size={16} />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[180px]">
        <Menu>
          {!sortedColumns.length && (
            <div
              className="flex items-center px-2 py-4 text-sm text-foreground/40"
              // onClick={close}
            >
              No filters
            </div>
          )}
          {sortedColumns.map((item) => (
            <MenuItem
              key={item.id}
              onClick={() => {
                // updateFilter(filter.columnId, item.id)
                // close()
              }}
            >
              <div className="flex items-center gap-2">
                <FieldIcon fieldType={item.fieldType} />
                <div>{item.displayName}</div>
              </div>
              {/* {item.id === filter.columnId && <Check size={18}></Check>} */}
            </MenuItem>
          ))}
        </Menu>
      </PopoverContent>
    </Popover>
  )
}
