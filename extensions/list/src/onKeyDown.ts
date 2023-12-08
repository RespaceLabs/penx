import { Editor, Path } from 'slate'
import { onKeyDown as onKeyDownList } from 'slate-lists'
import { ELEMENT_CODE_BLOCK, ELEMENT_CODE_LINE } from '@penx/constants'
import { PenxEditor } from '@penx/editor-common'
import {
  findNodePath,
  getCurrentNode,
  getNodeByPath,
} from '@penx/editor-queries'
import { OnKeyDown } from '@penx/extension-typings'
import { NodeType } from '@penx/model-types'
import { isTitle } from './guard'
import { insertEmptyList } from './transforms/insertEmptyList'
import { insertEmptyListItem } from './transforms/insertEmptyListItem'
import { TitleElement } from './types'

function onEnterInTitle(editor: Editor) {
  // handle enter key on title
  const node = getCurrentNode(editor)!
  const path = findNodePath(editor, node)!
  const parentPath = Path.parent(path)
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

function getTitleNode(editor: PenxEditor): TitleElement | undefined {
  const node = getCurrentNode(editor)!
  const path = findNodePath(editor, node)
  if (!path) return undefined

  const parentPath = Path.parent(path)
  const parentNode = getNodeByPath(editor, parentPath)

  return isTitle(parentNode) ? parentNode : undefined
}

export const onKeyDown: OnKeyDown = (editor, e) => {
  const node = getCurrentNode(editor) as any

  if (editor.isOnComposition) {
    e.preventDefault()
    return
  }

  if ([ELEMENT_CODE_LINE, ELEMENT_CODE_BLOCK].includes(node?.type)) {
    return
  }

  const titleNode = getTitleNode(editor)

  if (titleNode) {
    if (e.key === 'Enter') {
      onEnterInTitle(editor)

      e.preventDefault()
      return
    } else {
      if (
        [NodeType.DAILY, NodeType.DATABASE_ROOT].includes(titleNode.nodeType!)
      ) {
        e.preventDefault()
        return
      }
    }
  }

  // TODO: too hack
  if (
    editor.isBlockSelectorOpened ||
    editor.isTagSelectorOpened ||
    editor.isBidirectionalLinkSelector
  ) {
    if (e.key === 'Enter') {
      e.preventDefault()
      return
    }
  }

  onKeyDownList(editor, e)
}
