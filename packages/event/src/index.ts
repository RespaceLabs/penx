import mitt from 'mitt'

export type Events = {
  ADD_NODE?: string
  ADD_SPACE?: string

  ADD_TAG?: string

  SPLIT_RIGHT?: string

  EXPORT_TO_MARKDOWN?: string
  EXPORT_TO_PDF?: string
  EXPORT_TO_HTML?: string
}

export const emitter = mitt<Events>()
