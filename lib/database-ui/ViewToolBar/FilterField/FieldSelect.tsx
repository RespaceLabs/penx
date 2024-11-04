import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Filter, IColumnNode } from '@/lib/model'
import { mappedByKey } from '@/lib/shared'

import { Check, ChevronDown } from 'lucide-react'
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
        <div className="flex items-center justify-between border border-foreground/20 hover:bg-foreground/5 px-2 h-8 rounded-lg cursor-pointer w-[180px]">
          <div className="flex items-center gap-1">
            <FieldIcon fieldType={column.props.fieldType} />
            <div className="text-sm">{column.props.displayName}</div>
          </div>
          <ChevronDown size={16} />
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <div>
          {!sortedColumns.length && (
            <div
              className="flex items-center px-2 py-4 text-sm text-foreground/40"
              onClick={close}
            >
              No filters
            </div>
          )}
          {sortedColumns.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                updateFilter(filter.columnId, item.id)
                close()
              }}
            >
              <div className="flex items-center gap-2">
                <FieldIcon fieldType={item.props.fieldType} />
                <div>{item.props.displayName}</div>
              </div>
              {item.id === filter.columnId && <Check size={18}></Check>}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
