import { Editor } from 'slate'
import { PenxEditor } from '@penx/editor-common'
import {
  getCurrentNode,
  getCurrentPath,
  getNodeByPath,
} from '@penx/editor-queries'
import { NodeType } from '@penx/types'
import { isTitle } from './guard'

function isInboxTitle(editor: PenxEditor) {
  const path = getCurrentPath(editor)!
  const parent = getNodeByPath(editor, path.slice(0, -2))
  return isTitle(parent) && parent?.nodeType === NodeType.INBOX
}

export const withEditable = (editor: PenxEditor) => {
  const { deleteBackward, insertText } = editor

  // TODO: have bug
  editor.insertText = (text) => {
    if (isInboxTitle(editor)) return
    insertText(text)
  }

  editor.deleteBackward = (unit) => {
    if (isInboxTitle(editor)) return

    deleteBackward(unit)
  }

  return editor
}
