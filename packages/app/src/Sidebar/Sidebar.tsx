import { Box } from '@fower/react'
// import { CatalogueBox } from '../EditorLayout/Catalogue/CatalogueBox'
import { RecentlyEdited } from './RecentlyEdited'
import { RecentlyOpened } from './RecentlyOpened'
import { SpacePopover } from './SpacePopover'

export const Sidebar = () => {
  return (
    <Box
      column
      borderRight
      borderGray100
      flex-1
      display={['none', 'none', 'flex']}
      bgZinc100
      px2
      gap3
    >
      <SpacePopover />
      <RecentlyOpened />
      <RecentlyEdited />
      {/* <Box gray600 px3 py4 bgWhite rounded2XL>
        <CatalogueBox />
      </Box> */}
    </Box>
  )
}
