import { Editor, Node, Path, Transforms } from 'slate'
import { isBlockAboveEmpty, isExpanded } from '@penx/editor-queries'
import { getEmptyParagraph } from '@penx/paragraph'
import { insertCodeBlock } from './insertCodeBlock'

export interface CodeBlockInsertOptions {
  level?: number
}

/**
 * Called by toolbars to make sure a code-block gets inserted below a paragraph
 * rather than awkwardly splitting the current selection.
 */
export const insertEmptyCodeBlock = (
  editor: Editor,
  { level = 0 }: CodeBlockInsertOptions,
) => {
  if (!editor.selection) return

  if (isExpanded(editor.selection) || !isBlockAboveEmpty(editor)) {
    const selectionPath = Editor.path(editor, editor.selection)
    const insertPath = Path.next(selectionPath.slice(0, level + 1))

    Transforms.insertNodes(editor, getEmptyParagraph() as Node, {
      at: insertPath,
      select: true,
    })
  }
  insertCodeBlock(editor)
}
