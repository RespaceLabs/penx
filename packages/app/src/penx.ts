import { commandsAtom, store } from '@penx/store'

export const penx = {
  registerCommand(command: any) {
    console.log('name.....:', command)
    const commands = store.get(commandsAtom)
  },
  createSettings(schema: any[]) {
    console.log('createSettings')
  },
} as typeof window.penx
