import type { Editor, NodeEntry, Path } from 'slate'
import { Element, Node } from 'slate'
import { NESTED_LIST_PATH_INDEX } from '../constants'
import type { ListsSchema } from '../types'

/**
 * Returns "list" node nested in "list-item" at a given path.
 * Returns null if there is no nested "list".
 */
export function getNestedList(
  editor: Editor,
  schema: ListsSchema,
  path: Path,
): NodeEntry<Element> | null {
  const nestedListPath = [...path, NESTED_LIST_PATH_INDEX]

  if (!Node.has(editor, nestedListPath)) {
    return null
  }

  const nestedList = Node.get(editor, nestedListPath)

  if (Element.isElement(nestedList) && schema.isListNode(nestedList)) {
    // Sanity check.
    return [nestedList, nestedListPath]
  }

  return null
}
