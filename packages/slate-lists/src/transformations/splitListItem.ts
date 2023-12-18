import type { Location } from 'slate'
import { Editor, Node, Path, Range, Transforms } from 'slate'
import { NESTED_LIST_PATH_INDEX, TEXT_PATH_INDEX } from '../constants'
import { getCursorPositionInNode, getListItems } from '../lib'
import { getCursorPosition } from '../lib/getCursorPosition'
import { getCurrentNode } from '../queries/getCurrentNode'
import { getCurrentPath } from '../queries/getCurrentPath'
import type { ListsSchema } from '../types'

/**
 * Collapses the current selection (by removing everything in it) and if the cursor
 * ends up in a "list-item" node, it will break that "list-item" into 2 nodes, splitting
 * the text at the cursor location.
 *
 * @returns {boolean} True, if the editor state has been changed.
 */
export function splitListItem(
  editor: Editor,
  schema: ListsSchema,
  at: Location | null = editor.selection,
): boolean {
  if (!at) {
    return false
  }

  // If selection *is* expanded, we take the leading point. It should be safe,
  // because we're deleted everything within the range below, effectively collapsing it.
  const cursorPoint = getCursorPosition(
    editor,
    Range.isRange(at) ? Range.start(at) : at,
  )

  if (!cursorPoint) {
    return false
  }

  if (Range.isRange(at) && Range.isExpanded(at)) {
    // Remove everything in selection (this will collapse the selection).
    Transforms.delete(editor)
  }

  const listItemsInSelection = getListItems(editor, schema, editor.selection)

  if (listItemsInSelection.length !== 1) {
    // Selection is collapsed, so there should be either 0 or 1 "list-item" in selection.
    // When no "list-items" are selected - there's no "list-item" to split.
    return false
  }

  const [[listItemNode, listItemPath]] = listItemsInSelection
  const listContentNode = listItemNode.children[TEXT_PATH_INDEX]

  const listItemTextPath = [...listItemPath, TEXT_PATH_INDEX]

  const { isEnd, isStart } = getCursorPositionInNode(
    editor,
    cursorPoint,
    listItemTextPath,
  )

  const node = getCurrentNode(editor) as any

  if (isStart && node.type === 'p') {
    const newListItem = schema.createListItemNode({
      children: [schema.createListItemTextNode()],
    })
    Transforms.insertNodes(editor, newListItem, { at: listItemPath })
    return true
  }

  const newListItemPath = Path.next(listItemPath)
  const newListItemTextPath = Path.next(listItemTextPath)
  const hasNestedList = Node.has(listItemNode, [NESTED_LIST_PATH_INDEX]) // listItemNode.children.length > 1

  const isContentCollapsed = (listContentNode as any).collapsed

  Editor.withoutNormalizing(editor, () => {
    if (isEnd) {
      const node = getCurrentNode(editor)! as any

      // TODO: too hack, move to listSchema?
      let type = node.type === 'check_list_item' ? node.type : 'p'

      const newListItem = schema.createListItemNode({
        children: [
          schema.createListItemTextNode({
            children: [
              {
                type,
                children: [{ text: '' }],
              } as any,
            ],
          }),
        ],
      })
      Transforms.insertNodes(editor, newListItem, { at: newListItemPath })

      // Move the cursor to the new "list-item".
      Transforms.select(editor, newListItemPath)
    } else {
      // Split current "list-item-text" element into 2.
      Transforms.splitNodes(editor)

      // const node = getCurrentNode(editor)!
      // const path = getCurrentPath(editor)!

      const above: any = Editor.above(editor, {
        at: editor.selection!,
        match: (n) => Editor.isBlock(editor, n as any),
      })
      const node = above[0]
      const path = getCurrentPath(editor)!

      const [listItemText] = Editor.nodes(editor, {
        mode: 'lowest',
        at: editor.selection!,
        match: schema.isListItemTextNode,
      })

      // remove the splitted node
      Transforms.removeNodes(editor, { at: Path.parent(path) })

      // create a new list item base one the splitted node
      const nodeItem = schema.createListItemNode({
        children: [
          schema.createListItemTextNode({
            children: [node],
          }),
        ],
      })

      const listItemPath = listItemText[1]

      const at = Path.next(listItemPath)

      // insert a new list item
      Transforms.insertNodes(editor, nodeItem, { at, select: true })

      Transforms.select(editor, Editor.start(editor, at))

      if (hasNestedList && isContentCollapsed) {
        Transforms.moveNodes(editor, {
          at: [...Path.next(at)],
          to: [...Path.next(listItemPath)],
        })
      }

      return
    }

    // If there was a "list" in the "list-item" move it to the new "list-item".
    if (hasNestedList && !isContentCollapsed) {
      Transforms.moveNodes(editor, {
        at: Path.next(listItemTextPath),
        to: [...newListItemPath, NESTED_LIST_PATH_INDEX],
      })
    }
  })

  return true
}
