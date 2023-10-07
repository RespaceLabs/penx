import { BaseElement } from 'slate'

export enum ElementType {
  ul = 'unordered-list', // unordered list
  ol = 'ordered-list', // ordered list
  li = 'list-item', // list item
  lic = 'list-item-text', // list item content
  p = 'p', // list item content
}

export interface ListElement extends BaseElement {
  id: string
  type: ElementType.ul | ElementType.ol
}

export interface UnorderedListElement extends BaseElement {
  id: string
  type: ElementType.ol
  children: ListItemElement[]
}

export interface OrderedListElement extends BaseElement {
  id: string
  type: ElementType.ol
  children: any[]
}

export interface ListItemElement extends BaseElement {
  id: string
  type: ElementType.li
  children: any[]
}

export interface ListContentElement extends BaseElement {
  id: string
  type: ElementType.lic
}
