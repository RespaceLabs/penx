import { usePaletteDrawer } from '@/hooks'
import { MotionButton } from '@/lib/widget'
import { Search } from 'lucide-react'
import { Drawer } from 'vaul'

const DrawerOverlay = Drawer.Overlay
const DrawerContent = Drawer.Content

export const PaletteDrawer = () => {
  const { isOpen, close, open } = usePaletteDrawer()
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
      <Drawer.Trigger asChild>
        <MotionButton
          type="button"
          size="sm"
          className="rounded-full p-0"
          variant="ghost"
          whileTap={{
            scale: 1.2,
          }}
        >
          <Search />
        </MotionButton>
      </Drawer.Trigger>
      <Drawer.Portal>
        <DrawerOverlay className="fixed bg-foreground/40 z-40 inset-0" />
        <DrawerContent className="bg-foreground/10 flex flex-col rounded-t-2xl h-full mt-6 fixed bottom-0 left-0 right-0 z-50 overflow-hidden">
          {/* <CommandPanel isMobile /> */}
        </DrawerContent>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
