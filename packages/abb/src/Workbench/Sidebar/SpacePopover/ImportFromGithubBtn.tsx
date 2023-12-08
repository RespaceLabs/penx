import { Box } from '@fower/react'
import { Github } from 'lucide-react'
import { Button, modalController, PopoverClose } from 'uikit'
import { ModalNames } from '@penx/constants'
import { useSidebarDrawer } from '@penx/hooks'

export const ImportFromGithubBtn = () => {
  const { close } = useSidebarDrawer()

  return (
    <PopoverClose asChild>
      <Button
        toLeft--i
        px-14--i
        variant="ghost"
        w-100p
        onClick={() => {
          modalController.open(ModalNames.RESTORE_FROM_GITHUB)
          close?.()
        }}
      >
        <Github size={16} />
        <Box>Restore from github</Box>
      </Button>
    </PopoverClose>
  )
}
