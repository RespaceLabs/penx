import { extensionStore } from '@penx/extension-store'
import { ExtensionContext } from '@penx/extension-typings'
import { commandsAtom, store } from '@penx/store'

export const extensionContext: ExtensionContext = {
  pluginId: undefined,

  registerCommand(options) {
    const commands = store.get(commandsAtom)
    store.set(commandsAtom, [...commands, options])

    extensionStore.addCommand(options)
  },

  executeCommand(id) {
    //
  },

  defineSettings(schema) {
    extensionStore.addSetting(this.pluginId!, schema)
  },

  registerComponent({ at, component }) {
    extensionStore.addComponent(this.pluginId!, { at, component })
  },

  registerBlock(options) {
    extensionStore.addBlock(this.pluginId!, options)
  },
  notify() {
    //
  },
}
