import type { Location } from 'slate'
import { Editor, Element, Transforms } from 'slate'
import type { ListsSchema, ListType } from '../types'

/**
 * All nodes matching `isConvertibleToListTextNode()` in the current selection
 * will be converted to list items and then wrapped in lists.
 *
 * @see ListsSchema.isConvertibleToListTextNode()
 */
export function wrapInList(
  editor: Editor,
  schema: ListsSchema,
  listType: ListType,
  at: Location | null = editor.selection,
): boolean {
  if (!at) {
    return false
  }

  const nonListEntries = Array.from(
    Editor.nodes(editor, {
      at,
      match: (node) => {
        return (
          Element.isElement(node) &&
          !schema.isListNode(node) &&
          !schema.isListItemNode(node) &&
          !schema.isListItemTextNode(node) &&
          schema.isConvertibleToListTextNode(node)
        )
      },
    }),
  )

  console.log('nonListEntries:', nonListEntries)

  if (nonListEntries.length === 0) {
    return false
  }

  const refs = nonListEntries.map(([_, path]) => Editor.pathRef(editor, path))

  refs.forEach((ref) => {
    const path = ref.current
    if (path) {
      Editor.withoutNormalizing(editor, () => {
        Transforms.setNodes(
          editor,
          schema.createListItemTextNode() as Partial<Element>,
          {
            at: path,
          },
        )
        Transforms.wrapNodes(editor, schema.createListItemNode(), { at: path })
        Transforms.wrapNodes(editor, schema.createListNode(listType), {
          at: path,
        })
      })
    }
    ref.unref()
  })

  return true
}
