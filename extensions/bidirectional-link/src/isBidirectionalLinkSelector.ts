import { ELEMENT_BIDIRECTIONAL_LINK_SELECTOR } from '@penx/constants'
import { BidirectionalLinkSelectorElement } from './types'

export function isBidirectionalLinkSelector(
  node: any,
): node is BidirectionalLinkSelectorElement {
  return node.type === ELEMENT_BIDIRECTIONAL_LINK_SELECTOR
}
