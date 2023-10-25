import { nanoid } from 'nanoid'
import { Element, Node } from 'slate'
import { ListsSchema, ListType } from 'slate-lists'
import { ELEMENT_LI, ELEMENT_LIC, ELEMENT_OL, ELEMENT_UL } from './constants'
import { getEmptyParagraph } from './getEmptyParagraph'

export const listSchema: ListsSchema = {
  isConvertibleToListTextNode(node: Node) {
    return Element.isElementType(node, 'p')
  },
  isDefaultTextNode(node: Node) {
    return Element.isElementType(node, 'p')
  },
  isListNode(node: Node, type?: ListType) {
    if (type) {
      const nodeType = type === ListType.ORDERED ? ELEMENT_OL : ELEMENT_UL
      return Element.isElementType(node, nodeType)
    }
    return (
      Element.isElementType(node, ELEMENT_OL) ||
      Element.isElementType(node, ELEMENT_UL)
    )
  },
  isListItemNode(node: Node) {
    return Element.isElementType(node, ELEMENT_LI)
  },
  isListItemTextNode(node: Node) {
    return Element.isElementType(node, ELEMENT_LIC)
  },

  createDefaultTextNode(props: Partial<Element> = {}) {
    return {
      id: nanoid(),
      children: [{ text: '' }],
      ...props,
      type: 'p',
    }
  },

  createListNode(type: any = ListType.UNORDERED, props: any = {}) {
    const nodeType = type === ListType.ORDERED ? ELEMENT_OL : ELEMENT_UL
    return {
      id: nanoid(),
      children: [{ text: '' }],
      ...props,
      type: nodeType,
    }
  },
  createListItemNode(props: Partial<Element> = {}) {
    return {
      id: nanoid(),
      children: [{ text: '' }],
      ...props,
      type: ELEMENT_LI,
    } as any
  },
  createListItemTextNode(props: Partial<Element> = {}) {
    return {
      id: nanoid(),
      children: [getEmptyParagraph('')],
      ...props,
      type: ELEMENT_LIC,
    }
  },
}
