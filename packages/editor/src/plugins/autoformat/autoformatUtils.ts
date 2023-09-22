import { Editor, Element } from 'slate'
import { getParent } from '@penx/editor-queries'
import { ElementType } from '@penx/editor-shared'
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
      node.type !== ElementType.code_block &&
      node.type !== ElementType.code_line &&
      node.type !== ElementType.front_matter_block &&
      node.type !== ElementType.front_matter_line
    ) {
      customFormatting()
    }
  }
}

export const formatText = (editor: Editor, text: string) => {
  format(editor, () => editor.insertText(text))
}
