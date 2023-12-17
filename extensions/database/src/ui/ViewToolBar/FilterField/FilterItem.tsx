import { Box } from '@fower/react'
import { CloseButton, Input } from 'uikit'
import { Filter } from '@penx/model-types'
import { useDatabaseContext } from '../../DatabaseContext'
import { FieldSelect } from './FieldSelect'
import { OperatorSelect } from './OperatorSelect'

interface Props {
  index: number
  filter: Filter
}

export const FilterItem = ({ index, filter }: Props) => {
  const { deleteFilter, currentView } = useDatabaseContext()

  async function removeFilter() {
    deleteFilter(currentView.id, filter.columnId)
  }

  return (
    <Box toCenterY toBetween gap2>
      <FieldSelect index={index} filter={filter}></FieldSelect>
      <OperatorSelect index={index} filter={filter}></OperatorSelect>
      <Input size="sm" flex-1 />
      <CloseButton size={20} onClick={() => removeFilter()}></CloseButton>
    </Box>
  )
}
