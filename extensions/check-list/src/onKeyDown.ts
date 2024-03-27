import { getCurrentNode } from '@penx/editor-queries'
import { OnKeyDown } from '@penx/extension-typings'

export const onKeyDown: OnKeyDown = (editor, e) => {
  if (editor.isInTodoPage) {
    if (e.key == 'Enter') {
      e.preventDefault()
      return
    }
  }
}
