import { Box, styled } from '@fower/react'
import { Menu } from 'lucide-react'
import { Drawer } from 'vaul'
import { Button } from 'uikit'
import { SpacePopover } from '../Sidebar/SpacePopover'
import { CatalogueBox } from './Catalogue/CatalogueBox'

const DrawerOverlay = styled(Drawer.Overlay)
const DrawerContent = styled(Drawer.Content)

export const DrawerSidebar = () => {
  return (
    <Drawer.Root shouldScaleBackground>
      <Drawer.Trigger asChild>
        <Button variant="ghost" size="sm" isSquare p0 colorScheme="gray600">
          <Menu />
        </Button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <DrawerOverlay fixed bgBlack--T60 zIndex-100 css={{ inset: 0 }} />
        <DrawerContent
          bgWhite
          column
          roundedTop2XL
          h-94vh
          fixed
          bottom-0
          left-0
          right-0
          zIndex-101
          overflowHidden
        >
          <Box overflowAuto p5>
            <SpacePopover />
            <Box flex-1 gray600 px3>
              <CatalogueBox />
            </Box>
          </Box>
        </DrawerContent>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
