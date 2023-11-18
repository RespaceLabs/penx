import type { KeyboardEvent } from 'react'
import { isHotkey } from 'is-hotkey'
import type { Editor } from 'slate'
import { getListItems } from '../lib'
import { ListsEditor } from '../ListsEditor'
import { splitListItem } from '../transformations'

export function onEnterSplitNonEmptyList(editor: Editor, event: KeyboardEvent) {
  const schema = ListsEditor.getListsSchema(editor)

  if (schema && isHotkey('enter', event.nativeEvent)) {
    const listItemsInSelection = getListItems(editor, schema, editor.selection)

    if (listItemsInSelection.length > 0) {
      event.preventDefault()
      return splitListItem(editor, schema)
    }
  }
  return false
}
