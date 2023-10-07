import { ElementType, InternalLinkSelectorElement } from './types'

export function isInternalLinkSelectorElement(
  node: any,
): node is InternalLinkSelectorElement {
  return node.type === ElementType.internal_link_selector
}
