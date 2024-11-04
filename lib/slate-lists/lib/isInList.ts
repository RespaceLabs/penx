import type { Location } from 'slate'
import { Editor } from 'slate'
import type { ListsSchema } from '../types'

export function isInList(
  editor: Editor,
  schema: ListsSchema,
  at: Location | null = editor.selection,
) {
  if (!at) {
    return false
  }

  for (const [currentNode] of Editor.levels(editor, { at })) {
    if (schema.isListNode(currentNode)) {
      return true
    }
  }

  return false
}
