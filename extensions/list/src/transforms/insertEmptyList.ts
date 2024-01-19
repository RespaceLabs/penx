import { Editor, Transforms } from 'slate'
import { NodeInsertNodesOptions } from 'slate/dist/interfaces/transforms/node'
import { ListType } from '@penx/slate-lists'
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
