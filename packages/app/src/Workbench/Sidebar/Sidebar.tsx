import { useMemo } from 'react'
import { Box } from '@fower/react'
import { useAtom } from 'jotai'
import {
  CalendarDays,
  CheckCircle2,
  Cloud,
  CloudOff,
  Database,
  Fan,
  Folder,
  Hash,
  Inbox,
  Trash2,
} from 'lucide-react'
import {
  useActiveNodes,
  useActiveSpace,
  useRouterName,
  useSidebarDrawer,
  useSpaces,
} from '@penx/hooks'
import { IconCalendar, IconTodo } from '@penx/icons'
import { Node } from '@penx/model'
import { useNodes } from '@penx/node-hooks'
import { useSession } from '@penx/session'
import { store } from '@penx/store'
import { SyncPopover } from '../StatusBar/SyncPopover'
import { CatalogueBox } from './CatalogueBox/CatalogueBox'
import { DatabaseList } from './DatabaseList'
import { FavoriteBox } from './FavoriteBox/FavoriteBox'
import { LoginButton } from './LoginButton'
import { SetupGitHubButton } from './SetupGitHubButton'
import { SidebarItem } from './SidebarItem'
import { SpacePopover } from './SpacePopover/SpacePopover'
import { TagsEntry } from './TagsEntry'
import { PageList } from './TreeView/PageList'
import { TreeView } from './TreeView/TreeView'
import { UserProfile } from './UserProfile'

export const Sidebar = () => {
  const { activeSpace } = useActiveSpace()
  const { nodes, nodeList } = useNodes()
  const { loading, data: session } = useSession()

  // console.log('=========loading:', loading, 'session:', session)

  const drawer = useSidebarDrawer()
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
        {!!nodes.length && (
          <Box column gap-1 flex-1 mt3>
            <SidebarItem
              icon={<IconCalendar size={20} stroke="gray500" />}
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
              icon={<IconTodo size={20} stroke="gray500" />}
              label="Tasks"
              isActive={isTodosActive}
              onClick={() => {
                store.router.routeTo('TODOS')
              }}
            />

            {/* <SidebarItem
          icon={<Trash2 size={18} />}
          label="Trash"
          onClick={() => {
            store.selectTrash()
          }}
        /> */}
          </Box>
        )}
      </Box>

      <Box px2 column gap2>
        <TagsEntry isActive={isTagsActive} />
        {/* <DatabaseList /> */}
      </Box>

      <Box flex-1 zIndex-1 overflowYAuto px2>
        {!!nodes.length && (
          <>
            <FavoriteBox nodeList={nodeList} />

            {!activeSpace.isOutliner && <CatalogueBox />}
            {/* {!activeSpace.isOutliner && <PageList />} */}
            {activeSpace.isOutliner && <TreeView nodeList={nodeList} />}
          </>
        )}
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
    </Box>
  )
}
