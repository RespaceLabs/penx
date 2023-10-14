import { Box } from '@fower/react'
import { useAtom } from 'jotai'
import { Folder, Trash2 } from 'lucide-react'
import { ExtensionStore, extensionStoreAtom, store } from '@penx/store'
import { RecentlyEdited } from './RecentlyEdited'
import { RecentlyOpened } from './RecentlyOpened'
import { SpacePopover } from './SpacePopover'

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
  const [extensionStore] = useAtom(extensionStoreAtom)
  const components = getStatusBarComponents(extensionStore)

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
    >
      <SpacePopover />

      <Box
        toCenterY
        gap2
        bgWhite
        rounded2XL
        px2
        py3
        cursorPointer
        onClick={() => {
          store.routeTo('ALL_DOCS')
        }}
      >
        <Box inlineFlex gray500>
          <Folder size={20} />
        </Box>
        <Box fontSemibold textLG>
          All Docs
        </Box>
      </Box>

      {components.map((C, i) => (
        <C key={i} />
      ))}

      <RecentlyOpened />
      <RecentlyEdited />

      <Box
        toCenterY
        gap2
        bgWhite
        rounded2XL
        px2
        py3
        cursorPointer
        onClick={() => {
          store.routeTo('TRASH')
        }}
      >
        <Box inlineFlex gray500>
          <Trash2 size={20} />
        </Box>
        <Box fontSemibold textLG>
          Trash
        </Box>
      </Box>
    </Box>
  )
}
