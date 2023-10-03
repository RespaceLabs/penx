import { Editor, Transforms } from 'slate'
import { NodeInsertNodesOptions } from 'slate/dist/interfaces/transforms/node'
import { ParagraphElement } from '../custom-types'
import { getEmptyParagraph } from './getEmptyParagraph'

export const insertEmptyParagraph = (
  editor: Editor,
  options?: NodeInsertNodesOptions<ParagraphElement>,
) => {
  Transforms.insertNodes(editor, getEmptyParagraph(), options)
}
