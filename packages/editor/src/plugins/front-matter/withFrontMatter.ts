import { debounce } from 'lodash'
import { Editor, Element, Text, Transforms } from 'slate'
import {
  getCurrentFocus,
  getCurrentPath,
  getNodeByPath,
} from '@penx/editor-queries'
import { MarkType } from '@penx/editor-shared'
import { hints } from './hints'

function isEndOfInlineCode(editor: Editor) {
  const focus = getCurrentFocus(editor)
  const path = getCurrentPath(editor)
  const textNode = getNodeByPath(editor, path!) as Text
  if (textNode?.code && focus && path) {
    return Editor.isEnd(editor, focus, path)
  }
  return false
}

const debouncedHint = debounce((editor: Editor) => {
  const block = Editor.above(editor, {
    match: (n) => Editor.isBlock(editor, n as Element),
  })
  const index = Math.floor(Math.random() * hints.length)
  Transforms.setNodes(
    editor,
    {
      isHinted: false,
      hint: hints[index],
    },
    { at: block?.[1]! },
  )
}, 100)

export const withFrontMatter = (editor: Editor) => {
  const { deleteBackward, apply, insertText } = editor

  editor.deleteBackward = (unit) => {
    deleteBackward(unit)
  }

  editor.insertText = (text) => {
    // debouncedHint(editor)

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
