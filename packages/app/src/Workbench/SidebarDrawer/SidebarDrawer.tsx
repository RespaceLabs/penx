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
import { Bullet, Button } from 'uikit'
import { useActiveNodes, useRouterName, useSidebarDrawer } from '@penx/hooks'
import { IconCalendar, IconMoreCircle, IconTodo } from '@penx/icons'
import { Node } from '@penx/model'
import { useNodes } from '@penx/node-hooks'
import { useSession } from '@penx/session'
import { store } from '@penx/store'
import { MotionButton } from '@penx/widget'
import { FavoriteBox } from '../Sidebar/FavoriteBox/FavoriteBox'
import { LoginButton } from '../Sidebar/LoginButton'
import { SpacePopover } from '../Sidebar/SpacePopover/SpacePopover'
import { TreeView } from '../Sidebar/TreeView/TreeView'
import { UserProfile } from '../Sidebar/UserProfile'
import { MenuItem } from './MenuItem'

const DrawerOverlay = styled(Drawer.Overlay)
const DrawerContent = styled(Drawer.Content)

export const SidebarDrawer = () => {
  const { isOpen, close, open } = useSidebarDrawer()
  const { nodes, nodeList } = useNodes()
  const { loading, data: session } = useSession()

  const name = useRouterName()
  const { activeNodes } = useActiveNodes()

  const isTodosActive = name === 'TODOS'

  const isTodayActive = useMemo(() => {
    if (name !== 'NODE' || !activeNodes.length) return false
    if (!activeNodes[0]) return false
    if (new Node(activeNodes[0]).isToday) return true
    return false
  }, [name, activeNodes])

  const isTagsActive = useMemo(() => {
    if (name !== 'NODE' || !activeNodes.length) return false
    if (!activeNodes[0]) return false
    if (new Node(activeNodes[0]).isDatabaseRoot) return true
    return false
  }, [name, activeNodes])

  const isRootActive = useMemo(() => {
    if (name !== 'NODE' || !activeNodes.length) return false
    if (!activeNodes[0]) return false
    if (new Node(activeNodes[0]).isRootNode) return true
    return false
  }, [name, activeNodes])

  return (
    <Drawer.Root
      direction="left"
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
          variant="ghost"
          size="sm"
          isSquare
          p0
          colorScheme="gray600"
          whileTap={{
            scale: 1.2,
          }}
        >
          <IconMoreCircle />
        </MotionButton>
      </Drawer.Trigger>
      <Drawer.Portal>
        <DrawerOverlay fixed bgBlack--T60 zIndex-100 css={{ inset: 0 }} />
        <DrawerContent
          bgWhite
          column
          // roundedTop2XL
          // h-94vh
          h-100p
          w-80vw
          // maxH-96p
          fixed
          bottom-0
          left-0
          right-0
          zIndex-101
          // overflowHidden
          // bgNeutral100
          outlineNone
          px4
          py4
        >
          <Box px2 toCenterY pb2 gap1>
            {session && !loading && (
              <>
                <UserProfile isMobile />
                <Box>/</Box>
              </>
            )}
            <SpacePopover />
          </Box>
          <Box column flex-1>
            <Box flex-1 mt3 gap4 column>
              <Box>
                <MenuItem
                  icon={
                    <IconCalendar
                      size={24}
                      stroke={isTodayActive ? 'brand500' : 'black'}
                    />
                  }
                  label="Today"
                  isActive={isTodayActive}
                  onClick={() => {
                    store.node.selectDailyNote()
                    close()
                  }}
                />

                <MenuItem
                  icon={
                    <IconTodo
                      size={24}
                      stroke={isTodosActive ? 'brand500' : 'black'}
                    />
                  }
                  label="Tasks"
                  isActive={isTodosActive}
                  onClick={() => {
                    store.router.routeTo('TODOS')
                    close()
                  }}
                />

                <MenuItem
                  icon={<Hash size={22} strokeWidth={1.5} />}
                  label="tags"
                  isActive={isTagsActive}
                  borderBottom={false}
                  onClick={() => {
                    store.node.selectTagBox()
                    close()
                  }}
                />

                <MenuItem
                  icon={
                    <Bullet
                      mr-4
                      innerColor={isRootActive ? 'brand500' : undefined}
                    />
                  }
                  label="Nodes"
                  isActive={isRootActive}
                  onClick={() => {
                    store.node.selectSpaceNode()
                    close()
                  }}
                />
              </Box>

              <Box flex-1 zIndex-1 overflowYAuto>
                {!!nodes.length && (
                  <>
                    <FavoriteBox nodeList={nodeList} />

                    {/* {!activeSpace.isOutliner && <CatalogueBox />}
            {!activeSpace.isOutliner && <PageList />}
            {activeSpace.isOutliner && <TreeView nodeList={nodeList} />} */}
                  </>
                )}
              </Box>
            </Box>
          </Box>

          <Box px4>
            {/* <SetupGitHubButton /> */}
            <LoginButton />
          </Box>
        </DrawerContent>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
