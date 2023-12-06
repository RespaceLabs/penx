import { Box } from '@fower/react'
import { Editor, Element, Node, Path, Transforms } from 'slate'
import { ELEMENT_BIDIRECTIONAL_LINK_CONTENT } from '@penx/constants'
import { PenxEditor, useEditorStatic } from '@penx/editor-common'
import { findNodePath, getNodeByPath } from '@penx/editor-queries'
import { BidirectionalLinkContentElement } from '../types'
import { useKeyDownList } from '../useKeyDownList'
import { BidirectionalLinkSelectorItem } from './BidirectionalLinkSelectorItem'

interface Props {
  close: any
  element: Element
  containerRef: any
}

function getSearchText(editor: PenxEditor, element: any) {
  let text = Node.string(element)

  // TODO: need improvement
  if (editor.selection?.focus?.path) {
    const focusedNode = getNodeByPath(editor, editor.selection!.focus!.path)!
    const focusedNodeText = Node.string(focusedNode)
    if (focusedNodeText !== text) {
      text = text + focusedNodeText
    }
  }

  return text
}

export const BidirectionalLinkSelectorContent = ({ close, element }: Props) => {
  const editor = useEditorStatic()
  const text = getSearchText(editor, element)

  const filteredNodes = editor.items
    .filter((node) => {
      if (!node.canRef) return false

      const q = text.replace(/^\[\[/, '').toLowerCase()
      if (!q) return true
      return node.title.toLowerCase().includes(q)
    })
    .slice(0, 20)

  const selectType = (node: any) => {
    const path = findNodePath(editor, element)!

    Transforms.setNodes<BidirectionalLinkContentElement>(
      editor,
      {
        type: ELEMENT_BIDIRECTIONAL_LINK_CONTENT,
        linkId: node.id,
        children: [{ text: '' }],
      },
      { at: path },
    )

    // TODO: HACK, for not english text
    if (editor.selection?.focus?.path) {
      const node = getNodeByPath(editor, editor.selection!.focus!.path)!
      const text = Node.string(node)

      // focus to next node
      if (text?.length) {
        Transforms.removeNodes(editor, { at: editor.selection.focus.path })
      }

      Editor.insertNode(editor, { text: '' })
    }

    // focus to next node
    const nextNode = getNodeByPath(editor, Path.next(path))!
    if (nextNode) {
      Transforms.select(editor, Editor.start(editor, Path.next(path)))
    }

    setTimeout(() => {
      close()
    }, 0)
  }

  const listItemIdPrefix = 'internal-link-item-'

  const { cursor, setCursor } = useKeyDownList({
    onEnter: (cursor) => {
      selectType(filteredNodes[cursor])
      setCursor(0)

      setTimeout(() => {
        editor.isBidirectionalLinkSelector = false
      }, 50)
    },
    listLength: filteredNodes.length,
    listItemIdPrefix,
  })

  if (!filteredNodes.length) {
    return (
      <Box textSM toCenter h-64>
        No results found.
      </Box>
    )
  }

  return (
    <Box column gapY-1>
      {filteredNodes.map((node, i) => {
        return (
          <BidirectionalLinkSelectorItem
            key={node.id}
            node={node}
            id={listItemIdPrefix + i}
            isActive={i === cursor}
            onClick={() => selectType(node)}
          />
        )
      })}
    </Box>
  )
}
