import { Editor, Element, Node, Transforms } from 'slate'
import { isCodeBlock } from '@penx/code-block'
import { PenxEditor } from '@penx/editor-common'
import { insertNodes } from '@penx/editor-transforms'
import { ELEMENT_TAG_SELECTOR } from './constants'
import { isTagSelector } from './isTagSelector'

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

  /**
   *  remove element when  is empty
   */
  editor.normalizeNode = ([node, path]) => {
    if (
      Element.isElement(node) &&
      isTagSelector(node) &&
      Node.string(node) === ''
    ) {
      console.log('normalizeNode.............')
      Transforms.removeNodes(editor, { at: path })

      // Transforms.unwrapNodes(editor, {
      //   at: path,
      // })

      // console.log('tag node:', node, path)

      return
    }

    normalizeNode([node, path])
  }

  return editor
}
