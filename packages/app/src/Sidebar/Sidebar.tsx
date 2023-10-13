import { Box } from '@fower/react'
import { useAtom } from 'jotai'
import { ExtensionStore, extensionStoreAtom } from '@penx/store'
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

      {components.map((C, i) => (
        <C key={i} />
      ))}

      <RecentlyOpened />
      <RecentlyEdited />
    </Box>
  )
}
