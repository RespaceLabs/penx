import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Filter, OperatorType } from '@/lib/model'

import { ChevronDown } from 'lucide-react'

interface FieldSelectProps {
  filter: Filter
  updateFilter: (
    columnId: string,
    newColumnId: string,
    props?: Partial<Filter>,
  ) => void
}

export function OperatorSelect({ filter, updateFilter }: FieldSelectProps) {
  return (
    <Popover>
      <PopoverTrigger>
        <div className="flex items-center justify-between border border-foreground/20 hover:bg-foreground/10 px-2 p-8 w-[120px] rounded-lg text-sm">
          <div>{filter.operator}</div>
          <ChevronDown size={16} />
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <div>
          {Object.keys(OperatorType).map((type) => (
            <div
              key={type}
              // selected={type === filter.operator}
              onClick={() => {
                updateFilter(filter.columnId, filter.columnId, {
                  operator: type as OperatorType,
                })
              }}
            >
              <div>{type}</div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
