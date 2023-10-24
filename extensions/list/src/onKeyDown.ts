import { Path } from 'slate'
import { onKeyDown as onKeyDownList } from 'slate-lists'
import {
  findNodePath,
  getCurrentNode,
  getNodeByPath,
} from '@penx/editor-queries'
import { OnKeyDown } from '@penx/extension-typings'
import { isTitle } from './guard'
import { insertEmptyList } from './transforms/insertEmptyList'
import { insertEmptyListItem } from './transforms/insertEmptyListItem'

export const onKeyDown: OnKeyDown = (editor, e) => {
  onKeyDownList(editor, e)

  if (e.key === 'Enter') {
    e.preventDefault()

    // handle enter key on title
    const node = getCurrentNode(editor)!
    const path = findNodePath(editor, node)
    if (!path) return

    const parentPath = Path.parent(path)
    const parentNode = getNodeByPath(editor, parentPath)

    if (isTitle(parentNode)) {
      const nextPath = Path.next(parentPath)
      const onlyHasTitle = editor.children.length === 1
      const at = onlyHasTitle ? nextPath : [...nextPath, 0]

      if (onlyHasTitle) {
        insertEmptyList(editor, { select: true, at })
      } else {
        insertEmptyListItem(editor, { select: true, at })
      }
    }
  }
}
