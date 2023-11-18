import { Editor, Path } from 'slate'
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

function onEnterInTitle(editor: Editor) {
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
    return true
  }
}

export const onKeyDown: OnKeyDown = (editor, e) => {
  if (e.key === 'Enter') {
    const handled = onEnterInTitle(editor)

    if (handled) {
      e.preventDefault()
      return
    }

    const node = getCurrentNode(editor)!

    // TODO: handle any
    if ((node as any).type === 'block_selector') return
  }

  // TODO: too hack
  if (
    editor.isBlockSelectorOpened ||
    editor.isTagSelectorOpened ||
    editor.isBidirectionalLinkSelector
  )
    return
  onKeyDownList(editor, e)
}
