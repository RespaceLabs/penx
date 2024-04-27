import { memo, useMemo } from 'react'
import { Box } from '@fower/react'
import { Boxes, BoxIcon, Hash } from 'lucide-react'
import { Bullet, Button, modalController } from 'uikit'
import { isProd, ModalNames } from '@penx/constants'
import { useActiveSpace, useRouterName, useSidebarDrawer } from '@penx/hooks'
import { IconCalendar, IconTodo } from '@penx/icons'
import { Node } from '@penx/model'
import { INode } from '@penx/model-types'
import { useNodes } from '@penx/node-hooks'
import { useSession } from '@penx/session'
import { store } from '@penx/store'
import { SyncPopover } from '../StatusBar/SyncPopover'
import { CatalogueBox } from './CatalogueBox/CatalogueBox'
import { CreateDemoDatabaseButton } from './CreateDemoDatabaseButton'
import { FavoriteBox } from './FavoriteBox/FavoriteBox'
import { LoginButton } from './LoginButton'
import { SidebarItem } from './SidebarItem'
import { SpacePopover } from './SpacePopover/SpacePopover'

interface Props {
  activeNode: INode
}

export const Sidebar = memo(
  function Sidebar({ activeNode }: Props) {
    const { loading, data: session } = useSession()

    // console.log('=========loading:', loading, 'session:', session)

    const name = useRouterName()

    const isTodosActive = name === 'TODOS'

    const isTodayActive = useMemo(() => {
      if (name !== 'NODE' || !activeNode) return false
      if (!activeNode) return false
      if (new Node(activeNode).isToday) return true
      return false
    }, [name, activeNode])

    const isTagsActive = useMemo(() => {
      if (name !== 'NODE' || !activeNode) return false
      if (!activeNode) return false
      if (new Node(activeNode).isDatabaseRoot) return true
      return false
    }, [name, activeNode])

    const isRootActive = useMemo(() => {
      if (name !== 'NODE' || !activeNode) return false
      if (!activeNode) return false
      if (new Node(activeNode).isRootNode) return true
      return false
    }, [name, activeNode])

    return (
      <Box
        column
        // borderRight
        // borderGray100
        flex-1
        display={['none', 'none', 'flex']}
        bgZinc100--T40
        gap3
        h-100vh
        overflowAuto
      >
        <Box px2>
          <Box mt2>
            <SpacePopover />
          </Box>
          <Box column gap-1 flex-1 mt3>
            <SidebarItem
              icon={
                <IconCalendar
                  size={20}
                  stroke={isTodayActive ? 'brand500' : 'gray500'}
                />
              }
              label="Today"
              isActive={isTodayActive}
              onClick={() => {
                store.node.selectDailyNote()
              }}
            />

            {/* <SidebarItem
              icon={<Inbox size={18} />}
              label="Inbox"
              onClick={() => {
                store.node.selectInbox()
              }}
            /> */}

            <SidebarItem
              icon={
                <IconTodo
                  size={20}
                  stroke={isTodosActive ? 'brand500' : 'gray500'}
                />
              }
              label="Tasks"
              isActive={isTodosActive}
              onClick={() => {
                store.router.routeTo('TODOS')
              }}
            />

            <SidebarItem
              icon={
                <Box gray500 inlineFlex brand500={isTagsActive}>
                  <Hash size={20} strokeWidth={1.5} />
                </Box>
              }
              label="Tags"
              isActive={isTagsActive}
              onClick={() => {
                store.node.selectTagBox()
              }}
            />

            <SidebarItem
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
              }}
            />

            <SidebarItem
              icon={
                <Box gray500 inlineFlex>
                  <BoxIcon size={20} strokeWidth={1.5} />
                </Box>
              }
              label="TagHub"
              onClick={() => {
                modalController.open(ModalNames.TAG_HUB)
              }}
            />
          </Box>
        </Box>

        <Box flex-1 zIndex-1 overflowYAuto px2>
          <FavoriteBox />

          {/* {!activeSpace.isOutliner && <CatalogueBox />}
            {!activeSpace.isOutliner && <PageList />}
            {activeSpace.isOutliner && <TreeView nodeList={nodeList} />} */}
        </Box>

        <Box px4 column gap2>
          {/* {!isProd && <CreateDemoDatabaseButton></CreateDemoDatabaseButton>} */}

          {/* <SetupGitHubButton /> */}
          <LoginButton />
        </Box>
        <Box px2 toBetween toCenterY pb2>
          {session && !loading && <SyncPopover />}
        </Box>
      </Box>
    )
  },
  (prevProps, nextProps) => {
    return prevProps.activeNode?.id === nextProps.activeNode?.id
  },
)
