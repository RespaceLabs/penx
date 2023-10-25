import type { ReactEditor } from 'slate-react'
import type { ListsSchema } from './types'
import { withListsNormalization } from './withListsNormalization'
import { withListsReact } from './withListsReact'
import { withListsSchema } from './withListsSchema'

export function withLists(schema: ListsSchema) {
  return <T extends ReactEditor>(editor: T): T => {
    return withListsReact(
      withListsNormalization(withListsSchema(schema)(editor)),
    )
  }
}
