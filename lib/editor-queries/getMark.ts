import { Editor } from 'slate'

/**
 * Get selected mark by type.
 */
export const getMark = (editor: Editor, type: string): any => {
  if (!editor) return
  return (Editor.marks(editor) as any)?.[type]
}
