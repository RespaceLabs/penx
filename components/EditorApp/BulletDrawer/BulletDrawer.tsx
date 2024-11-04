import { useBulletDrawer } from '@/hooks'
import { Drawer } from 'vaul'
import { BulletMenuBox } from './BulletMenuBox'

const DrawerOverlay = Drawer.Overlay
const DrawerContent = Drawer.Content

export const BulletDrawer = () => {
  const { isOpen, close, open } = useBulletDrawer()

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
        <DrawerOverlay className="fixed bg-foreground/40 z-40 inset-0" />
        <DrawerContent className="bg-foreground/10 flex flex-col rounded-t-2xl h-full mt-6 fixed bottom-0 left-0 right-0 z-50 overflow-hidden">
          {/* <CommandPanel isMobile /> */}
          <BulletMenuBox />
        </DrawerContent>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
