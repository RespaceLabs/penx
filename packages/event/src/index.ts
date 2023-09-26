import mitt from 'mitt'

export type Events = {
  ADD_DOCUMENT?: string
  ADD_SPACE?: string
}

export const emitter = mitt<Events>()
