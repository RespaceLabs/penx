import { BasePoint, Editor } from 'slate'

/**
 * Get current focus position of cursor
 * @param editor
 * @returns
 */
export function getCurrentFocus(editor: Editor): BasePoint | null {
  if (!editor.selection) return null
  return editor.selection.focus
}
