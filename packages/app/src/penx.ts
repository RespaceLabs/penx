import { produce } from 'immer'
import { PluginContext } from '@penx/plugin-typings'
import { commandsAtom, pluginStoreAtom, store } from '@penx/store'

export const penx: PluginContext = {
  registerCommand(command: any) {
    console.log('name.....:', command)
    const commands = store.get(commandsAtom)
  },
  executeCommand(id) {
    //
  },

  createSettings(schema: any[]) {
    console.log('createSettings')
  },
  registerComponent({ at, component }) {
    const pluginStore = store.get(pluginStoreAtom)
    const newStore = produce(pluginStore, (draft) => {
      if (!draft[this.pluginId!]) {
        draft[this.pluginId!] = {} as any
      }

      if (!draft[this.pluginId!].components?.length) {
        draft[this.pluginId!] = {} as any
        draft[this.pluginId!].components = []
      }

      draft[this.pluginId!].components.push({ at, component })
    })
    store.setPluginStore(newStore)
  },
  notify() {
    //
  },
}
