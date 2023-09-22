import type { Element, NodeEntry, Path } from 'slate'
import { Editor } from 'slate'
import type { ListsSchema } from '../types'

/**
 * Returns parent "list-item" node of "list-item" at a given path.
 * Returns null if there is no parent "list-item".
 */
export function getParentListItem(
  editor: Editor,
  schema: ListsSchema,
  path: Path,
): NodeEntry<Element> | null {
  const parentListItem = Editor.above(editor, {
    at: path,
    match: (node) => schema.isListItemNode(node),
  }) as NodeEntry<Element>

  return parentListItem ?? null
}
