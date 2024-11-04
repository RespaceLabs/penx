import mitt from 'mitt'

type Events = {
  ArrowUp: any
  ArrowDown: any
  Enter: any
  Esc: any
  Escape: any
  Tab: any
}

export const keyDownEmitter = mitt<Events>()
