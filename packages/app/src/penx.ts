import { PluginContext } from '@penx/plugin-typings'
import { commandsAtom, store } from '@penx/store'

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
  registerComponent(type, component) {
    //
  },
  notify() {
    //
  },
}
