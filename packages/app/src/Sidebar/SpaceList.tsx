import { Box } from '@fower/react'
import { Plus } from 'lucide-react'
import { Button, modalController, PopoverClose } from 'uikit'
import { ModalNames } from '@penx/constants'
import { useSpaces } from '@penx/hooks'
import { ISpace } from '@penx/model-types'
import { store } from '@penx/store'
import { Bullet } from '../components/Bullet'

function SpaceItem({
  item,
  activeSpace,
}: {
  item: ISpace
  activeSpace: ISpace
}) {
  const active = activeSpace.id === item.id
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
        textBase
        roundedLG
        cursorPointer
        transitionColors
        onClick={async () => {
          await store.selectSpace(item.id)
        }}
      >
        <Bullet size={20} innerSize={6} innerColor={item.color} />
        <Box>{item.name}</Box>
      </Box>
    </PopoverClose>
  )
}

export const SpaceList = () => {
  const { spaces, activeSpace } = useSpaces()

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
              }}
            >
              <Plus />
              <Box>New Space</Box>
            </Button>
          </PopoverClose>
        </Box>
      </Box>
    </Box>
  )
}
