import cloneDeep from 'lodash/cloneDeep'
import { Editor, Element, Node, NodeEntry, Transforms } from 'slate'
import { queryNode } from '@penx/editor-queries'
import { genId } from '@penx/editor-shared'

function setNodeId(node: Element) {
  if (node.type) {
    if (!node.id) node.id = genId()
  }
  if (node?.children?.length) node.children.forEach((n) => setNodeId(n as any))
}

const filterNode = (nodeEntry: NodeEntry<Node>) => {
  return nodeEntry[0]?.type !== undefined
}

// make all selected false
function resetAllSelected(editor: Editor) {
  Transforms.setNodes(
    editor,
    { selected: false },
    {
      at: [],
      match: (n: any) => !!n.selected,
    },
  )
}

export function withAutoNodeId(editor: Editor) {
  const { apply, elementMaps } = editor

  const query = {
    filter: filterNode,
    exclude: [],
  }

  editor.apply = (operation) => {
    if (operation.type === 'insert_node') {
      // clone to be able to write (read-only)
      let node = cloneDeep(operation.node) as Element

      resetAllSelected(editor)

      node.selected = true

      setNodeId(node)

      return apply({ ...operation, node })
    }

    if (operation.type === 'split_node') {
      const node = operation.properties as Node

      resetAllSelected(editor)

      if (queryNode([node, []], query)) {
        const { type } = operation.properties
        const el = editor.elementMaps[type]
        const node = {
          ...operation.properties,
          selected: true, // set new node to selected
          id: genId(), // auto id
        } as Element

        return apply({
          ...operation,
          properties: node,
        })
      }
    }

    return apply(operation)
  }

  return editor
}
