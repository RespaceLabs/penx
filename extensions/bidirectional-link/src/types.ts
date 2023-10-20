import { BaseElement } from 'slate'

export const ELEMENT_BIDIRECTIONAL_LINK_SELECTOR = 'internal_link_selector'
export const ELEMENT_BIDIRECTIONAL_LINK_CONTENT = 'internal_link_content'

export interface BidirectionalLinkSelectorElement extends BaseElement {
  id?: string
  type: typeof ELEMENT_BIDIRECTIONAL_LINK_SELECTOR
  trigger: string
}

export interface BidirectionalLinkContentElement extends BaseElement {
  id?: string
  type: typeof ELEMENT_BIDIRECTIONAL_LINK_CONTENT
  linkName: string
  linkId: string
}
