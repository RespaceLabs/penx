import { BaseElement } from 'slate'

export const ELEMENT_UL = 'unordered-list'
export const ELEMENT_OL = 'ordered-list'
export const ELEMENT_LI = 'list-item'
export const ELEMENT_LIC = 'list-item-text'

export interface ListElement extends BaseElement {
  id: string
  type: typeof ELEMENT_UL | typeof ELEMENT_OL
}

export interface UnorderedListElement extends BaseElement {
  id: string
  type: typeof ELEMENT_UL
  children: ListItemElement[]
}

export interface OrderedListElement extends BaseElement {
  id: string
  type: typeof ELEMENT_OL
  children: any[]
}

export interface ListItemElement extends BaseElement {
  id: string
  type: typeof ELEMENT_LI
  children: any[]
}

export interface ListContentElement extends BaseElement {
  id: string
  type: typeof ELEMENT_LIC
}
