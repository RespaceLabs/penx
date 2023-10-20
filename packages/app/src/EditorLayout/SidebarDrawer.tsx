import { Box, styled } from '@fower/react'
import { Cloud, Menu } from 'lucide-react'
import { Drawer } from 'vaul'
import { Button } from 'uikit'
import { useSidebarDrawer } from '@penx/hooks'
import { store } from '@penx/store'
import { FavoriteBox } from '../Sidebar/FavoriteBox/FavoriteBox'
import { RecentlyEdited } from '../Sidebar/RecentlyEdited'
import { SidebarItem } from '../Sidebar/SidebarItem'
import { SpacePopover } from '../Sidebar/SpacePopover'

const DrawerOverlay = styled(Drawer.Overlay)
const DrawerContent = styled(Drawer.Content)

export const DrawerSidebar = () => {
  const { isOpen, close, open } = useSidebarDrawer()
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
            <Box flex-1>
              <SidebarItem
                icon={<Cloud size={20} />}
                label="Sync"
                onClick={() => {
                  store.routeTo('SYNC')
                  close()
                }}
              />
              <FavoriteBox />
              <RecentlyEdited />
            </Box>
          </Box>
        </DrawerContent>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
