import { PenxEditor, TElement } from '@penx/editor-common'
import { getCurrentPath, getNodeByPath } from '@penx/editor-queries'
import { NodeType } from '@penx/model-types'

function isNotEditable(editor: PenxEditor) {
  const path = getCurrentPath(editor)!
  const parent = getNodeByPath(editor, path.slice(0, -2)) as TElement
  return [NodeType.INBOX, NodeType.TRASH, NodeType.DAILY].includes(
    parent?.nodeType as NodeType,
  )
}

export const withEditable = (editor: PenxEditor) => {
  const { deleteBackward, insertText } = editor

  // TODO: have bug
  editor.insertText = (text) => {
    if (isNotEditable(editor)) return
    insertText(text)
  }

  editor.deleteBackward = (unit) => {
    if (isNotEditable(editor)) return

    deleteBackward(unit)
  }

  return editor
}
