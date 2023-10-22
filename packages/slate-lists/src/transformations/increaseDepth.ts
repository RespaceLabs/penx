import type { Location, NodeEntry } from 'slate'
import { Editor } from 'slate'
import { getListItems, getPrevSibling, pickSubtreesRoots } from '../lib'
import type { ListsSchema } from '../types'
import { ListType } from '../types'
import { increaseListItemDepth } from './increaseListItemDepth'
import { wrapInList } from './wrapInList'

/**
 * Increases nesting depth of all "list-items" in the current selection.
 * All nodes matching options.wrappableTypes in the selection will be converted to "list-items" and wrapped in a "list".
 *
 * @returns {boolean} True, if the editor state has been changed.
 */
export function increaseDepth(
  editor: Editor,
  schema: ListsSchema,
  at: Location | null = editor.selection,
): boolean {
  if (!at) {
    return false
  }
  const listItems = getListItems(editor, schema, at)

  const indentableListItems = listItems.filter(([, listItemPath]) => {
    const previousListItem = getPrevSibling(editor, listItemPath)
    return previousListItem !== null
  })

  if (indentableListItems.length === 0) {
    return false
  }

  // When calling `increaseListItemDepth` the paths and references to list items
  // can change, so we need a way of marking the list items scheduled for transformation.
  const refs = pickSubtreesRoots(indentableListItems).map(([_, path]) =>
    Editor.pathRef(editor, path),
  )

  Editor.withoutNormalizing(editor, () => {
    // Before we indent "list-items", we want to convert every non list-related block in selection to a "list".
    // wrapInList(editor, schema, ListType.UNORDERED)

    refs.forEach((ref) => {
      if (ref.current) {
        increaseListItemDepth(editor, schema, ref.current)
      }
      ref.unref()
    })
  })

  return true
}
