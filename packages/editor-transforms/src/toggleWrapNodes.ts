import { Editor } from 'slate'
import { someNode } from '@penx/editor-queries'
import { unwrapNodes } from './unwrapNodes'
import { wrapNodes } from './wrapNodes'

/**
 * Unwrap if the node type is in selection.
 * Wrap otherwise.
 */
export const toggleWrapNodes = (editor: Editor, type: any) => {
  if (someNode(editor, { match: { type } })) {
    unwrapNodes(editor, { match: { type } })
  } else {
    wrapNodes(editor, {
      type,
      children: [],
    })
  }
}
