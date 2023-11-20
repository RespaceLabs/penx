import { BaseElement } from 'slate'
import { ELEMENT_CHECK_LIST_ITEM } from '@penx/constants'

export interface CheckListItemElement extends BaseElement {
  id: string
  type: typeof ELEMENT_CHECK_LIST_ITEM
  checked: boolean
}

export function isCheckListItem(node: any): node is CheckListItemElement {
  return node?.type === ELEMENT_CHECK_LIST_ITEM
}
