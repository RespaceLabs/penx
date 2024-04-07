import { ChangeEvent } from 'react'
import { Box } from '@fower/react'
import { CloseButton, Input } from 'uikit'
import { OperatorSelect } from '@penx/database-ui'
import { Filter } from '@penx/model-types'
import { DashboardViewColumn } from '..'
import { FieldSelect } from './FieldSelect'

interface Props {
  filter: Filter
  sortedColumns: DashboardViewColumn[]
  deleteFilter: (columnId: string) => void
  updateFilter: (columnId: string, newColumnId: string) => void
  onChangeValue: (val: ChangeEvent<HTMLInputElement>, columnId: string) => void
}

export const FilterItem = ({
  filter,
  sortedColumns,
  deleteFilter,
  updateFilter,
  onChangeValue,
}: Props) => {
  return (
    <Box toCenterY toBetween gap2>
      <FieldSelect
        filter={filter}
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
