import { Box } from '@fower/react'
import { ViewType } from '@penx/model-types'
import { useDatabaseContext } from '../DatabaseContext'
import { FilterField } from './FilterField'
import { GroupField } from './GroupField'
import { HideField } from './HideField/HideField'
import { SortField } from './SortField'
import { TableField } from './TableField'

export const ViewToolBar = () => {
  const { currentView } = useDatabaseContext()

  return (
    <Box toCenterY gap1>
      <HideField />
      <FilterField />
      <SortField />
      <GroupField />
      {/* {currentView.props.viewType === ViewType.TABLE && <TableField />} */}
    </Box>
  )
}
