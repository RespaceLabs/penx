import mitt from 'mitt'

export type ListEvents = {
  ON_SELECT: any
}

export const emitter = mitt<ListEvents>()
