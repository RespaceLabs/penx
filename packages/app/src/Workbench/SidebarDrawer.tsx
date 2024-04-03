import { useMemo } from 'react'
import { Box, styled } from '@fower/react'
import {
  CalendarDays,
  CheckCircle2,
  Cloud,
  Database,
  Folder,
  Hash,
  Inbox,
  Menu,
} from 'lucide-react'
import { Drawer } from 'vaul'
import { Button } from 'uikit'
import { useActiveNodes, useRouterName, useSidebarDrawer } from '@penx/hooks'
import { Node } from '@penx/model'
import { useNodes } from '@penx/node-hooks'
import { useSession } from '@penx/session'
import { store } from '@penx/store'
import { DatabaseList } from './Sidebar/DatabaseList'
import { FavoriteBox } from './Sidebar/FavoriteBox/FavoriteBox'
import { LoginButton } from './Sidebar/LoginButton'
import { SidebarItem } from './Sidebar/SidebarItem'
import { SpacePopover } from './Sidebar/SpacePopover/SpacePopover'
import { TagsEntry } from './Sidebar/TagsEntry'
import { TreeView } from './Sidebar/TreeView/TreeView'
import { UserProfile } from './Sidebar/UserProfile'
import { SyncPopover } from './StatusBar/SyncPopover'

const DrawerOverlay = styled(Drawer.Overlay)
const DrawerContent = styled(Drawer.Content)

export const DrawerSidebar = () => {
  const { isOpen, close, open } = useSidebarDrawer()
  const { nodes, nodeList } = useNodes()
  const { loading, data: session } = useSession()

  const name = useRouterName()
  const { activeNodes } = useActiveNodes()

  const isTodosActive = name === 'TODOS'

  const isTagsActive = useMemo(() => {
    if (name !== 'NODE' || !activeNodes.length) return false
    if (!activeNodes[0]) return false
    if (new Node(activeNodes[0]).isDatabaseRoot) return true
    return false
  }, [name, activeNodes])

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
                icon={<CheckCircle2 size={18} />}
                label="Todos"
                isActive={isTodosActive}
                onClick={() => {
                  store.router.routeTo('TODOS')
                  close()
                }}
              />

              <SidebarItem
                icon={<Database size={16} />}
                label="Tags"
                onClick={() => {
                  store.node.selectTagBox()
                  close()
                }}
              />

              {/* <Box column gap2>
                <TagsEntry isActive={isTagsActive} />
                <DatabaseList />
              </Box> */}

              <TreeView nodeList={nodeList} />
            </Box>
          </Box>

          <Box px4>
            {/* <SetupGitHubButton /> */}
            <LoginButton />
          </Box>
          <Box px2 toBetween toCenterY pb2>
            {session && !loading && (
              <>
                <SyncPopover />
                <UserProfile />
              </>
            )}
          </Box>
        </DrawerContent>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
