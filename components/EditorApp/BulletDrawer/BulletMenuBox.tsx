import { ListContentElement } from '@/editor-extensions/list'
import { useBulletDrawer } from '@/hooks'
import {
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
  ELEMENT_P,
  ELEMENT_TODO,
} from '@/lib/constants'
import { useEditorStatic } from '@/lib/editor-common'
import { findNodePath, getNodeByPath } from '@/lib/editor-queries'
import { useNodeContext, useNodes } from '@/lib/node-hooks'
import { NodeService } from '@/lib/service'
import { store } from '@/store'
import {
  CheckCircle,
  CircleArrowRight,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Pilcrow,
  Trash2,
  ZoomIn,
} from 'lucide-react'
import { Editor, Path, Transforms } from 'slate'
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
    <div className="p-4 flex flex-col gap-3">
      <div className="flex items-center justify-center gap-2">
        <div
          className="h-9 w-9 rounded-full border-2 border-foreground/10 flex items-center justify-center text-sm text-foreground/80 mr-4"
          onClick={() => setType(ELEMENT_P)}
        >
          <Pilcrow size={20} />
        </div>
        {headings.map((h, index) => {
          const Icon = icons[index]
          return (
            <div
              key={h}
              className="h-9 w-9 rounded-full border-2 border-foreground/10 flex items-center justify-center text-sm text-foreground/80 mr-4"
              onClick={() => setType(h)}
            >
              <Icon size={20} />
            </div>
          )
        })}
      </div>
      <div>
        <MenuItem
          icon={<CheckCircle size={20} />}
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

            // close()
          }}
        />

        <MenuItem
          icon={<ZoomIn size={20} />}
          label="Zoom in"
          onClick={() => {
            store.node.selectNode(bulletNode)
            close()
          }}
        />

        <MenuItem
          icon={<CircleArrowRight size={20} />}
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
          icon={<Trash2 size={20} />}
          label="Delete node"
          borderBottom-0
          onClick={() => {
            const path = findNodePath(editor, element)!
            Transforms.removeNodes(editor, { at: Path.parent(path) })
            close()
          }}
        />
      </div>
      {/* <AddTag></AddTag> */}
    </div>
  )
}
