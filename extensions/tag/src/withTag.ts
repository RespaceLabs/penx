import { Editor, Element, Node, Transforms } from 'slate'
import { isCodeBlock, isCodeLine } from '@penx/code-block'
import { PenxEditor } from '@penx/editor-common'
import { getBlockAbove, getText } from '@penx/editor-queries'
import { insertNodes } from '@penx/editor-transforms'
import { ELEMENT_TAG_SELECTOR } from './constants'
import { isTagSelector } from './isTagSelector'

export const withTag = (editor: PenxEditor) => {
  const trigger = '#'
  const { insertText, normalizeNode, apply } = editor

  editor.insertText = (text) => {
    if (!editor.selection || text !== trigger) {
      return insertText(text)
    }

    if (!shouldOpen(editor)) return insertText(text)

    // in codeblock
    const codeBlock = Editor.above(editor, {
      match: isCodeBlock,
    })

    if (codeBlock?.[0]) return insertText(text)

    const tagSelector = Editor.above(editor, {
      match: isTagSelector,
    })

    if (tagSelector?.[0]) return insertText(text)

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

function shouldOpen(editor: Editor): boolean {
  const nodeEntry = getBlockAbove(editor)

  if (nodeEntry && !isCodeLine(nodeEntry[0].type)) {
    const text = getText(editor, nodeEntry[1])

    // if (/#{2,}$/) {
    //   return false
    // }

    // #...# is markdown heading
    if (/^#+/.test(text)) return false

    if (text !== '') {
      return true
    }
  }
  return false
}
