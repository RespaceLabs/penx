import { Box } from '@fower/react'
import { Plus } from 'lucide-react'
import { Button } from 'uikit'
import { useCatalogue } from '@penx/hooks'
import { CatalogueNodeType } from '@penx/model-types'
import { store } from '@penx/store'

export const CatalogueBoxHeader = () => {
  return (
    <Box toCenterY toBetween gap2 my2>
      <Box fontBold ml2 textSM>
        ALL PAGES
      </Box>

      <Button
        size="sm"
        variant="ghost"
        colorScheme="gray700"
        isSquare
        roundedFull
        onClick={async () => {
          await store.catalogue.addNode(CatalogueNodeType.NODE)
        }}
      >
        <Plus />
      </Button>
    </Box>
  )
}
