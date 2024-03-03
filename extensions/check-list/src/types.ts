import { BaseElement } from 'slate'
import { ELEMENT_TODO } from '@penx/constants'

export interface CheckListItemElement extends BaseElement {
  id: string
  type: typeof ELEMENT_TODO
  checked: boolean
}

export function isCheckListItem(node: any): node is CheckListItemElement {
  return node?.type === ELEMENT_TODO
}
