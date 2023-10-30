import {
  BasePoint,
  Editor,
  Element,
  Node,
  Point,
  Range,
  Transforms,
} from 'slate'
import { ReactEditor } from 'slate-react'
import { PenxEditor } from '@penx/editor-common'
import { findNode, isCollapsed } from '@penx/editor-queries'

export const withMarkdown = (editor: PenxEditor) => {
  const { insertData, insertText, normalizeNode } = editor

  editor.insertData = (data: DataTransfer) => {
    const text = data.getData('text/plain')
    console.log('text--:', text)

    insertData(data)
  }

  return editor
}
