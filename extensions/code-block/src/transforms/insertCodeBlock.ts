import { Editor, Element } from 'slate'
import { ELEMENT_CODE_BLOCK, ELEMENT_CODE_LINE } from '@penx/constants'
import {
  isExpanded,
  isSelectionAtBlockStart,
  someNode,
} from '@penx/editor-queries'
import { setNodes, wrapNodes } from '@penx/editor-transforms'
import { isCodeBlock, isCodeLine } from '../guard'
import { CodeBlockElement, CodeLineElement } from '../types'

/**
 * Insert a code block: set the node to code line and wrap it with a code block.
 * If the cursor is not at the block start, insert break before.
 */
export const insertCodeBlock = (editor: Editor) => {
  if (!editor.selection || isExpanded(editor.selection)) return

  const matchCodeElements = (node: CodeBlockElement | CodeLineElement) =>
    isCodeBlock(node) || isCodeLine(node)

  if (someNode(editor, { match: matchCodeElements })) {
    return
  }

  if (!isSelectionAtBlockStart(editor)) {
    editor.insertBreak()
  }

  setNodes(editor, {
    type: ELEMENT_CODE_LINE,
    children: [{ text: '' }],
  })

  wrapNodes(editor, {
    language: 'js', // TODO:
    type: ELEMENT_CODE_BLOCK,
    children: [],
  } as any)
}
