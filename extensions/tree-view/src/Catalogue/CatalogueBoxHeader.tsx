import { Box } from '@fower/react'
import { Plus } from 'lucide-react'
import { Button } from 'uikit'
import { NewDocButton } from './NewDocButton'

export const CatalogueBoxHeader = () => {
  return (
    <Box toCenterY toBetween gap2 mb2>
      <Box fontBold ml2>
        Tree view
      </Box>
      <NewDocButton>
        <Button
          size="sm"
          variant="ghost"
          colorScheme="gray700"
          isSquare
          roundedFull
        >
          <Plus />
        </Button>
      </NewDocButton>
    </Box>
  )
}
