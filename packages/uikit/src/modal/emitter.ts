import mitt from 'mitt'
import { ModalName } from './types'

export type Events = {
  open: { name: ModalName; data?: any }
  close: { name: ModalName }
}

export const emitter = mitt<Events>()
