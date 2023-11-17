import { Box } from '@fower/react'
import { useAtom } from 'jotai'
import {
  CalendarDays,
  Cloud,
  CloudOff,
  Folder,
  Hash,
  Inbox,
  Trash2,
} from 'lucide-react'
import { useAccount } from 'wagmi'
import { Dot } from 'uikit'
import { useNodes, useSpaces, useUser } from '@penx/hooks'
import { ExtensionStore, extensionStoreAtom, store } from '@penx/store'
import { FavoriteBox } from './FavoriteBox/FavoriteBox'
import { SidebarItem } from './SidebarItem'
import { SpacePopover } from './SpacePopover'
import { TreeView } from './TreeView/TreeView'
import { UserAvatarModal } from './UserAvatarModal/UserAvatarModal'
import { WalletConnectButton } from './WalletConnectButton'

function getStatusBarComponents(extensionStore: ExtensionStore): any[] {
  const values = Object.values(extensionStore)
  if (!values.length) return []
  return values.reduce((acc, { components = [] }) => {
    const matched = components
      .filter((c) => c.at === 'side_bar')
      .map((c) => c.component)
    return [...acc, ...matched]
  }, [] as any[])
}

export const Sidebar = () => {
  const { activeSpace } = useSpaces()
  const { isConnected } = useAccount()
  const [extensionStore] = useAtom(extensionStoreAtom)
  const components = getStatusBarComponents(extensionStore)
  const { nodes, nodeList } = useNodes()
  const user = useUser()

  if (!nodes.length) return null

  return (
    <Box
      column
      borderRight
      borderGray100
      flex-1
      display={['none', 'none', 'flex']}
      bgZinc100--T20
      gap3
      h-100vh
      overflowAuto
      pb2
    >
      <Box px2>
        <SpacePopover />
        <Box column gap-1 flex-1 mt3>
          <SidebarItem
            icon={<CalendarDays size={16} />}
            label="Daily note"
            onClick={() => {
              store.selectDailyNote()
            }}
          />

          <SidebarItem
            icon={<Inbox size={16} />}
            label="Inbox"
            onClick={() => {
              store.selectInbox()
            }}
          />

          <SidebarItem
            icon={<Hash size={16} />}
            label="Tags"
            onClick={() => {
              store.selectTagBox()
            }}
          />

          {!activeSpace.isSpace101 && (
            <SidebarItem
              icon={
                user?.isSyncWorks ? <Cloud size={16} /> : <CloudOff size={16} />
              }
              label="Sync"
              onClick={() => {
                store.routeTo('SYNC')
              }}
            >
              <Dot type={user?.isSyncWorks ? 'success' : 'error'} />
            </SidebarItem>
          )}

          {components.map((C, i) => (
            <C key={i} />
          ))}

          {/* <SidebarItem
          icon={<Trash2 size={16} />}
          label="Trash"
          onClick={() => {
            store.selectTrash()
          }}
        /> */}
        </Box>
      </Box>

      <Box flex-1 zIndex-1 overflowYAuto px2>
        {!!nodes.length && (
          <>
            <FavoriteBox nodeList={nodeList} />
            <TreeView nodeList={nodeList} />
          </>
        )}
      </Box>
      <Box px2>
        {!isConnected && <WalletConnectButton size="lg" w-100p />}
        {isConnected && <UserAvatarModal />}
      </Box>
    </Box>
  )
}
