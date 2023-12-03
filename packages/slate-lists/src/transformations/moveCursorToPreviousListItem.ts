import { Editor, Path, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import { TEXT_PATH_INDEX } from '../constants'
import { getListItems, getParentList } from '../lib'
import { getCurrentNode } from '../queries/getCurrentNode'
import { getNodeByPath } from '../queries/getNodeByPath'
import type { ListsSchema } from '../types'

/**
 * move cursor to previous collapsed list item
 *
 * @returns {boolean} True, if the editor state has been changed.
 */
export function moveCursorToPreviousListItem(
  editor: Editor,
  schema: ListsSchema,
): boolean {
  const [listItem] = getListItems(editor, schema)
  const listItemPath = listItem[1]
  const parentList = getParentList(editor, schema, listItemPath)

  if (!parentList) {
    // It should never happen.
    return false
  }

  // is in root list and is first item
  if (
    parentList[0].children.length === 1 &&
    parentList[1].length === 1 &&
    listItemPath[1] === 0
  ) {
    let handled = false

    const node = getCurrentNode(editor) as any

    Editor.withoutNormalizing(editor, () => {
      // TODO: too hack
      if (node?.type !== 'p') {
        Transforms.setNodes(editor, {
          type: 'p',
        } as any)
      } else {
        Transforms.select(editor, Editor.end(editor, [0]))
      }
      handled = true
    })

    return handled
  }

  try {
    const prevListItemPath = Path.previous(listItemPath)
    const previousListItem: any = getNodeByPath(editor, prevListItemPath)
    const collapsed = previousListItem.children[TEXT_PATH_INDEX].collapsed

    if (!collapsed) return false

    const previousListItemPath = ReactEditor.findPath(
      editor as any,
      previousListItem,
    )!

    let handled = false

    Editor.withoutNormalizing(editor, () => {
      Transforms.select(
        editor,
        Editor.end(editor, [...previousListItemPath, TEXT_PATH_INDEX]),
      )
      handled = true
    })

    return handled
  } catch (error) {
    return false
  }
}
