import mitt from 'mitt'

export type ShareEvent = {
  id: string
  title: string
  content: string
  createdAt: number
  updatedAt: number
}

type Events = {
  onShare: ShareEvent
}

export const shareEmitter = mitt<Events>()
