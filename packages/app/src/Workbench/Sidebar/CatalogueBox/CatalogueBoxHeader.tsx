import { Box } from '@fower/react'
import { Plus } from 'lucide-react'
import { Button } from 'uikit'
import { CatalogueNodeType } from '@penx/model-types'
import { store } from '@penx/store'

export const CatalogueBoxHeader = () => {
  return (
    <Box toCenterY toBetween gap2 my2>
      <Box fontBold ml2 textSM>
        ALL PAGES
      </Box>

      <Button
        size={28}
        px0
        py0
        variant="ghost"
        colorScheme="gray500"
        isSquare
        roundedFull
        onClick={async () => {
          await store.catalogue.addNode(CatalogueNodeType.NODE)
        }}
      >
        <Plus size={16} />
      </Button>
    </Box>
  )
}
