import { ChangeEvent } from 'react'
import { Input } from '@/components/ui/input'
import { Filter, IColumnNode, IViewNode } from '@/lib/model'
import { FieldSelect } from './FieldSelect'
import { OperatorSelect } from './OperatorSelect'

interface Props {
  filter: Filter
  columns: IColumnNode[]
  sortedColumns: IColumnNode[]
  deleteFilter: (columnId: string) => void
  updateFilter: (columnId: string, newColumnId: string) => void
  onChangeValue: (val: ChangeEvent<HTMLInputElement>, columnId: string) => void
}

export const FilterItem = ({
  filter,
  deleteFilter,
  updateFilter,
  onChangeValue,
  columns,
  sortedColumns,
}: Props) => {
  return (
    <div className="flex items-center justify-between gap-2">
      <FieldSelect
        filter={filter}
        columns={columns}
        updateFilter={updateFilter}
        sortedColumns={sortedColumns}
      />
      <OperatorSelect filter={filter} updateFilter={updateFilter} />
      <Input
        size="sm"
        value={filter?.value}
        className="flex-1"
        onChange={(e) => onChangeValue(e, filter.columnId)}
      />
      {/* <CloseButton size={20} onClick={() => deleteFilter(filter.columnId)} /> */}
    </div>
  )
}
