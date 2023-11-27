import { Editor, Element, Node, Transforms } from 'slate'
import { isCodeBlock, isCodeLine } from '@penx/code-block'
import { ELEMENT_BLOCK_SELECTOR } from '@penx/constants'
import { PenxEditor } from '@penx/editor-common'
import { getBlockAbove, getText } from '@penx/editor-queries'
import { insertNodes } from '@penx/editor-transforms'
import { isBlockSelector } from './isBlockSelector'

/**
 * close or open block selector popover
 * Open when typing / at the beginning of a line, and close when deleting /.
 * @param editor
 * @returns
 */
export const withBlockSelector = (editor: PenxEditor) => {
  const trigger = '/'
  const { insertText, normalizeNode, apply } = editor

  editor.insertText = (text) => {
    if (!editor.selection || text !== trigger) {
      return insertText(text)
    }

    // in codeblock
    const match = Editor.above(editor, {
      match: (n) => isCodeBlock(n),
    })

    if (match?.[0]) {
      return insertText(text)
    }

    if (shouldOpen(editor)) {
      insertNodes(editor, {
        type: ELEMENT_BLOCK_SELECTOR,
        children: [{ text: trigger }],
        trigger,
      })

      return
    }

    insertText(text)
  }

  /**
   *  remove element when  is empty
   */
  editor.normalizeNode = ([node, path]) => {
    if (
      Element.isElement(node) &&
      isBlockSelector(node) &&
      Node.string(node) === ''
    ) {
      Transforms.removeNodes(editor, { at: path })
      return
    }

    normalizeNode([node, path])
  }

  return editor
}

/**
 * Whether to open or close the block selector popover
 * @param editor
 * @returns
 */
function shouldOpen(editor: Editor): boolean {
  const nodeEntry = getBlockAbove(editor)

  if (nodeEntry && !isCodeLine(nodeEntry[0].type)) {
    if (getText(editor, nodeEntry[1]) === '') {
      return true
    }
  }
  return false
}
