import { Box } from '@fower/react'
import { WORKBENCH_NAV_HEIGHT } from '@penx/constants'
import { SettingsSidebar } from '../SettingsModal/SettingsSidebar'
import { SettingsDrawer } from './SettingsDrawer'

export const PageSettings = () => {
  return (
    <Box bgNeutral100 column minH={`calc(100vh - ${WORKBENCH_NAV_HEIGHT}px)`}>
      <SettingsDrawer />
      <SettingsSidebar />
    </Box>
  )
}
