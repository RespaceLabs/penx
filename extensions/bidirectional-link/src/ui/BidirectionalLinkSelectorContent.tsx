import { Box } from '@fower/react'
import { Editor, Element, Node, Transforms } from 'slate'
import { useSlateStatic } from 'slate-react'
import { getCurrentPath } from '@penx/editor-queries'
import { selectEditor } from '@penx/editor-transforms'
import {
  BidirectionalLinkContentElement,
  ELEMENT_BIDIRECTIONAL_LINK_CONTENT,
} from '../types'
import { useKeyDownList } from '../useKeyDownList'
import { BidirectionalLinkSelectorItem } from './BidirectionalLinkSelectorItem'

interface Props {
  close: any
  element: Element
  containerRef: any
}

export const BidirectionalLinkSelectorContent = ({ close, element }: Props) => {
  const editor = useSlateStatic()
  const path = getCurrentPath(editor)!
  const nodes: any[] = [] // TODO:

  const filteredNodes = nodes.filter((node) => {
    const q = Node.string(element).replace(/^\[\[/, '').toLowerCase()
    if (!q) return true
    return node.name.toLowerCase().includes(q)
  })

  function focusToEnd() {
    const block = Editor.above(editor, {
      match: (n) => Editor.isBlock(editor, n as Element),
    })

    const at = block ? block[1] : []
    selectEditor(editor, { focus: true, at: Editor.end(editor, at) })
  }

  const selectType = (node: any) => {
    Transforms.removeNodes(editor, { at: path.slice(0, -1) })
    Transforms.insertNodes<BidirectionalLinkContentElement>(editor, {
      type: ELEMENT_BIDIRECTIONAL_LINK_CONTENT,
      linkId: node.id,
      linkName: node.name,
      children: [{ text: '' }],
    } as BidirectionalLinkContentElement)
    focusToEnd()
    close()
  }

  const listItemIdPrefix = 'internal-link-item-'

  const { cursor, setCursor } = useKeyDownList({
    onEnter: (cursor) => {
      selectType(filteredNodes[cursor])
      setCursor(0)
    },
    listLength: filteredNodes.length,
    listItemIdPrefix,
  })

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
