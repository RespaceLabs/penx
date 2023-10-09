import { emitter } from './emitter'
import { DrawerName } from './types'

export const drawerController = {
  open(name: DrawerName, data?: any) {
    emitter.emit('open', { name, data })
  },

  close(name: DrawerName) {
    emitter.emit('close', { name })
  },
}
