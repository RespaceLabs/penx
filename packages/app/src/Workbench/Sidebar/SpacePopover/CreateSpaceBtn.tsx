import { Box } from '@fower/react'
import { Plus } from 'lucide-react'
import { Button, modalController, PopoverClose } from 'uikit'
import { ModalNames } from '@penx/constants'
import { useSidebarDrawer } from '@penx/hooks'

export const CreateSpaceBtn = () => {
  const { close } = useSidebarDrawer()

  return (
    <PopoverClose asChild>
      <Button
        toLeft--i
        px-14--i
        variant="ghost"
        w-100p
        onClick={() => {
          modalController.open(ModalNames.CREATE_SPACE)
          close?.()
        }}
      >
        <Plus size={16} />
        <Box>New Space</Box>
      </Button>
    </PopoverClose>
  )
}
