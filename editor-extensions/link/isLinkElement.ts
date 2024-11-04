import { ELEMENT_LINK, LinkElement } from './types'

export function isLinkElement(node: any): node is LinkElement {
  return node?.type === ELEMENT_LINK
}
