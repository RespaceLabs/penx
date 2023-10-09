import mitt from 'mitt'
import { DrawerName } from './types'

export type Events = {
  open: { name: DrawerName; data?: any }
  close: { name: DrawerName }
}

export const emitter = mitt<Events>()
