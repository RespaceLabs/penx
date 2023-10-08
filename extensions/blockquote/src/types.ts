import { BaseElement } from 'slate'
import { ELEMENT_BLOCKQUOTE } from './constants'

export interface BlockquoteElement extends BaseElement {
  id?: string
  type: typeof ELEMENT_BLOCKQUOTE
}
