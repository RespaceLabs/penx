import { Editor, Element, Node, Path, Transforms } from 'slate'
import { isCodeBlock } from '@penx/code-block'
import { ELEMENT_TAG_SELECTOR } from '@penx/constants'
import { PenxEditor } from '@penx/editor-common'
import { findNodePath, getNodeByPath, getText } from '@penx/editor-queries'
import { insertNodes } from '@penx/editor-transforms'
import { isTagSelector } from './isTagSelector'

function getTextBeforeCursor(editor: PenxEditor) {
  try {
    const anchor = {
      ...editor.selection?.anchor!,
      offset: 0,
    }
    const beforeText = Editor.string(editor, {
      focus: editor.selection?.focus!,
      anchor,
    })
    return beforeText
  } catch (error) {
    return undefined
  }
}

export const withTag = (editor: PenxEditor) => {
  const trigger = '#'
  const { insertText, normalizeNode, apply } = editor

  editor.insertText = (text) => {
    // const node = getNodeByPath(editor, editor.selection!.focus!.path)

    if (!editor.selection || text !== trigger) {
      return insertText(text)
    }

    if (!shouldOpen(editor)) {
      return insertText(text)
    }

    // in codeblock
    const codeBlock = Editor.above(editor, {
      match: isCodeBlock,
    })

    if (codeBlock?.[0]) return insertText(text)

    const tagSelector = Editor.above(editor, {
      match: isTagSelector,
    })

    if (tagSelector?.[0]) {
      return insertText(text)
    }

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

      // Transforms.removeNodes(editor, { at: Path.next(path) })

      editor.isTagSelectorOpened = false

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

function shouldOpen(editor: PenxEditor): boolean {
  const beforeText = getTextBeforeCursor(editor)
  if (typeof beforeText === 'undefined') return false
  if (beforeText === '') return false
  if (/^#+$/.test(beforeText)) return false
  return true
}
