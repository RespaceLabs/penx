import type {
  Editor,
  Element,
  Location,
  Node,
  NodeEntry,
  Path,
  Range,
} from 'slate'
import {
  getListItems,
  getLists,
  getListType,
  getNestedList,
  getParentList,
  getParentListItem,
  isAtEmptyListItem,
  isAtStartOfListItem,
  isDeleteBackwardAllowed,
  isInList,
  isListItemContainingText,
} from './lib'
import * as Registry from './registry'
import {
  decreaseDepth,
  decreaseListItemDepth,
  increaseDepth,
  increaseListItemDepth,
  mergeListWithPreviousSiblingList,
  moveListItemsToAnotherList,
  moveListToListItem,
  setListType,
  splitListItem,
  unwrapList,
  wrapInList,
} from './transformations'
import type { ListsSchema } from './types'
import { ListType } from './types'

function schema(editor: Editor) {
  return Registry.get(editor)
}

export const ListsEditor = {
  // ListsEditor schema availability
  isListsEnabled(editor: Editor): boolean {
    return Registry.has(editor)
  },
  getListsSchema(editor: Editor): ListsSchema | undefined {
    return Registry.has(editor) ? Registry.get(editor) : undefined
  },

  // Schema proxies
  isConvertibleToListTextNode(editor: Editor, node: Node): boolean {
    return schema(editor).isConvertibleToListTextNode(node)
  },
  isDefaultTextNode(editor: Editor, node: Node): boolean {
    return schema(editor).isDefaultTextNode(node)
  },
  isListNode(editor: Editor, node: Node, type?: ListType): boolean {
    return schema(editor).isListNode(node, type)
  },
  isListItemNode(editor: Editor, node: Node): boolean {
    return schema(editor).isListItemNode(node)
  },
  isListItemTextNode(editor: Editor, node: Node): boolean {
    return schema(editor).isListItemTextNode(node)
  },
  createDefaultTextNode(editor: Editor, props?: Partial<Element>): Element {
    return schema(editor).createDefaultTextNode(props) as Element
  },
  createListNode(
    editor: Editor,
    type?: ListType,
    props?: Partial<Element>,
  ): Element {
    return schema(editor).createListNode(type, props) as Element
  },
  createListItemNode(editor: Editor, props?: Partial<Element>): Element {
    return schema(editor).createListItemNode(props) as Element
  },
  createListItemTextNode(editor: Editor, props?: Partial<Element>): Element {
    return schema(editor).createListItemTextNode(props) as Element
  },

  // Checks & Getters
  isDeleteBackwardAllowed(editor: Editor, at?: Location | null) {
    return isDeleteBackwardAllowed(editor, schema(editor), at)
  },
  isAtStartOfListItem(editor: Editor, at?: Location | null) {
    return isAtStartOfListItem(editor, schema(editor), at)
  },
  isAtEmptyListItem(editor: Editor, at?: Location | null) {
    return isAtEmptyListItem(editor, schema(editor), at)
  },
  isAtList(editor: Editor, at?: Location | null) {
    return isInList(editor, schema(editor), at)
  },
  isListItemContainingText(editor: Editor, node: Node) {
    return isListItemContainingText(editor, schema(editor), node)
  },
  getLists(editor: Editor, at: Range | null) {
    return getLists(editor, schema(editor), at)
  },
  getListItems(editor: Editor, at?: Location | null) {
    return getListItems(editor, schema(editor), at)
  },
  getListType(editor: Editor, node: Node) {
    return getListType(schema(editor), node)
  },
  getNestedList(editor: Editor, path: Path) {
    return getNestedList(editor, schema(editor), path)
  },
  getParentList(editor: Editor, path: Path) {
    return getParentList(editor, schema(editor), path)
  },
  getParentListItem(editor: Editor, path: Path) {
    return getParentListItem(editor, schema(editor), path)
  },

  // Transformations
  increaseDepth(editor: Editor, at?: Location | null) {
    return increaseDepth(editor, schema(editor), at)
  },
  increaseListItemDepth(editor: Editor, listItemPath: Path) {
    return increaseListItemDepth(editor, schema(editor), listItemPath)
  },
  decreaseDepth(editor: Editor, at?: Location | null) {
    return decreaseDepth(editor, schema(editor), at)
  },
  decreaseListItemDepth(editor: Editor, listItemPath: Path) {
    return decreaseListItemDepth(editor, schema(editor), listItemPath)
  },
  mergeListWithPreviousSiblingList(editor: Editor, entry: NodeEntry) {
    return mergeListWithPreviousSiblingList(editor, schema(editor), entry)
  },
  moveListItemsToAnotherList(
    editor: Editor,
    parameters: Parameters<typeof moveListItemsToAnotherList>[2],
  ) {
    return moveListItemsToAnotherList(editor, schema(editor), parameters)
  },
  moveListToListItem(
    editor: Editor,
    parameters: Parameters<typeof moveListToListItem>[2],
  ) {
    return moveListToListItem(editor, schema(editor), parameters)
  },
  setListType(editor: Editor, listType: ListType, at?: Location | null) {
    return setListType(editor, schema(editor), listType, at)
  },
  splitListItem(editor: Editor, at?: Location | null) {
    return splitListItem(editor, schema(editor), at)
  },
  unwrapList(editor: Editor, at?: Location | null) {
    return unwrapList(editor, schema(editor), at)
  },
  wrapInList(
    editor: Editor,
    listType = ListType.UNORDERED,
    at?: Location | null,
  ) {
    return wrapInList(editor, schema(editor), listType, at)
  },
}
