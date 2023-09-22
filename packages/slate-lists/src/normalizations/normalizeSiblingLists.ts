import type { Editor, Node, NodeEntry } from 'slate'
import { getNextSibling } from '../lib'
import { mergeListWithPreviousSiblingList } from '../transformations'
import type { ListsSchema } from '../types'

/**
 * If there are 2 "lists" of the same type next to each other, merge them together.
 * If there are 2 nested "lists" next to each other, merge them together.
 */
export function normalizeSiblingLists(
  editor: Editor,
  schema: ListsSchema,
  entry: NodeEntry<Node>,
): boolean {
  const normalized = mergeListWithPreviousSiblingList(editor, schema, entry)

  if (normalized) {
    return true
  }

  const [, path] = entry
  const nextSibling = getNextSibling(editor, path)

  if (nextSibling) {
    return mergeListWithPreviousSiblingList(editor, schema, nextSibling)
  }

  return false
}
