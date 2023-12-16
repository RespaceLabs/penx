import type { NodeEntry } from 'slate'
import { Editor, Node, Transforms } from 'slate'
import type { ListsSchema } from '../types'

/**
 * A "list-item-text" can have only inline nodes in it.
 */
export function normalizeListItemTextChildren(
  editor: Editor,
  schema: ListsSchema,
  [node, path]: NodeEntry<Node>,
): boolean {
  if (!schema.isListItemTextNode(node)) {
    // This function does not know how to normalize other nodes.
    return false
  }

  for (const [childNode, childPath] of Node.children(editor, path)) {
    if (!Reflect.has(childNode, 'type') && Reflect.has(childNode, 'text')) {
      Transforms.wrapNodes(
        editor,
        {
          type: 'p',
          children: [childNode],
        } as any,
        { at: childPath },
      )
      return true
    }
  }

  return false
}
