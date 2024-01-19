import { Editor, Path } from 'slate'
import { ELEMENT_CODE_BLOCK, ELEMENT_CODE_LINE } from '@penx/constants'
import { PenxEditor } from '@penx/editor-common'
import {
  findNodePath,
  getCurrentNode,
  getNodeByPath,
} from '@penx/editor-queries'
import { OnKeyDown } from '@penx/extension-typings'
import { NodeType } from '@penx/model-types'
import { onKeyDown as onKeyDownList } from '@penx/slate-lists'
import { isTitle } from './guard'
import { insertEmptyList } from './transforms/insertEmptyList'
import { insertEmptyListItem } from './transforms/insertEmptyListItem'
import { insertEmptyParagraph } from './transforms/insertEmptyParagraph'
import { TitleElement } from './types'

function onEnterInTitle(editor: PenxEditor) {
  // handle enter key on title
  const node = getCurrentNode(editor)!
  const path = findNodePath(editor, node)!
  const titlePath = Path.parent(path)
  const nextPath = Path.next(titlePath)
  const onlyHasTitle = editor.children.length === 1
  const at = onlyHasTitle ? nextPath : [...nextPath, 0]

  if (!editor.isOutliner) {
    insertEmptyParagraph(editor, { select: true, at: nextPath })
    return true
  }

  if (onlyHasTitle) {
    insertEmptyList(editor, { select: true, at })
  } else {
    insertEmptyListItem(editor, { select: true, at })
  }
  return true
}

function getParentNode(editor: PenxEditor) {
  const node = getCurrentNode(editor)!
  const path = findNodePath(editor, node)!

  if (!path) return null

  const parentPath = Path.parent(path)
  const parentNode = getNodeByPath(editor, parentPath)
  return parentNode!
}

function getTitleNode(editor: PenxEditor): TitleElement | undefined {
  const parentNode = getParentNode(editor)
  return isTitle(parentNode) ? parentNode : undefined
}

export const onKeyDown: OnKeyDown = (editor, e) => {
  const node = getCurrentNode(editor) as any

  if (editor.isOnComposition) {
    e.preventDefault()
    return
  }

  const parentNode = getParentNode(editor)

  if ([ELEMENT_CODE_LINE, ELEMENT_CODE_BLOCK].includes(node?.type)) {
    // e.preventDefault()
    return
  }

  const titleNode = getTitleNode(editor)

  if (titleNode) {
    if (e.key === 'Enter') {
      if (
        [
          NodeType.DAILY_ROOT,
          NodeType.DATABASE_ROOT,
          NodeType.DATABASE,
        ].includes(titleNode.nodeType!)
      ) {
        e.preventDefault()
        return
      }

      onEnterInTitle(editor)

      e.preventDefault()
      return
    } else {
      if (
        [NodeType.DAILY, NodeType.DAILY_ROOT, NodeType.DATABASE_ROOT].includes(
          titleNode.nodeType!,
        )
      ) {
        e.preventDefault()
        return
      }
    }
  } else {
    if ([NodeType.DAILY].includes((parentNode as any)?.nodeType)) {
      e.preventDefault()
      return
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
