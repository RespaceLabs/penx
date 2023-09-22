import type { Editor, Element, Location, NodeEntry } from 'slate'
import type { ListsSchema } from '../types'
import { getListItems } from './getListItems'
import { getParentList } from './getParentList'

/**
 * Get all lists in the given Range.
 */
export function getLists(
  editor: Editor,
  schema: ListsSchema,
  at: Location | null,
): NodeEntry<Element>[] {
  const listItemsInRange = getListItems(editor, schema, at)
  const lists = listItemsInRange
    .map(([, listItemPath]) => getParentList(editor, schema, listItemPath))
    .filter((list) => list !== null)
  // TypeScript complains about `null`s even though we filter for them, hence the typecast.
  return lists as NodeEntry<Element>[]
}
