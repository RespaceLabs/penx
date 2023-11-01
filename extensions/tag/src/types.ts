import { BaseElement } from 'slate'
import { ELEMENT_TAG } from './constants'

export interface TagSelectorElement extends BaseElement {
  id?: string
  type: typeof ELEMENT_TAG
  isOpen: boolean
  trigger: string
}
