import type { Editor, Location } from 'slate'
import type { ListsSchema } from '../types'
import { getCursorPosition } from './getCursorPosition'
import { getCursorPositionInNode } from './getCursorPositionInNode'
import { getListItems } from './getListItems'

/**
 * Returns true when editor has collapsed selection and the cursor is at the beginning of a "list-item".
 */
export function isAtStartOfListItem(
  editor: Editor,
  schema: ListsSchema,
  at: Location | null = editor.selection,
): boolean {
  const point = getCursorPosition(editor, at)

  if (!point) {
    return false
  }

  const listItemsInSelection = getListItems(editor, schema, point)

  if (listItemsInSelection.length !== 1) {
    return false
  }

  const [[, listItemPath]] = listItemsInSelection
  const { isStart } = getCursorPositionInNode(editor, point, listItemPath)

  return isStart
}
