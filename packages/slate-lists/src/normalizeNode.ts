import type { Editor, NodeEntry } from 'slate'
import { ListsEditor } from './ListsEditor'
import * as Normalizations from './normalizations'

/**
 * All plugin normalizations combined into a single function.
 */
export function normalizeNode(editor: Editor, entry: NodeEntry): boolean {
  const schema = ListsEditor.getListsSchema(editor)
  if (schema) {
    return (
      normalizeNode.normalizeListChildren(editor, schema, entry) ||
      normalizeNode.normalizeListItemChildren(editor, schema, entry) ||
      normalizeNode.normalizeListItemTextChildren(editor, schema, entry) ||
      normalizeNode.normalizeOrphanListItem(editor, schema, entry) ||
      normalizeNode.normalizeOrphanListItemText(editor, schema, entry) ||
      normalizeNode.normalizeOrphanNestedList(editor, schema, entry) ||
      normalizeNode.normalizeSiblingLists(editor, schema, entry)
    )
  }
  return false
}

export namespace normalizeNode {
  export const normalizeListChildren = Normalizations.normalizeListChildren
  export const normalizeListItemChildren =
    Normalizations.normalizeListItemChildren
  export const normalizeListItemTextChildren =
    Normalizations.normalizeListItemTextChildren
  export const normalizeOrphanListItem = Normalizations.normalizeOrphanListItem
  export const normalizeOrphanListItemText =
    Normalizations.normalizeOrphanListItemText
  export const normalizeOrphanNestedList =
    Normalizations.normalizeOrphanNestedList
  export const normalizeSiblingLists = Normalizations.normalizeSiblingLists
}
