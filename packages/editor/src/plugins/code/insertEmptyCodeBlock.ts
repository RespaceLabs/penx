import { Editor, Path } from 'slate'
import { isBlockAboveEmpty, isExpanded } from '@penx/editor-queries'
import { ElementType } from '@penx/editor-shared'
import { insertNodes } from '@penx/editor-transforms'
import { InsertNodesOptions } from '@penx/editor-types'
import { insertCodeBlock } from './insertCodeBlock'

export interface CodeBlockInsertOptions {
  level?: number
  insertNodesOptions?: Omit<InsertNodesOptions, 'match'>
}

/**
 * Called by toolbars to make sure a code-block gets inserted below a paragraph
 * rather than awkwardly splitting the current selection.
 */
export const insertEmptyCodeBlock = (
  editor: Editor,
  { insertNodesOptions, level = 0 }: CodeBlockInsertOptions,
) => {
  if (!editor.selection) return

  if (isExpanded(editor.selection) || !isBlockAboveEmpty(editor)) {
    const selectionPath = Editor.path(editor, editor.selection)
    const insertPath = Path.next(selectionPath.slice(0, level + 1))

    insertNodes(
      editor,
      { type: ElementType.p, children: [{ text: '' }] },
      {
        at: insertPath,
        select: true,
      },
    )
  }
  insertCodeBlock(editor, insertNodesOptions)
}
