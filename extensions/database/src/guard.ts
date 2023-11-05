import { ELEMENT_DATABASE } from './constants'
import { DatabaseElement } from './types'

export function isDatabase(node: any): node is DatabaseElement {
  return node?.type === ELEMENT_DATABASE
}
