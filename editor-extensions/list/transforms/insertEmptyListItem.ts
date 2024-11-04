import { Editor, Transforms } from 'slate'
import { NodeInsertNodesOptions } from 'slate/dist/interfaces/transforms/node'
import { getEmptyElement } from '../getEmptyElement'
import { listSchema } from '../listSchema'
import { ListItemElement } from '../types'

export const insertEmptyListItem = (
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

  Transforms.insertNodes(editor, listItem, options)
}
