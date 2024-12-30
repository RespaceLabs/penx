import mitt from 'mitt'

export type AppEvents = {
  KEY_DOWN_ENTER_ON_TITLE: undefined
}

export const appEmitter = mitt<AppEvents>()
