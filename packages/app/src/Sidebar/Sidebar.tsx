import { Box } from '@fower/react'
import { CatalogueBox } from '../EditorLayout/Catalogue/CatalogueBox'
import { CurrentSpace } from '../EditorLayout/CurrentSpace'

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
      <CurrentSpace />
      <Box flex-1 gray600 px3>
        <CatalogueBox />
      </Box>
    </Box>
  )
}
