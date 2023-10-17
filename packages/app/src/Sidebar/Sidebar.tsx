import { Box } from '@fower/react'
import { useAtom } from 'jotai'
import { Cloud, Folder, Trash2 } from 'lucide-react'
import { useAccount } from 'wagmi'
import { useDocs } from '@penx/hooks'
import { extensionStoreAtom, store } from '@penx/store'
import { ExtensionStore } from '@penx/types'
import { FavoriteBox } from './FavoriteBox/FavoriteBox'
import { RecentlyEdited } from './RecentlyEdited'
import { RecentlyOpened } from './RecentlyOpened'
import { SidebarItem } from './SidebarItem'
import { SpacePopover } from './SpacePopover'
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
  const { isConnected } = useAccount()
  const [extensionStore] = useAtom(extensionStoreAtom)
  const components = getStatusBarComponents(extensionStore)

  const { docList } = useDocs()

  return (
    <Box
      column
      borderRight
      borderGray100
      flex-1
      display={['none', 'none', 'flex']}
      bgZinc100
      px2
      gap3
      h-100vh
      overflowAuto
      pb2
    >
      <SpacePopover />
      <Box column gap3 flex-1 pb10>
        <SidebarItem
          icon={<Folder size={20} />}
          label="All Docs"
          count={docList.normalDocs.length}
          onClick={() => {
            store.routeTo('ALL_DOCS')
          }}
        />

        <SidebarItem
          icon={<Cloud size={20} />}
          label="Sync"
          onClick={() => {
            store.routeTo('SYNC')
          }}
        />

        {components.map((C, i) => (
          <C key={i} />
        ))}

        <FavoriteBox />
        <RecentlyOpened />
        <RecentlyEdited />

        <SidebarItem
          icon={<Trash2 size={20} />}
          label="Trash"
          count={docList.normalDocs.length}
          onClick={() => {
            store.routeTo('TRASH')
          }}
        />
      </Box>
      <Box>
        {!isConnected && <WalletConnectButton size="lg" w-100p />}
        {isConnected && <UserAvatarModal />}
      </Box>
    </Box>
  )
}
