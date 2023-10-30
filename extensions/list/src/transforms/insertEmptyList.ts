import { Editor, Transforms } from 'slate'
import { ListType } from 'slate-lists'
import { NodeInsertNodesOptions } from 'slate/dist/interfaces/transforms/node'
import { getEmptyElement } from '../getEmptyElement'
import { listSchema } from '../listSchema'
import { ListItemElement } from '../types'

export const insertEmptyList = (
  editor: Editor,
  options?: NodeInsertNodesOptions<ListItemElement>,
) => {
  const listItem = listSchema.createListItemNode({
    children: [
      listSchema.createListItemTextNode({
        children: [getEmptyElement()],
      }),
    ],
  })

  const list = listSchema.createListNode(ListType.UNORDERED, {
    children: [listItem],
  })

  Transforms.insertNodes(editor, list, options)
}
