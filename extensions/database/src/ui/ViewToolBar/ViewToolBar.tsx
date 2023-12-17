import { Box } from '@fower/react'
import { FilterField } from './FilterField'
import { GroupField } from './GroupField'
import { HideField } from './HideField/HideField'
import { SortField } from './SortField'

export const ViewToolBar = () => {
  return (
    <Box toCenterY gap1>
      <HideField />
      <FilterField />
      <SortField />
      <GroupField />
    </Box>
  )
}
