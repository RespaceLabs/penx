import type { Editor, Element, NodeEntry } from 'slate'
import { Node, Text, Transforms } from 'slate'
import type { ListsSchema } from '../types'

/**
 * A "list-item" can have a single "list-item-text" and optionally an extra "list" as a child.
 */
export function normalizeListItemChildren(
  editor: Editor,
  schema: ListsSchema,
  [node, path]: NodeEntry<Node>,
): boolean {
  if (!schema.isListItemNode(node)) {
    // This function does not know how to normalize other nodes.
    return false
  }

  const children = Array.from(Node.children(editor, path))

  for (const [childIndex, [childNode, childPath]] of children.entries()) {
    if (Text.isText(childNode) || editor.isInline(childNode)) {
      const listItemText = schema.createListItemTextNode({
        children: [childNode],
      })
      Transforms.wrapNodes(editor, listItemText as Element, { at: childPath })

      if (childIndex > 0) {
        const [previousChildNode] = children[childIndex - 1]

        if (schema.isListItemTextNode(previousChildNode)) {
          Transforms.mergeNodes(editor, { at: childPath })
        }
      }

      return true
    }

    if (schema.isListItemNode(childNode)) {
      Transforms.liftNodes(editor, { at: childPath })
      return true
    }

    if (schema.isListItemTextNode(childNode) && childIndex !== 0) {
      Transforms.wrapNodes(editor, schema.createListItemNode(), {
        at: childPath,
      })
      return true
    }

    if (
      !schema.isListItemTextNode(childNode) &&
      !schema.isListNode(childNode)
    ) {
      Transforms.setNodes(editor, schema.createListItemTextNode() as any, {
        at: childPath,
      })
      return true
    }
  }

  return false
}
