import { Editor } from 'slate'

export const isAstChange = (editor: Editor) => {
  return editor.operations.some((op) => 'set_selection' !== op.type)
}
