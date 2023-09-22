import type { Editor, Node, NodeEntry } from 'slate'
import { Transforms } from 'slate'
import { NESTED_LIST_PATH_INDEX } from '../constants'
import type { ListsSchema } from '../types'

/**
 * Nests (moves) given "list" in a given "list-item".
 */
export function moveListToListItem(
  editor: Editor,
  schema: ListsSchema,
  parameters: {
    at: NodeEntry<Node>
    to: NodeEntry<Node>
  },
): void {
  const [sourceListNode, sourceListPath] = parameters.at
  const [targetListNode, targetListPath] = parameters.to

  if (
    !schema.isListNode(sourceListNode) ||
    !schema.isListItemNode(targetListNode)
  ) {
    // Sanity check.
    return
  }

  Transforms.moveNodes(editor, {
    at: sourceListPath,
    to: [...targetListPath, NESTED_LIST_PATH_INDEX],
  })
}
