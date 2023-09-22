import { Editor, Element } from 'slate'
import {
  isExpanded,
  isSelectionAtBlockStart,
  someNode,
} from '@penx/editor-queries'
import { ElementType } from '@penx/editor-shared'
import { setNodes, wrapNodes } from '@penx/editor-transforms'
import { InsertNodesOptions } from '@penx/editor-types'

/**
 * Insert a code block: set the node to code line and wrap it with a code block.
 * If the cursor is not at the block start, insert break before.
 */
export const insertCodeBlock = (
  editor: Editor,
  insertNodesOptions: Omit<InsertNodesOptions, 'match'> = {},
) => {
  if (!editor.selection || isExpanded(editor.selection)) return

  const matchCodeElements = (node: Element) =>
    node.type === ElementType.code_block || node.type === ElementType.code_line

  if (someNode(editor, { match: matchCodeElements })) {
    return
  }

  if (!isSelectionAtBlockStart(editor)) {
    editor.insertBreak()
  }

  setNodes(
    editor,
    {
      type: ElementType.code_line,
      children: [{ text: '' }],
    },
    insertNodesOptions,
  )

  wrapNodes(
    editor,
    {
      language: 'js', // TODO:
      type: ElementType.code_block,
      children: [],
    },
    insertNodesOptions,
  )
}
