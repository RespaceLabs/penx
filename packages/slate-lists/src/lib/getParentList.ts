import type { Element, NodeEntry, Path } from 'slate'
import { Editor } from 'slate'
import type { ListsSchema } from '../types'

/**
 * Returns parent "list" node of "list-item" at a given path.
 * Returns null if there is no parent "list".
 */
export function getParentList(
  editor: Editor,
  schema: ListsSchema,
  path: Path,
): NodeEntry<Element> | null {
  const parentList = Editor.above(editor, {
    at: path,
    match: (node) => schema.isListNode(node),
  }) as NodeEntry<Element>

  return parentList ?? null
}
