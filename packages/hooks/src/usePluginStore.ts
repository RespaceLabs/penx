import { useAtomValue } from 'jotai'
import { PluginStore } from '@penx/domain'
import { pluginStoreAtom } from '@penx/store'

export function usePluginStore() {
  const store = useAtomValue(pluginStoreAtom)
  const pluginStore = new PluginStore(store)
  return { pluginStore }
}
