import { Box } from '@fower/react'
import { Plus } from 'lucide-react'
import {
  Avatar,
  AvatarFallback,
  Button,
  modalController,
  PopoverClose,
} from 'uikit'
import { ModalNames } from '@penx/constants'
import { useSpaces, useSpaceService } from '@penx/hooks'
import { ISpace } from '@penx/types'

function SpaceItem({
  item,
  activeSpace,
}: {
  item: ISpace
  activeSpace: ISpace
}) {
  const active = activeSpace.id === item.id
  const spaceService = useSpaceService()
  return (
    <PopoverClose asChild>
      <Box
        key={item.id}
        bgGray100={active}
        bgGray100--hover
        toCenterY
        py3
        px3
        gapX2
        roundedXL
        cursorPointer
        transitionColors
        onClick={async () => {
          await spaceService.selectSpace(item.id)
        }}
      >
        <Avatar roundedFull rounded2XL={active}>
          <AvatarFallback>{item.name}</AvatarFallback>
        </Avatar>
        <Box>{item.name}</Box>
      </Box>
    </PopoverClose>
  )
}

export const SpaceList = () => {
  const { spaces, activeSpace } = useSpaces()

  return (
    <Box toCenterX w-100p p3>
      <Box flex-1 column gap2>
        {spaces?.map((item) => (
          <SpaceItem key={item.id} item={item} activeSpace={activeSpace} />
        ))}
        <Box mt4>
          <PopoverClose asChild>
            <Button
              toLeft
              variant="ghost"
              w-100p
              onClick={() => {
                modalController.open(ModalNames.CREATE_SPACE)
              }}
            >
              <Plus />
              <Box>New Space</Box>
            </Button>
          </PopoverClose>
        </Box>
        <Box mt4>
          <PopoverClose asChild>
            <Button
              toLeft
              variant="ghost"
              w-100p
              onClick={() => {
                modalController.open(ModalNames.IMPORT_SPACE)
              }}
            >
              <Plus />
              <Box>Import Space</Box>
            </Button>
          </PopoverClose>
        </Box>
      </Box>
    </Box>
  )
}
