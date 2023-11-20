import { getNodeString, TElement } from '@udecode/plate-common'
import MarkdownIt from 'markdown-it'
import { Editor } from 'slate'
import { ELEMENT_CODE_BLOCK, ELEMENT_CODE_LINE } from '@penx/constants'
import { PenxEditor } from '@penx/editor-common'
import {
  findNode,
  getCurrentFocus,
  getCurrentPath,
  getNodeByPath,
} from '@penx/editor-queries'
import { MarkType } from '@penx/editor-shared'

function isEndOfInlineCode(editor: Editor) {
  const focus = getCurrentFocus(editor)
  const path = getCurrentPath(editor)
  const textNode = getNodeByPath(editor, path!) as any
  if (textNode?.code && focus && path) {
    return Editor.isEnd(editor, focus, path)
  }
  return false
}

function extractCodeLinesFromCodeBlock(node: TElement) {
  return node.children as TElement[]
}

function convertNodeToCodeLine(node: TElement): TElement {
  return {
    type: ELEMENT_CODE_LINE,
    children: [{ text: getNodeString(node) }],
  }
}

export const withCode = (editor: PenxEditor) => {
  const { deleteBackward, apply, insertText, insertFragment, insertData } =
    editor

  editor.insertText = (text) => {
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

  editor.insertFragment = (fragment) => {
    const inCodeLine = findNode(editor, {
      match: { type: ELEMENT_CODE_LINE },
    })

    if (!inCodeLine) {
      return insertFragment(fragment)
    }
    return insertFragment(
      fragment.flatMap((node) => {
        const element = node as TElement

        return element.type === ELEMENT_CODE_BLOCK
          ? extractCodeLinesFromCodeBlock(element)
          : convertNodeToCodeLine(element)
      }),
    )
  }

  // editor.normalizeNode = normalizeCodeBlock(editor)

  return editor
}
