import { Editor, Element, Node, Transforms } from 'slate'
import { getBlockAbove, getText } from '@penx/editor-queries'
import { ElementType } from '@penx/editor-shared'
import { insertNodes } from '@penx/editor-transforms'

/**
 * close or open block selector popover
 * Open when typing / at the beginning of a line, and close when deleting /.
 * @param editor
 * @returns
 */
export const withBlockSelector = (editor: Editor) => {
  const trigger = '/'
  const { insertText, normalizeNode } = editor

  editor.insertText = (text) => {
    if (!editor.selection || text !== trigger) {
      return insertText(text)
    }

    // in codeblock
    const match = Editor.above(editor, {
      match: (n) => [ElementType.code_block].includes(n.type),
    })

    if (match?.[0]) {
      return insertText(text)
    }

    const id = shouldOpen(editor)

    if (id) {
      insertNodes(editor, {
        type: ElementType.block_selector,
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
      node.type === ElementType.block_selector &&
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
 * Whether to open or close the block selector popover, returning the current block ID in the process.
 * @param editor
 * @returns
 */
function shouldOpen(editor: Editor): string | false {
  const excludeKeys = [ElementType.code_line]
  const nodeEntry = getBlockAbove(editor)

  if (nodeEntry && !excludeKeys.includes(nodeEntry[0].type as any)) {
    if (getText(editor, nodeEntry[1]) === '') {
      return nodeEntry[0].id!
    }
  }
  return false
}
