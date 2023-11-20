import { BaseElement } from 'slate'
import { ELEMENT_BLOCKQUOTE } from '@penx/constants'

export interface BlockquoteElement extends BaseElement {
  id?: string
  type: typeof ELEMENT_BLOCKQUOTE
}

export function isBlockquote(n: any): n is BlockquoteElement {
  return n.type === ELEMENT_BLOCKQUOTE
}
