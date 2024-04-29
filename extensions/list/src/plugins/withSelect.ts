import { Editor } from 'slate'
import { PenxEditor } from '@penx/editor-common'
import { emitter } from '../emitter'
import { listSchema } from '../listSchema'

export const withSelect = (editor: PenxEditor) => {
  const { apply } = editor

  editor.apply = (operation) => {
    if (operation.type === 'set_selection') {
      const res = Editor.nodes(editor, {
        mode: 'lowest',
        at: operation.newProperties as any,
        match: listSchema.isListItemTextNode,
      })

      const licEntries = Array.from(res)

      // console.log('======licEntries:', licEntries)

      if (licEntries.length) {
        emitter.emit('ON_SELECT', (licEntries?.[0]?.[0] as any).id as string)
      }
    }
    return apply(operation)
  }

  return editor
}
