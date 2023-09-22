import { Editor } from 'slate'

export const isAstChange = (editor: Editor) => {
  /** 如果有不是 set_selection 的 op，就是 change */
  return editor.operations.some((op) => 'set_selection' !== op.type)
}
