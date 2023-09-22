import type { Editor } from 'slate'
import * as Registry from './registry'
import type { ListsSchema } from './types'

/**
 * Enables normalizations that enforce schema constraints and recover from unsupported cases.
 */
export function withListsSchema(schema: ListsSchema) {
  return function <T extends Editor>(editor: T): T {
    Registry.register(editor, schema)

    return editor
  }
}
