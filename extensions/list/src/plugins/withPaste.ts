import { PenxEditor } from '@penx/editor-common'
import { findNode } from '@penx/editor-queries'
import { isTitle } from '../guard'

function isInTitle(editor: PenxEditor) {
  const res = findNode(editor, {
    at: editor.selection!,
    // mode: 'highest',
    match: isTitle,
  })
  return !!res
}

export const withPaste = (editor: PenxEditor) => {
  const { insertData, insertText } = editor

  editor.insertData = (data: DataTransfer) => {
    const text = data.getData('text/plain')

    if (isInTitle(editor)) {
      return insertData(data)
    }

    return insertText(text)
  }

  return editor
}
