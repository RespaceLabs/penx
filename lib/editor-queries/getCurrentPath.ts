import { Editor, Path } from 'slate'
import { getCurrentFocus } from './getCurrentFocus'

/**
 * Get Current Focus Path
 * @param editor
 */
export function getCurrentPath(editor: Editor): Path | null {
  const focus = getCurrentFocus(editor)
  if (!focus) return null
  return focus.path
}
