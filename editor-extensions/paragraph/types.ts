import { BaseElement } from 'slate'
import { ELEMENT_P } from '@/lib/constants'

export interface ParagraphElement extends BaseElement {
  id?: string
  type: typeof ELEMENT_P
}
