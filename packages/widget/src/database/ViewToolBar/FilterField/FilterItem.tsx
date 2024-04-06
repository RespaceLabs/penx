import { ChangeEvent } from 'react'
import { Box } from '@fower/react'
import { CloseButton, Input } from 'uikit'
import { Filter, IColumnNode, IViewNode } from '@penx/model-types'
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
    <Box toCenterY toBetween gap2>
      <FieldSelect
        filter={filter}
        columns={columns}
        updateFilter={updateFilter}
        sortedColumns={sortedColumns}
      />
      <OperatorSelect filter={filter} updateFilter={updateFilter} />
      <Input
        size="sm"
        flex-1
        value={filter?.value}
        onChange={(e) => onChangeValue(e, filter.columnId)}
      />
      <CloseButton size={20} onClick={() => deleteFilter(filter.columnId)} />
    </Box>
  )
}
