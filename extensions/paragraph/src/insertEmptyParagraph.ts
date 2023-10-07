import { Editor, Transforms } from 'slate'
import { NodeInsertNodesOptions } from 'slate/dist/interfaces/transforms/node'
import { getEmptyParagraph } from './getEmptyParagraph'
import { ParagraphElement } from './types'

export const insertEmptyParagraph = (
  editor: Editor,
  options?: NodeInsertNodesOptions<ParagraphElement>,
) => {
  Transforms.insertNodes(editor, getEmptyParagraph(), options)
}
