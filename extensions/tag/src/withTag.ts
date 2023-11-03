import { Editor } from 'slate'
import { isCodeBlock } from '@penx/code-block'
import { PenxEditor } from '@penx/editor-common'
import { insertNodes } from '@penx/editor-transforms'
import { ELEMENT_TAG_SELECTOR } from './constants'

/**
 * close or open block selector popover
 * Open when typing / at the beginning of a line, and close when deleting /.
 * @param editor
 * @returns
 */
export const withTag = (editor: PenxEditor) => {
  const trigger = '#'
  const { insertText, normalizeNode, apply } = editor

  editor.insertText = (text) => {
    if (!editor.selection || text !== trigger) {
      return insertText(text)
    }

    // in codeblock
    const match = Editor.above(editor, {
      match: (n) => isCodeBlock(n),
    })

    if (match?.[0]) return insertText(text)

    // const id = shouldOpen(editor)

    // if (id) {
    // }

    insertNodes(editor, {
      type: ELEMENT_TAG_SELECTOR,
      children: [{ text: trigger }],
      trigger,
    })

    return
  }

  return editor
}
