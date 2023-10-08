import {
  ELEMENT_INTERNAL_LINK_SELECTOR,
  InternalLinkSelectorElement,
} from './types'

export function isInternalLinkSelectorElement(
  node: any,
): node is InternalLinkSelectorElement {
  return node.type === ELEMENT_INTERNAL_LINK_SELECTOR
}
