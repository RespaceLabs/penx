import cloneDeep from 'lodash/cloneDeep'
import { Element, Node, NodeEntry } from 'slate'
import { PenxEditor } from '@penx/editor-common'
import { queryNode } from '@penx/editor-queries'
import { uniqueId } from '@penx/unique-id'

function setNodeId(node: any) {
  if (node.type) {
    if (!node.id) node.id = uniqueId()
  }

  if (node?.children?.length) {
    node.children.forEach((n: any) => setNodeId(n as any))
  }
}

const filterNode = (nodeEntry: NodeEntry<any>) => {
  return nodeEntry[0]?.type !== undefined
}

export function withAutoNodeId(editor: PenxEditor) {
  const { apply } = editor

  const query = {
    filter: filterNode,
    exclude: [],
  }

  editor.apply = (operation) => {
    if (operation.type === 'insert_node') {
      // clone to be able to write (read-only)
      let node = cloneDeep(operation.node) as Element

      setNodeId(node)

      return apply({ ...operation, node })
    }

    if (operation.type === 'split_node') {
      const node = operation.properties as Node

      if (queryNode([node, []], query)) {
        const { type } = operation.properties as any
        const node = {
          ...operation.properties,
          id: uniqueId(), // auto id
        } as any

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
