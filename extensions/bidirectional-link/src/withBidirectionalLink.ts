import { Editor, Element, Node, Transforms } from 'slate'
import { isCodeBlock } from '@penx/code-block'
import { ELEMENT_BIDIRECTIONAL_LINK_SELECTOR } from '@penx/constants'
import { PenxEditor } from '@penx/editor-common'
import { insertNodes } from '@penx/editor-transforms'
import { isBidirectionalLinkSelector } from './isBidirectionalLinkSelector'

const trigger = '[['

export const withBidirectionalLink = (editor: PenxEditor) => {
  const { insertText, normalizeNode } = editor

  let prevText = ''

  function customInsertText(text: string) {
    if (text?.length === 1) prevText = text
    return insertText(text)
  }

  editor.insertText = (text) => {
    if (!editor.selection) {
      return customInsertText(text)
    }

    // in codeblock
    const match = Editor.above(editor, {
      match: (n) => isCodeBlock(n),
    })

    if (match?.[0]) {
      return customInsertText(text)
    }

    if (text?.length === 1 && prevText + text == trigger) {
      Editor.deleteBackward(editor)
      insertNodes(editor, {
        type: ELEMENT_BIDIRECTIONAL_LINK_SELECTOR,
        children: [{ text: '[[' }],
        trigger,
      })
      prevText = ''
    } else {
      return customInsertText(text)
    }
  }

  /**
   *  remove element when  is empty
   */
  editor.normalizeNode = ([node, path]) => {
    if (
      Element.isElement(node) &&
      isBidirectionalLinkSelector(node) &&
      Node.string(node) === ''
    ) {
      Transforms.removeNodes(editor, { at: path })
      editor.isBidirectionalLinkSelector = false
      return
    }

    normalizeNode([node, path])
  }

  return editor
}
