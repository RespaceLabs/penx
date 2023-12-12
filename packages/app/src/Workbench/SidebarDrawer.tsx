import { Box, styled } from '@fower/react'
import { CalendarDays, Cloud, Folder, Hash, Inbox, Menu } from 'lucide-react'
import { Drawer } from 'vaul'
import { Button } from 'uikit'
import { useNodes, useSidebarDrawer } from '@penx/hooks'
import { useSession } from '@penx/session'
import { store } from '@penx/store'
import LoginWithGoogleButton from '../components/LoginWithGoogleButton'
import { FavoriteBox } from './Sidebar/FavoriteBox/FavoriteBox'
import { SidebarItem } from './Sidebar/SidebarItem'
import { SpacePopover } from './Sidebar/SpacePopover/SpacePopover'
import { TreeView } from './Sidebar/TreeView/TreeView'
import { SyncPopover } from './StatusBar/SyncPopover'

const DrawerOverlay = styled(Drawer.Overlay)
const DrawerContent = styled(Drawer.Content)

export const DrawerSidebar = () => {
  const { isOpen, close, open } = useSidebarDrawer()
  const { data: session } = useSession()
  const { nodes, nodeList } = useNodes()
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
          // overflowHidden
        >
          <Box column overflowAuto px5 py2 flex-1>
            <SpacePopover />
            <Box flex-1 mt3>
              <SidebarItem
                icon={<CalendarDays size={16} />}
                label="Today"
                onClick={() => {
                  store.node.selectDailyNote()
                  close()
                }}
              />

              <SidebarItem
                icon={<Hash size={16} />}
                label="Meta tags"
                onClick={() => {
                  store.node.selectTagBox()
                  close()
                }}
              />

              <TreeView nodeList={nodeList} />

              {/* <FavoriteBox /> */}

              {/* {!isConnected && <WalletConnectButton size="lg" w-100p />}
        {isConnected && <UserAvatarModal />} */}
            </Box>
            <Box>
              {!session && <LoginWithGoogleButton />}
              {session && <SyncPopover />}
            </Box>
          </Box>
        </DrawerContent>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
