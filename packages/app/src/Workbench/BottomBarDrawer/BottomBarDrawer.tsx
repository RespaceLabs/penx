import { styled } from '@fower/react'
import { Drawer } from 'vaul'
import { useBottomBarDrawer } from '@penx/hooks'
import { QuickAddEditor } from './QuickAddEditor'

const DrawerOverlay = styled(Drawer.Overlay)
const DrawerContent = styled(Drawer.Content)

export const BottomBarDrawer = () => {
  const { isOpen, close, open } = useBottomBarDrawer()

  return (
    <Drawer.Root
      shouldScaleBackground
      open={isOpen}
      onOpenChange={(o) => {
        if (o) {
          open()
        } else {
          close()
        }
      }}
    >
      <Drawer.Portal>
        <DrawerOverlay fixed bgBlack--T60 zIndex-100 css={{ inset: 0 }} />
        <DrawerContent
          overflowHidden
          bgWhite
          column
          roundedTop2XL
          h={`calc(100vh - 40px)`}
          fixed
          bottom-0
          left-0
          right-0
          zIndex-101
          autoFocus
          // overflowHidden
        >
          <QuickAddEditor />
        </DrawerContent>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
