import { Editor } from 'slate'
import { EditorAboveOptions } from '@penx/editor-types'
import { getBlockAbove } from './getBlockAbove'
import { getPointFromLocation } from './getPointFromLocation'

/**
 * Get the range from the start of the block above a location (default: selection) to the location.
 * 从block起始到 focus 位置的范围。
 */
export const getRangeFromBlockStart = (
  editor: Editor,
  options: Omit<EditorAboveOptions, 'match'> = {},
) => {
  const path = getBlockAbove(editor, options)?.[1]
  if (!path) return

  const start = Editor.start(editor, path)

  const focus = getPointFromLocation(editor, options)

  if (!focus) return

  return { anchor: start, focus }
}
