import { ElementType, ListElement, OrderedListElement } from './types'

export function isListElement(node: any): node is ListElement {
  return [ElementType.ul, ElementType.ol].includes(node.type)
}

export function isOrderedListElement(node: any): node is OrderedListElement {
  return node.type === ElementType.ol
}
