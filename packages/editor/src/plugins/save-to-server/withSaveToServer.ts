import { Editor } from 'slate'
import { isAstChange } from '@penx/editor-queries'

/**
 * Save data to server
 * @param editor
 * @returns
 */
export const withSaveToServer = (editor: Editor) => {
  const { onChange } = editor

  editor.onChange = () => {
    onChange()

    if (isAstChange(editor)) {
      // api.doc.update()
      // TODO: save to server
      // api.doc.
    }
  }

  return editor
}
