import type { Element, Node } from 'slate'

export enum ListType {
  ORDERED = 'ol',
  UNORDERED = 'ul',
}

export interface ListsSchema {
  isConvertibleToListTextNode(node: Node): boolean

  isDefaultTextNode(node: Node): boolean

  isListNode(node: Node, type?: ListType): boolean

  isListItemNode(node: Node): boolean

  isListItemTextNode(node: Node): boolean

  createDefaultTextNode(props?: Partial<Element>): Element

  createListNode(type?: ListType, props?: Partial<Element>): Element

  createListItemNode(props?: Partial<Element & { children: any[] }>): Element

  createListItemTextNode(
    props?: Partial<Element & { children: any[] }>,
  ): Element
}
