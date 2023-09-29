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
    const [node] = parentEntry
    if (
      Element.isElement(node) &&
      node.type !== 'code_block' &&
      node.type !== 'code_line' &&
      node.type !== 'front_matter_block' &&
      node.type !== 'front_matter_line'
    ) {
      customFormatting()
    }
  }
}

export const formatText = (editor: Editor, text: string) => {
  format(editor, () => editor.insertText(text))
}
