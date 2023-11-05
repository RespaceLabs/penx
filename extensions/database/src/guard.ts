import { ELEMENT_DATABASE, ELEMENT_NODE_QUERY } from './constants'
import { DatabaseElement, NodeQueryElement } from './types'

export function isDatabase(node: any): node is DatabaseElement {
  return node?.type === ELEMENT_DATABASE
}

export function isNodeQuery(node: any): node is NodeQueryElement {
  return node?.type === ELEMENT_NODE_QUERY
}
