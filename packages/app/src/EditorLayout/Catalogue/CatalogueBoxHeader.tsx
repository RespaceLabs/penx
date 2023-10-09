import { Box } from '@fower/react'
import { Plus } from 'lucide-react'
import { Button } from 'uikit'
import { NewDocPopover } from './NewDocPopover'

export const CatalogueBoxHeader = () => {
  return (
    <Box toCenterY toBetween gap2 my2>
      <Box fontBold ml2>
        Tree view
      </Box>
      <NewDocPopover>
        <Button
          size="sm"
          variant="ghost"
          colorScheme="gray700"
          isSquare
          roundedFull
        >
          <Plus />
        </Button>
      </NewDocPopover>
    </Box>
  )
}
