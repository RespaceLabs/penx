import { FC } from 'react'
import { Box } from '@fower/react'
import { CatalogueBox } from './Catalogue/CatalogueBox'

interface Props {}

export const TreeView: FC<Props> = () => {
  return (
    <Box gray600 px3 py4 bgWhite rounded2XL>
      <CatalogueBox />
    </Box>
  )
}
