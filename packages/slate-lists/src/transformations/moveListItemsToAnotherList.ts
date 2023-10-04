import type { Editor, Node, NodeEntry } from 'slate'
import { Element, Transforms } from 'slate'
import type { ListsSchema } from '../types'

/**
 * Moves all "list-items" from one "list" to the end of another "list".
 */
export function moveListItemsToAnotherList(
  editor: Editor,
  schema: ListsSchema,
  parameters: {
    at: NodeEntry<Node>
    to: NodeEntry<Node>
  },
): boolean {
  const [sourceListNode, sourceListPath] = parameters.at
  const [targetListNode, targetListPath] = parameters.to

  if (
    Element.isElement(sourceListNode) &&
    Element.isElement(targetListNode) &&
    schema.isListNode(sourceListNode) &&
    schema.isListNode(targetListNode) &&
    sourceListNode.children!.length > 0
  ) {
    // Sanity check.
    for (let i = 0; i < sourceListNode.children!.length; ++i) {
      Transforms.moveNodes(editor, {
        at: [...sourceListPath, 0],
        to: [...targetListPath, targetListNode.children!.length + i],
      })
    }

    return true
  }
  return false
}
