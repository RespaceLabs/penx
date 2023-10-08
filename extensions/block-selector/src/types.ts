import { BaseElement } from 'slate'
import { ELEMENT_BLOCK_SELECTOR } from './constants'

export interface BlockSelectorElement extends BaseElement {
  id?: string
  type: typeof ELEMENT_BLOCK_SELECTOR
  trigger: string
}
