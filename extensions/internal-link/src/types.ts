import { BaseElement } from 'slate'

export const ELEMENT_INTERNAL_LINK_SELECTOR = 'internal_link_selector'
export const ELEMENT_INTERNAL_LINK_CONTENT = 'internal_link_content'

export interface InternalLinkSelectorElement extends BaseElement {
  id?: string
  type: typeof ELEMENT_INTERNAL_LINK_SELECTOR
  trigger: string
}

export interface InternalLinkContentElement extends BaseElement {
  id?: string
  type: typeof ELEMENT_INTERNAL_LINK_CONTENT
  linkName: string
  linkId: string
}
