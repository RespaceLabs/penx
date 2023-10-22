import { Editor, Element, Node, Path, Transforms } from 'slate'
import {
  findNode,
  getCurrentFocus,
  getCurrentNode,
  getCurrentPath,
} from '@penx/editor-queries'
import { isListItemElement } from './guard'
import { listSchema } from './listSchema'

export function withSplitList(editor: Editor) {
  const { apply } = editor

  // TODO: should do some validations
  editor.apply = (operation) => {
    if (operation.type === 'split_node') {
      console.log('1111111111111')

      const { properties } = operation

      if (!Object.keys(properties).length) {
        return apply(operation)
      }

      apply(operation)

      const node = getCurrentNode(editor)!
      const path = getCurrentPath(editor)!

      const [listItem] = Editor.nodes(editor, {
        at: editor.selection!,
        match: isListItemElement,
      })

      // remove the splitted node
      Transforms.removeNodes(editor, { at: Path.parent(path) })

      console.log('---x----:', node)

      // create a new list item base one the splitted node
      const nodeItem = listSchema.createListItemNode({
        children: [
          listSchema.createListItemTextNode({
            children: [node],
          }),
        ],
      })

      const listItemPath = listItem[1]

      // const at = [
      //   ...Path.parent(listItemPath),
      //   listItemPath[listItemPath.length - 1] + 1,
      // ]

      const at = Path.next(listItemPath)

      // insert a new list item
      Transforms.insertNodes(editor, nodeItem, { at })

      return
    }
    return apply(operation)
  }

  return editor
}
