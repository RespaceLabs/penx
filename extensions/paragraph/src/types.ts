import { BaseElement } from 'slate'

export const ELEMENT_P = 'p'

export interface ParagraphElement extends BaseElement {
  id?: string
  type: typeof ELEMENT_P
}
