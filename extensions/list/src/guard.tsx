import {
  ELEMENT_LI,
  ELEMENT_OL,
  ELEMENT_UL,
  ListElement,
  ListItemElement,
  OrderedListElement,
} from './types'

export function isListElement(node: any): node is ListElement {
  return [ELEMENT_UL, ELEMENT_OL].includes(node.type)
}

export function isListItemElement(node: any): node is ListItemElement {
  return node.type === ELEMENT_LI
}

export function isOrderedListElement(node: any): node is OrderedListElement {
  return node.type === ELEMENT_OL
}
