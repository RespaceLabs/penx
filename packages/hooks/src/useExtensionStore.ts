import { useAtomValue } from 'jotai'
import { ExtensionStore } from '@penx/domain'
import { extensionStoreAtom } from '@penx/store'

export function useExtensionStore() {
  const store = useAtomValue(extensionStoreAtom)
  const extensionStore = new ExtensionStore(store)
  return { extensionStore }
}
