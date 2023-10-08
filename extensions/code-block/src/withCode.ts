import { getNodeString, TElement } from '@udecode/plate-common'
import { Editor } from 'slate'
import {
  findNode,
  getCurrentFocus,
  getCurrentPath,
  getNodeByPath,
} from '@penx/editor-queries'
import { MarkType } from '@penx/editor-shared'
import { ElementType } from './types'

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
    type: ElementType.code_line,
    children: [{ text: getNodeString(node) }],
  }
}

export const withCode = (editor: Editor) => {
  const { deleteBackward, apply, insertText, insertFragment } = editor

  editor.deleteBackward = (unit) => {
    deleteBackward(unit)
  }

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
      match: { type: ElementType.code_line },
    })

    if (!inCodeLine) {
      return insertFragment(fragment)
    }
    return insertFragment(
      fragment.flatMap((node) => {
        const element = node as TElement

        return element.type === ElementType.code_block
          ? extractCodeLinesFromCodeBlock(element)
          : convertNodeToCodeLine(element)
      }),
    )
  }

  // editor.normalizeNode = normalizeCodeBlock(editor)

  return editor
}
