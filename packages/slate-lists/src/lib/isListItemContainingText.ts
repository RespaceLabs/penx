import type { Node } from 'slate'
import { Editor, Element } from 'slate'
import type { ListsSchema } from '../types'

/**
 * Returns true if given "list-item" node contains a non-empty "list-item-text" node.
 */
export function isListItemContainingText(
  editor: Editor,
  schema: ListsSchema,
  node: Node,
): boolean {
  if (Element.isElement(node) && schema.isListItemNode(node)) {
    return node.children!.some((node) => {
      return (
        Element.isElement(node) &&
        schema.isListItemTextNode(node) &&
        !Editor.isEmpty(editor, node)
      )
    })
  }
  return false
}
