import { Box } from '@fower/react'
import { CatalogueBox } from '../EditorLayout/Catalogue/CatalogueBox'
import { SettingsModal } from '../EditorLayout/SettingsModal/SettingsModal'
import { SpacePopover } from '../EditorLayout/SpacePopover'

export const Sidebar = () => {
  return (
    <Box
      column
      borderRight
      borderGray100
      flex-1
      display={['none', 'none', 'flex']}
      bgZinc100--T60
    >
      <SpacePopover />
      <Box flex-1 gray600 px3>
        <CatalogueBox />
      </Box>
      <SettingsModal></SettingsModal>
    </Box>
  )
}
