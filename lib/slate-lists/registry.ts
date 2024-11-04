import type { Editor } from 'slate'
import type { ListsSchema } from './types'

const EDITOR_LISTS_SCHEMA = new WeakMap<Editor, ListsSchema>()

export function register(editor: Editor, schema: ListsSchema): void {
  EDITOR_LISTS_SCHEMA.set(editor, schema)
}

export function unregister(editor: Editor): void {
  EDITOR_LISTS_SCHEMA.delete(editor)
}

export function has(editor: Editor) {
  return EDITOR_LISTS_SCHEMA.has(editor)
}

export function get(editor: Editor): ListsSchema {
  const schema = EDITOR_LISTS_SCHEMA.get(editor)
  if (!schema) {
    throw new Error(
      'This editor instance does not have a ListsSchema associated. Make sure you initialize it with withLists() before using ListsEditor functionality.',
    )
  }
  return schema
}
