import { BaseElement } from 'slate'

export enum ElementType {
  check_list_item = 'check_list_item',
}

export interface CheckListItemElement extends BaseElement {
  id: string
  type: ElementType.check_list_item
  checked: boolean
}
