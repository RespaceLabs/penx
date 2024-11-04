import type { Editor } from 'slate'
import { normalizeNode } from './normalizeNode'

export function withListsNormalization<T extends Editor>(editor: T): T {
  const parent = { normalizeNode: editor.normalizeNode }
  editor.normalizeNode = (entry, options) => {
    return normalizeNode(editor, entry) || parent.normalizeNode(entry, options)
  }
  return editor
}
