import { Box, css } from '@fower/react'
import {
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Pilcrow,
} from 'lucide-react'
import { Editor, Path, Transforms } from 'slate'
import {
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
  ELEMENT_P,
  ELEMENT_TODO,
} from '@penx/constants'
import { useEditorStatic } from '@penx/editor-common'
import { findNodePath, getNodeByPath } from '@penx/editor-queries'
import { useBulletDrawer } from '@penx/hooks'
import {
  IconCircleRight,
  IconDelete,
  IconEye,
  IconTodo,
  IconZoomIn,
} from '@penx/icons'
import { ListContentElement } from '@penx/list'
import { useNodeContext, useNodes } from '@penx/node-hooks'
import { NodeService } from '@penx/service'
import { store } from '@penx/store'
import { AddTag } from './AddTag'
import { MenuItem } from './MenuItem'

const headings = [ELEMENT_H1, ELEMENT_H2, ELEMENT_H3, ELEMENT_H4, ELEMENT_H5]

const icons = [Heading1, Heading2, Heading3, Heading4, Heading5, Heading5]

export const BulletMenuBox = () => {
  const { close, node: bulletNode, element } = useBulletDrawer()
  const editor = useEditorStatic()

  const { nodes } = useNodes()
  const { node } = useNodeContext()
  const nodeService = new NodeService(node, nodes)

  function setType(type: any) {
    const path = findNodePath(editor, element)!
    const blockPath = [...path, 0]
    const block = getNodeByPath(editor, blockPath) as any

    if (block) {
      Transforms.setNodes<any>(editor, { type }, { at: blockPath })
      const children = editor.children as any[]
      nodeService.saveOutlinerEditor(node.raw, children[0], children[1])
    }

    close()
  }

  if (!bulletNode) return null

  return (
    <Box p4 column gap3>
      <Box toCenterY gap2 toCenterX>
        <Box
          circle9
          border-2
          borderGray100
          toCenter
          textSM
          gray800
          mr4
          onClick={() => setType(ELEMENT_P)}
        >
          <Pilcrow size={20} />
        </Box>
        {headings.map((h, index) => {
          const Icon = icons[index]
          return (
            <Box
              key={h}
              circle9
              border-2
              borderGray100
              toCenter
              textSM
              gray800
              onClick={() => setType(h)}
            >
              <Icon size={20} />
            </Box>
          )
        })}
      </Box>
      <Box>
        <MenuItem
          icon={<IconTodo size={20} />}
          label="Toggle checkbox"
          onClick={() => {
            const path = findNodePath(editor, element)!

            const blockPath = [...path, 0]
            const block = getNodeByPath(editor, blockPath) as any

            if (block) {
              Transforms.setNodes<any>(
                editor,
                {
                  type: block.type === ELEMENT_TODO ? ELEMENT_P : ELEMENT_TODO,
                },
                { at: blockPath },
              )

              const children = editor.children as any[]
              nodeService.saveOutlinerEditor(node.raw, children[0], children[1])
            }

            close()
          }}
        />

        <MenuItem
          icon={<IconZoomIn size={20} />}
          label="Zoom in"
          onClick={() => {
            store.node.selectNode(bulletNode)
            close()
          }}
        />

        <MenuItem
          icon={<IconCircleRight size={20} />}
          label="Collapse node"
          onClick={() => {
            const path = findNodePath(editor, element)!

            Transforms.setNodes<ListContentElement>(
              editor,
              { collapsed: !element.collapsed },
              { at: path },
            )

            close()
          }}
        />

        <MenuItem
          icon={<IconDelete size={20} />}
          label="Delete node"
          borderBottom-0
          onClick={() => {
            const path = findNodePath(editor, element)!
            Transforms.removeNodes(editor, { at: Path.parent(path) })
            close()
          }}
        />
      </Box>
      {/* <AddTag></AddTag> */}
    </Box>
  )
}
