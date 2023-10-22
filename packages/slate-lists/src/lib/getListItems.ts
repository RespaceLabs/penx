import type { Element, Location, NodeEntry } from 'slate'
import { Editor, Path, Point, Range, Span } from 'slate'
import type { ListsSchema } from '../types'

/**
 * Returns all "list-items" in a given Range.
 */
export function getListItems(
  editor: Editor,
  schema: ListsSchema,
  at: Location | Span | null = editor.selection,
): NodeEntry<Element>[] {
  if (!at) {
    return []
  }

  const start = getLocationStart(at)
  const listItems = Editor.nodes(editor, {
    mode: 'lowest',
    at,
    match: schema.isListItemNode,
  })

  const listItemEntries = Array.from(listItems)

  return listItemEntries.filter(([, path]) => {
    const [, grandparent] = Path.ancestors(start, { reverse: true })
    const rangeIsGrandhild = Path.equals(path, grandparent)
    const rangeIsDescendant = Path.isDescendant(start, path)
    const rangeStartsAfter = Path.isAfter(start, path)

    if (rangeIsDescendant) {
      // There's just one case where we want to include a "list-item" that is
      // an ancestor of the range starting point - when it's a grandparent of that point.
      // It's because the selection starting point will be in a grandchild `{ text: '' }` node.
      // <h-li>                       <--- grandparent
      //     <h-li-text>
      //         <h-text>             <--- grandchild
      //             <anchor />       <--- range starting point
      //         </h-text>
      //     </h-li-text>
      // </h-li>
      // Other ancestors are not "visually" in selection, but they are returned by `Editor.nodes`.

      // return !rangeStartsAfter && rangeIsGrandhild
      return !rangeStartsAfter
    }

    return !rangeStartsAfter
  }) as NodeEntry<Element>[]
}

function getLocationStart(location: Location | Span): Path {
  if (Range.isRange(location)) {
    return Range.start(location).path
  }
  if (Point.isPoint(location)) {
    return location.path
  }
  if (Span.isSpan(location)) {
    const [start, end] = location
    return Path.compare(start, end) <= 0 ? start : end
  }
  return location
}
