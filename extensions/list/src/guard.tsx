import {
  ELEMENT_LI,
  ELEMENT_LIC,
  ELEMENT_OL,
  ELEMENT_TITLE,
  ELEMENT_UL,
} from '@penx/constants'
import {
  ListContentElement,
  ListElement,
  ListItemElement,
  OrderedListElement,
  TitleElement,
} from './types'

export function isTitle(node: any): node is TitleElement {
  return node?.type === ELEMENT_TITLE
}

export function isListElement(node: any): node is ListElement {
  return [ELEMENT_UL, ELEMENT_OL].includes(node?.type)
}

export function isListItemElement(node: any): node is ListItemElement {
  return node?.type === ELEMENT_LI
}

export function isOrderedListElement(node: any): node is OrderedListElement {
  return node?.type === ELEMENT_OL
}

export function isListContentElement(node: any): node is ListContentElement {
  return node?.type === ELEMENT_LIC
}
