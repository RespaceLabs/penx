import { Editor, Transforms } from 'slate'
import { NodeInsertNodesOptions } from 'slate/dist/interfaces/transforms/node'
import { getEmptyParagraph } from '../getEmptyParagraph'
import { listSchema } from '../listSchema'
import { ListItemElement } from '../types'

export const insertEmptyListItem = (
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

  Transforms.insertNodes(editor, listItem, options)
}
