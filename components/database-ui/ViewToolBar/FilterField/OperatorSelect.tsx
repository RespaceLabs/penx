'use client'

import { ChevronDown } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Filter, OperatorType } from '@/lib/types'
import { Menu, MenuItem } from '@ariakit/react'

interface FieldSelectProps {
  filter: Filter
  updateFilter: (
    fieldId: string,
    newFieldId: string,
    props?: Partial<Filter>,
  ) => void
}

export function OperatorSelect({ filter, updateFilter }: FieldSelectProps) {
  return (
    <Popover>
      <PopoverTrigger>
        <div className="flex items-center justify-between border px-2 h-8 w-32 rounded-lg text-sm">
          <div>{filter.operator}</div>
          <ChevronDown size={16} />
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <Menu w-120>
          {Object.keys(OperatorType).map((type) => (
            <MenuItem
              key={type}
              // selected={type === filter.operator}
              onClick={() => {
                // updateFilter(filter.columnId, filter.columnId, {
                //   operator: type as OperatorType,
                // })
                // close()
              }}
            >
              <div>{type}</div>
            </MenuItem>
          ))}
        </Menu>
      </PopoverContent>
    </Popover>
  )
}
