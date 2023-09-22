import type { Editor, Node, NodeEntry } from 'slate'
import { Transforms } from 'slate'
import { getListType, getParentListItem, getPrevSibling } from '../lib'
import type { ListsSchema } from '../types'

export function mergeListWithPreviousSiblingList(
  editor: Editor,
  schema: ListsSchema,
  [node, path]: NodeEntry<Node>,
): boolean {
  if (!schema.isListNode(node)) {
    // This function does not know how to normalize other nodes.
    return false
  }

  const previousSibling = getPrevSibling(editor, path)

  if (!previousSibling) {
    // Nothing to merge with.
    return false
  }

  const [previousSiblingNode] = previousSibling

  if (!schema.isListNode(previousSiblingNode)) {
    return false
  }

  const isNestedList = Boolean(getParentListItem(editor, schema, path))
  const isPreviousSiblingSameListType =
    getListType(schema, previousSiblingNode) === getListType(schema, node)

  if (!isPreviousSiblingSameListType && !isNestedList) {
    // If previous sibling "list" is of a different type, then this fix does not apply
    // unless we're working with nested "lists".
    return false
  }

  Transforms.mergeNodes(editor, { at: path })

  return true
}
