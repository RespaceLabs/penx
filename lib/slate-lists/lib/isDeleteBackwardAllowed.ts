import type { Editor, Location } from 'slate'
import type { ListsSchema } from '../types'
import { getListItems } from './getListItems'
import { getParentListItem } from './getParentListItem'
import { getPrevSibling } from './getPrevSibling'
import { isAtStartOfListItem } from './isAtStartOfListItem'

/**
 * Check if `editor.deleteBackward()` is safe to call (it won't break the structure).
 */
export function isDeleteBackwardAllowed(
  editor: Editor,
  schema: ListsSchema,
  at: Location | null = editor.selection,
): boolean {
  const listItemsInSelection = getListItems(editor, schema, at)

  if (listItemsInSelection.length === 0) {
    return true
  }

  const [[, listItemPath]] = listItemsInSelection
  const isInNestedList =
    getParentListItem(editor, schema, listItemPath) !== null
  const isFirstListItem = getPrevSibling(editor, listItemPath) === null
  return (
    isInNestedList || !isFirstListItem || !isAtStartOfListItem(editor, schema)
  )
}
