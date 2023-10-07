import { Box } from '@fower/react'
import { Editor, Element, Node, Transforms } from 'slate'
import { useSlateStatic } from 'slate-react'
import {
  CatalogueNodeJSON,
  CatalogueNodeType,
  CatalogueTree,
} from '@penx/catalogue'
import { getCurrentPath } from '@penx/editor-queries'
import { selectEditor } from '@penx/editor-transforms'
import { ElementType, InternalLinkContentElement } from '../types'
import { useKeyDownList } from '../useKeyDownList'
import { InternalLinkSelectorItem } from './InternalLinkSelectorItem'

interface Props {
  close: any
  element: Element
  containerRef: any
}

export const InternalLinkSelectorContent = ({ close, element }: Props) => {
  const space = {} as any
  const editor = useSlateStatic()
  const catalogue = CatalogueTree.fromJSON(space?.catalogue)
  const path = getCurrentPath(editor)!
  const nodes = catalogue.flatten(CatalogueNodeType.DOC)

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

  const selectType = (node: CatalogueNodeJSON) => {
    Transforms.removeNodes(editor, { at: path.slice(0, -1) })
    Transforms.insertNodes<InternalLinkContentElement>(editor, {
      type: ElementType.internal_link_content,
      linkId: node.id,
      linkName: node.name,
      children: [{ text: '' }],
    } as InternalLinkContentElement)
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
          <InternalLinkSelectorItem
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
