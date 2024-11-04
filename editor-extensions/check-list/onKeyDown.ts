import { getCurrentNode } from '@/lib/editor-queries'
import { OnKeyDown } from '@/lib/extension-typings'

export const onKeyDown: OnKeyDown = (editor, e) => {
  if (editor.isInTodoPage) {
    if (e.key == 'Enter') {
      e.preventDefault()
      return
    }
  }
}
