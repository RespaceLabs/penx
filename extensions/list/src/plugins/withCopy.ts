import { Editor, Node } from 'slate'
import { PenxEditor } from '@penx/editor-common'
import { listSchema } from '../listSchema'

export const withCopy = (editor: PenxEditor) => {
  const { setFragmentData } = editor

  editor.setFragmentData = (data: DataTransfer, event) => {
    if (event === 'copy' || event === 'cut') {
      const entries = Editor.nodes(editor, {
        at: editor.selection!,
        match: listSchema.isListItemTextNode,
      })

      const nodes = Array.from(entries)

      // console.log('==========nodes:', nodes)

      if (nodes.length < 2) {
        return setFragmentData(data, event)
      }

      const lines = nodes.map((item) => '- ' + Node.string(item[0]))
      // console.log('====nodes:', nodes, lines)
      data.setData('text/plain', lines.join('\n'))
      return
    }

    return setFragmentData(data, event)
  }

  return editor
}
