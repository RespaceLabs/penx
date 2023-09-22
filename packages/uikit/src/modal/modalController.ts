import { emitter } from './emitter'
import { ModalName } from './types'

export const modalController = {
  open(name: ModalName, data?: any) {
    emitter.emit('open', { name, data })
  },

  close(name: ModalName) {
    emitter.emit('close', { name })
  },
}
