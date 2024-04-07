import { Box } from '@fower/react'
import {
  CustomCell,
  CustomRenderer,
  drawTextCell,
  GridCellKind,
} from '@glideapps/glide-data-grid'
import { Node } from 'slate'
import { Bullet } from 'uikit'
import { Node as NodeModel } from '@penx/model'
import { EditorMode, ICellNode, IColumnNode } from '@penx/model-types'
import { NodeService } from '@penx/service'
import { store } from '@penx/store'
import { PrimaryCell } from '../Cell/PrimaryCell'

interface NoteCellProps {
  kind: 'note-cell'
  data: ICellNode
  column: IColumnNode
}

export type NoteCell = CustomCell<NoteCellProps>

const getTextFromChildren = (children: any[], renderTag: boolean) => {
  if (!renderTag) {
    const notRenderTagChildren = children.filter(
      (item: any) => item?.type !== 'tag',
    ) as { text: string; type?: string }[]
    return notRenderTagChildren.map((item) => item.text).join('')
  }

  return children.reduce((acc: string, child: any) => {
    if (child?.type === 'tag') {
      return acc + ('#' + child?.name || '')
    }
    return acc + Node.string(child)
  }, '')
}

export const generateNoteCellText = (ref: string, renderTag = true): string => {
  const node = store.node.getNode(ref)

  if (!node?.element) {
    return 'EMPTY'
  }

  const elements = Array.isArray(node.element) ? node.element : [node.element]

  const text = elements
    .map((element: any) => {
      if (Array.isArray(element.children)) {
        return getTextFromChildren(element.children, renderTag)
      } else {
        return Node.string(element)
      }
    })
    .join('')

  return text
}

export const noteCellRenderer: CustomRenderer<NoteCell> = {
  kind: GridCellKind.Custom,
  isMatch: (c): c is NoteCell => (c.data as any).kind === 'note-cell',
  draw: (args, cell) => {
    const cellNode = cell.data.data
    const { ref } = cellNode.props
    const text = generateNoteCellText(ref)
    drawTextCell(args, text)

    return true
  },
  provideEditor: () => ({
    editor: (p) => {
      const { value, onChange, onFinishedEditing } = p
      const { column, data: cellNode } = value.data
      let newValue = value

      async function clickBullet() {
        const node = store.node.getNode(cellNode.props.ref!)
        const space = store.space.getActiveSpace()
        const isOutliner = space.editorMode === EditorMode.OUTLINER
        if (isOutliner) {
          node && store.node.selectNode(node)
        } else {
          const nodes = store.node.getNodes()
          const nodeService = new NodeService(
            new NodeModel(node),
            nodes.map((n) => new NodeModel(n)),
          )
          const parentNodes = nodeService.getParentNodes()

          if (parentNodes[0].isDailyRoot) {
            store.node.selectNode(parentNodes[1].raw)
          } else {
            store.node.selectNode(parentNodes[0].raw)
          }
        }
      }
      return (
        <Box w-300 toCenterY>
          <Bullet
            dashed
            outlineColor="transparent"
            borderNeutral400
            style={{
              flexShrink: 0,
            }}
            onClick={(e) => {
              e.stopPropagation()
              clickBullet()
            }}
          />
          <PrimaryCell
            index={0}
            cell={cellNode}
            column={column}
            width={0}
            onChange={(element) => {
              let newElement = Array.isArray(element) ? element : [element]
              newValue = {
                ...value,
                data: {
                  ...value.data,
                  data: {
                    ...value.data.data,
                    element: newElement,
                  },
                },
              }

              onChange(newValue)
            }}
            onBlur={() => {
              onFinishedEditing(newValue)
            }}
            selected={false}
            updateCell={() => {}}
          />
        </Box>
      )
    },
  }),
}
