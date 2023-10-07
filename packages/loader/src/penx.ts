import { produce } from 'immer'
import { ExtensionContext } from '@penx/extension-typings'
import { commandsAtom, extensionStoreAtom, store } from '@penx/store'

export const penx: ExtensionContext = {
  pluginId: undefined,

  registerCommand(options) {
    const commands = store.get(commandsAtom)
    store.set(commandsAtom, [...commands, options])
  },

  executeCommand(id) {
    //
  },

  defineSettings(schema) {
    const extensionStore = store.get(extensionStoreAtom)
    const newStore = produce(extensionStore, (draft) => {
      if (!draft[this.pluginId!]) draft[this.pluginId!] = {} as any
      draft[this.pluginId!].settingsSchema = schema
    })
    store.set(extensionStoreAtom, newStore)
  },

  registerComponent({ at, component }) {
    const extensionStore = store.get(extensionStoreAtom)
    const newStore = produce(extensionStore, (draft) => {
      if (!draft[this.pluginId!]) {
        draft[this.pluginId!] = {} as any
      }

      if (!draft[this.pluginId!].components?.length) {
        draft[this.pluginId!] = {} as any
        draft[this.pluginId!].components = []
      }

      draft[this.pluginId!].components.push({ at, component })
    })
    store.set(extensionStoreAtom, newStore)
  },

  registerBlock(options) {
    const extensionStore = store.get(extensionStoreAtom)
    const newStore = produce(extensionStore, (draft) => {
      if (!draft[this.pluginId!]) draft[this.pluginId!] = {} as any

      draft[this.pluginId!].block = options
    })
    store.set(extensionStoreAtom, newStore)
  },
  notify() {
    //
  },
}
