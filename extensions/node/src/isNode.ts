import { ELEMENT_NODE } from './constants'
import { NodeElement } from './types'

export function isNode(node: any): node is NodeElement {
  return node.type === ELEMENT_NODE
}
