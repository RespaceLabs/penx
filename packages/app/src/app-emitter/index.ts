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

  SIGN_IN_GOOGLE: undefined
  SIGN_OUT: undefined
}

export const appEmitter = mitt<Events>()
