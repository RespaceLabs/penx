import { ELEMENT_DATABASE, ELEMENT_LIVE_QUERY } from '@penx/constants'
import { DatabaseElement, LiveQueryElement } from './types'

export function isDatabase(node: any): node is DatabaseElement {
  return node?.type === ELEMENT_DATABASE
}

export function isLiveQuery(node: any): node is LiveQueryElement {
  return node?.type === ELEMENT_LIVE_QUERY
}
