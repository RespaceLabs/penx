import mitt from 'mitt'

export type Events = {
  show: { id: string; event: React.MouseEvent<HTMLDivElement, MouseEvent> }
}

export const emitter = mitt<Events>()

export function useContextMenu(id: string) {
  return {
    show(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
      event.preventDefault()
      emitter.emit('show', { id, event })
    },
  }
}
