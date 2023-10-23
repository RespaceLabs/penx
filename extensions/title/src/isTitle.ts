import { ELEMENT_TITLE, TitleElement } from './types'

export function isTitle(node: any): node is TitleElement {
  return node.type === ELEMENT_TITLE
}
