import { Editor, Element } from 'slate'
import { getQueryOptions } from '@penx/editor-queries'
import { InsertNodesOptions } from '@penx/editor-types'
import { insertNodes } from './insertNodes'

export const insertEmptyElement = (
  editor: Editor,
  type: any,
  options?: InsertNodesOptions,
) => {
  insertNodes(
    editor,
    {
      type,
      children: [{ text: '' }],
    },
    getQueryOptions(editor, options),
  )
}
