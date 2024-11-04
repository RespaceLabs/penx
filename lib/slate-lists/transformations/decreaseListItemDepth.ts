import { Editor, Path, Transforms } from 'slate'
import { getParentList, getParentListItem } from '../lib'
import type { ListsSchema } from '../types'
import { increaseListItemDepth } from './increaseListItemDepth'

/**
 * Decreases nesting depth of "list-item" at a given Path.
 *
 * @returns {boolean} True, if the editor state has been changed.
 */
export function decreaseListItemDepth(
  editor: Editor,
  schema: ListsSchema,
  listItemPath: Path,
): boolean {
  const parentList = getParentList(editor, schema, listItemPath)

  if (!parentList) {
    // It should never happen.
    return false
  }

  const [parentListNode, parentListPath] = parentList
  const parentListItem = getParentListItem(editor, schema, listItemPath)
  const listItemIndex = listItemPath[listItemPath.length - 1]
  const previousSiblings = parentListNode.children!.slice(0, listItemIndex)
  const nextSiblings = parentListNode.children!.slice(listItemIndex + 1)

  if (nextSiblings.length) return false

  let decreased = false

  Editor.withoutNormalizing(editor, () => {
    // We have to move all subsequent sibling "list-items" into a new "list" that will be
    // nested in the "list-item" we're trying to move.
    nextSiblings.forEach(() => {
      // The next sibling path is always the same, because once we move out the next sibling,
      // another one will take its place.
      // TODO: comment this
      // const nextSiblingPath = [...parentListPath, listItemIndex + 1]
      // increaseListItemDepth(editor, schema, nextSiblingPath)
    })

    if (parentListItem) {
      // Move the "list-item" to the grandparent "list".
      const [, parentListItemPath] = parentListItem

      Transforms.moveNodes(editor, {
        at: listItemPath,
        to: Path.next(parentListItemPath),
      })

      // We've moved the "list-item" and all its subsequent sibling "list-items" out of this list.
      // So in case there are no more "list-items" left, we should remove the list.
      if (previousSiblings.length === 0) {
        Transforms.removeNodes(editor, { at: parentListPath })
      }

      decreased = true
    }
  })

  return decreased
}
