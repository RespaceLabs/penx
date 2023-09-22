import { Ancestor, Editor } from 'slate'
import { EditorAboveOptions } from '@penx/editor-types'
import { getBlockAbove } from './getBlockAbove'
import { isStart } from './isStart'

/**
 * Is the selection focus at the start of its parent block.
 *
 * Supports the same options provided by {@link getBlockAbove}.
 */
export const isSelectionAtBlockStart = (
  editor: Editor,
  options?: EditorAboveOptions<Ancestor>,
) => {
  const path = getBlockAbove(editor, options)?.[1]
  return !!path && isStart(editor, editor.selection?.focus, path)
}
