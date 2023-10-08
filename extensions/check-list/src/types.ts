import { BaseElement } from 'slate'
import { ELEMENT_CHECK_LIST_ITEM } from './constants'

export interface CheckListItemElement extends BaseElement {
  id: string
  type: typeof ELEMENT_CHECK_LIST_ITEM
  checked: boolean
}
