import { Box } from '@fower/react'
import { Plus } from 'lucide-react'
import { Button, modalController, PopoverClose } from 'uikit'
import { ModalNames } from '@penx/constants'
import { useSidebarDrawer, useSpaces } from '@penx/hooks'
import { SpaceItem } from './SpaceItem'
import { UploadButton } from './UploadButton'

export const SpaceList = () => {
  const { spaces, activeSpace } = useSpaces()
  const { close } = useSidebarDrawer()

  return (
    <Box toCenterX w-100p p2>
      <Box flex-1 column gap-2>
        {spaces?.map((item) => (
          <SpaceItem key={item.id} item={item} activeSpace={activeSpace} />
        ))}
        <Box>
          <PopoverClose asChild>
            <Button
              toLeft
              variant="ghost"
              w-100p
              onClick={() => {
                modalController.open(ModalNames.CREATE_SPACE)
                close?.()
              }}
            >
              <Plus />
              <Box>New Space</Box>
            </Button>
          </PopoverClose>

          <UploadButton />
        </Box>
      </Box>
    </Box>
  )
}
