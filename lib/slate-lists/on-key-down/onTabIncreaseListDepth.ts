import type { KeyboardEvent } from 'react'
import { isHotkey } from 'is-hotkey'
import type { Editor } from 'slate'
import { ListsEditor } from '../ListsEditor'
import { increaseDepth } from '../transformations'

export function onTabIncreaseListDepth(editor: Editor, event: KeyboardEvent) {
  const schema = ListsEditor.getListsSchema(editor)
  if (schema && isHotkey('tab', event.nativeEvent)) {
    event.preventDefault()

    return increaseDepth(editor, schema)
  }
  return false
}
