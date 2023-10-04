import { Editor, Text } from 'slate'
import {
  getCurrentFocus,
  getCurrentPath,
  getNodeByPath,
} from '@penx/editor-queries'
import { MarkType } from '@penx/editor-shared'

function isEndOfInlineCode(editor: Editor) {
  const focus = getCurrentFocus(editor)
  const path = getCurrentPath(editor)
  const textNode = getNodeByPath(editor, path!) as any
  if (textNode?.code && focus && path) {
    return Editor.isEnd(editor, focus, path)
  }
  return false
}

export const withCode = (editor: Editor) => {
  const { deleteBackward, apply, insertText } = editor

  editor.deleteBackward = (unit) => {
    deleteBackward(unit)
  }

  editor.insertText = (text) => {
    if (text === ' ' && isEndOfInlineCode(editor)) {
      Editor.removeMark(editor, MarkType.code)
      insertText(text)
      return
    }
    return insertText(text)
  }

  editor.apply = (operation) => {
    if (operation.type === 'split_node') {
      if (isEndOfInlineCode(editor)) {
        Editor.removeMark(editor, MarkType.code)
        return apply(operation)
      }
    }

    return apply(operation)
  }

  return editor
}
