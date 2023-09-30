import { Editor, Element, Node, Transforms } from 'slate'
import { insertNodes } from '@penx/editor-transforms'
import { ElementType } from '../custom-types'

const trigger = '[['

export const withInternalLink = (editor: Editor) => {
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
      match: (n: any) => [ElementType.code_block].includes(n.type),
    })

    if (match?.[0]) {
      return customInsertText(text)
    }

    if (text?.length === 1 && prevText + text == trigger) {
      Editor.deleteBackward(editor)
      insertNodes(editor, {
        type: ElementType.internal_link_selector,
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
      node.type === ElementType.internal_link_selector &&
      Node.string(node) === ''
    ) {
      Transforms.removeNodes(editor, { at: path })
      return
    }

    normalizeNode([node, path])
  }

  return editor
}
