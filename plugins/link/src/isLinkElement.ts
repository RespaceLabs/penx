import { ElementType, LinkElement } from './types'

export function isLinkElement(node: any): node is LinkElement {
  return node.type === ElementType.link
}
