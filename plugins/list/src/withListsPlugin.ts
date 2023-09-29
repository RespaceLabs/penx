import { Element, Node } from 'slate'
import { ListType, withLists } from 'slate-lists'
import { ElementType } from '../custom-types'

export const withListsPlugin = withLists({
  isConvertibleToListTextNode(node: Node) {
    return Element.isElementType(node, ElementType.p)
  },
  isDefaultTextNode(node: Node) {
    return Element.isElementType(node, ElementType.p)
  },
  isListNode(node: Node, type?: ListType) {
    if (type) {
      const nodeType =
        type === ListType.ORDERED ? ElementType.ol : ElementType.ul
      return Element.isElementType(node, nodeType)
    }
    return (
      Element.isElementType(node, ElementType.ol) ||
      Element.isElementType(node, ElementType.ul)
    )
  },
  isListItemNode(node: Node) {
    return Element.isElementType(node, ElementType.li)
  },
  isListItemTextNode(node: Node) {
    return Element.isElementType(node, ElementType.lic)
  },
  createDefaultTextNode(props: Partial<Element> = {}) {
    return { children: [{ text: '' }], ...props, type: ElementType.p }
  },
  createListNode(type: any = ListType.UNORDERED, props: any = {}) {
    const nodeType = type === ListType.ORDERED ? ElementType.ol : ElementType.ul
    return { children: [{ text: '' }], ...props, type: nodeType }
  },
  createListItemNode(props: Partial<Element> = {}) {
    return { children: [{ text: '' }], ...props, type: ElementType.li } as any
  },
  createListItemTextNode(props: Partial<Element> = {}) {
    return { children: [{ text: '' }], ...props, type: ElementType.lic } as any
  },
})
