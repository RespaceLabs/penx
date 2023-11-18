import type { KeyboardEvent } from 'react'
import { isHotkey } from 'is-hotkey'
import type { Editor } from 'slate'
import { isAtStartOfListItem, isDeleteBackwardAllowed } from '../lib'
import { ListsEditor } from '../ListsEditor'
import { decreaseDepth } from '../transformations'
import { moveCursorToPreviousListItem } from '../transformations/moveCursorToPreviousListItem'

export function onBackspaceDecreaseListDepth(
  editor: Editor,
  event: KeyboardEvent,
) {
  const schema = ListsEditor.getListsSchema(editor)

  // TODO: Should move these code to another file
  if (
    schema &&
    isHotkey('backspace', event.nativeEvent) &&
    isAtStartOfListItem(editor, schema)
  ) {
    const moved = moveCursorToPreviousListItem(editor, schema)
    if (moved) event.preventDefault()
    return moved
  }

  if (
    schema &&
    isHotkey('backspace', event.nativeEvent) &&
    !isDeleteBackwardAllowed(editor, schema)
  ) {
    event.preventDefault()
    return decreaseDepth(editor, schema)
  }
  return false
}
