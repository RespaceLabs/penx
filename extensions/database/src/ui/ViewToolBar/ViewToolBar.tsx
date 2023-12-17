import { Box } from '@fower/react'
import { HideField } from './HideField/HideField'
import { SortField } from './SortField'

export const ViewToolBar = () => {
  return (
    <Box toCenterY gap1>
      <HideField />
      <SortField />
    </Box>
  )
}
