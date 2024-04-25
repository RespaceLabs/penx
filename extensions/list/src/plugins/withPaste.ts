import { PenxEditor } from '@penx/editor-common'
import { findNode, getCurrentPath } from '@penx/editor-queries'
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

    const path = getCurrentPath(editor)!

    // console.log('=====path:', path)

    if (isInTitle(editor)) {
      return insertData(data)
    }

    console.log('text====:', text, data)

    // return insertText(text)
    insertData(data)
  }

  return editor
}
