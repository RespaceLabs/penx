import { Box } from '@fower/react'
import { useAtom } from 'jotai'
import { ExtensionStore, extensionStoreAtom } from '@penx/store'
import { SyncPopover } from '../EditorLayout/SyncPopover'

function getStatusBarComponents(extensionStore: ExtensionStore): any[] {
  const values = Object.values(extensionStore)
  if (!values.length) return []
  return values.reduce((acc, { components = [] }) => {
    const matched = components
      .filter((c) => c.at === 'status_bar')
      .map((c) => c.component)
    return [...acc, ...matched]
  }, [] as any[])
}

export const StatusBar = () => {
  const [extensionStore] = useAtom(extensionStoreAtom)
  const components = getStatusBarComponents(extensionStore)

  return (
    <Box w-100p h-24 sticky bottom0 toCenterY toBetween px2 bgWhite textXS gap2>
      <Box h-100p toCenterY gap2>
        <SyncPopover />
      </Box>
      <Box h-100p toCenterY gap2>
        {components.map((C, i) => (
          <C key={i} />
        ))}
      </Box>
    </Box>
  )
}
