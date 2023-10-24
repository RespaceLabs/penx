import { Editor, Transforms } from 'slate'
import { ListType } from 'slate-lists'
import { NodeInsertNodesOptions } from 'slate/dist/interfaces/transforms/node'
import { getEmptyParagraph } from '@penx/paragraph'
import { listSchema } from '../listSchema'
import { ListItemElement } from '../types'

export const insertEmptyList = (
  editor: Editor,
  options?: NodeInsertNodesOptions<ListItemElement>,
) => {
  const listItem = listSchema.createListItemNode({
    children: [
      listSchema.createListItemTextNode({
        children: [getEmptyParagraph()],
      }),
    ],
  })

  const list = listSchema.createListNode(ListType.UNORDERED, {
    children: [listItem],
  })

  Transforms.insertNodes(editor, list, options)
}
