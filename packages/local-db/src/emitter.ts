import mitt from 'mitt'
import { INode } from '@penx/model-types'

export type DBEvents = {
  REF_NODE_UPDATED: INode
}

export const emitter = mitt<DBEvents>()
