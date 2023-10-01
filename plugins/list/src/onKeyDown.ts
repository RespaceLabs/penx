import { onKeyDown as onKeyDownList } from 'slate-lists'
import { OnKeyDown } from '@penx/plugin-typings'

export const onKeyDown: OnKeyDown = (editor, e) => {
  onKeyDownList(editor, e)
}
