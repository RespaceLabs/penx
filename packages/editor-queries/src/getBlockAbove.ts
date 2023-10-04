import { Ancestor, Editor } from 'slate'
import { EditorAboveOptions } from '@penx/editor-types'
import { getAbove } from './getAbove'

/**
 * Get the block above a location (default: selection).
 */
export const getBlockAbove = <T extends Ancestor = Ancestor>(
  editor: Editor,
  options: EditorAboveOptions<T> = {},
) =>
  getAbove(editor, {
    ...options,
    block: true,
  })
