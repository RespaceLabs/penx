import { Editor, Element } from 'slate'
import { getParent } from '@penx/editor-queries'
import { AutoformatBlockRule } from './types'

export const clearBlockFormat: AutoformatBlockRule['preFormat'] = (editor) => {
  //
}

export const format = (editor: Editor, customFormatting: any) => {
  if (editor.selection) {
    const parentEntry = getParent(editor, editor.selection)
    if (!parentEntry) return
    const [node] = parentEntry as any
    if (
      Element.isElement(node as Element) &&
      node.type !== 'code_block' &&
      node.type !== 'code_line'
    ) {
      customFormatting()
    }
  }
}

export const formatText = (editor: Editor, text: string) => {
  format(editor, () => editor.insertText(text))
}
