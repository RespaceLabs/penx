import { styled } from '@fower/react'
import { TerminalIcon } from 'lucide-react'
import { Drawer } from 'vaul'
import { Button } from 'uikit'
import { usePaletteDrawer } from '@penx/hooks'
import { CommandPanel } from '../Palette'

const DrawerOverlay = styled(Drawer.Overlay)
const DrawerContent = styled(Drawer.Content)

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
        <Button type="button" size="sm" colorScheme="white" isSquare>
          <TerminalIcon />
        </Button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <DrawerOverlay fixed bgBlack--T60 zIndex-100 css={{ inset: 0 }} />
        <DrawerContent
          bgGray100
          column
          roundedTop2XL
          h-100p
          mt-24
          maxH-96p
          fixed
          bottom-0
          left-0
          right-0
          zIndex-101
          overflowHidden
        >
          <CommandPanel isMobile />
        </DrawerContent>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
