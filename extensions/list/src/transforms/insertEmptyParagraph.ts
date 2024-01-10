import { Editor, Transforms } from 'slate'
import { NodeInsertNodesOptions } from 'slate/dist/interfaces/transforms/node'
import { uniqueId } from '@penx/unique-id'
import { getEmptyElement } from '../getEmptyElement'
import { ListItemElement } from '../types'

export const insertEmptyParagraph = (
  editor: Editor,
  options?: NodeInsertNodesOptions<ListItemElement>,
) => {
  Transforms.insertNodes(
    editor,
    {
      ...getEmptyElement(),
      id: uniqueId(),
    } as any,
    options,
  )
}
