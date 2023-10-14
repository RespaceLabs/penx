import type { KeyboardEvent } from 'react'
import { isHotkey } from 'is-hotkey'
import type { Editor } from 'slate'
import { isDeleteBackwardAllowed } from '../lib'
import { ListsEditor } from '../ListsEditor'
import { decreaseDepth } from '../transformations'

export function onBackspaceDecreaseListDepth(
  editor: Editor,
  event: KeyboardEvent,
) {
  const schema = ListsEditor.getListsSchema(editor)

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
