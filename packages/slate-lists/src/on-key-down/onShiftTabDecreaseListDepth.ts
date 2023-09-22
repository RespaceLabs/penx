import type { KeyboardEvent } from 'react'
import { isHotkey } from 'is-hotkey'
import type { Editor } from 'slate'
import { ListsEditor } from '../ListsEditor'
import { decreaseDepth } from '../transformations'

export function onShiftTabDecreaseListDepth(
  editor: Editor,
  event: KeyboardEvent,
) {
  const schema = ListsEditor.getListsSchema(editor)
  if (schema && isHotkey('shift+tab', event.nativeEvent)) {
    event.preventDefault()
    return decreaseDepth(editor, schema)
  }
  return false
}
