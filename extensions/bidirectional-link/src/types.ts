import { BaseElement } from 'slate'
import {
  ELEMENT_BIDIRECTIONAL_LINK_CONTENT,
  ELEMENT_BIDIRECTIONAL_LINK_SELECTOR,
} from '@penx/constants'

export interface BidirectionalLinkSelectorElement extends BaseElement {
  id?: string
  type: typeof ELEMENT_BIDIRECTIONAL_LINK_SELECTOR
  trigger: string
}

export interface BidirectionalLinkContentElement extends BaseElement {
  id?: string
  type: typeof ELEMENT_BIDIRECTIONAL_LINK_CONTENT
  linkId: string
}
