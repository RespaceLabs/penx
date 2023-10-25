import cloneDeep from 'lodash/cloneDeep'
import { BaseElement, Editor, Node, NodeEntry } from 'slate'
import { PenxEditor } from '@penx/editor-common'
import { queryNode } from '@penx/editor-queries'
import { genId } from '@penx/editor-shared'

interface IElement extends BaseElement {
  type: string
  id: string
}

function setNodeId(node: IElement) {
  if (node.type) {
    if (!node.id) node.id = genId()
  }
  if (node?.children?.length) node.children.forEach((n) => setNodeId(n as any))
}

const filterNode = (nodeEntry: NodeEntry<IElement>) => {
  return nodeEntry[0]?.type !== undefined
}

export function withAutoNodeId(editor: PenxEditor) {
  const { apply } = editor

  const query: any = {
    filter: filterNode,
    exclude: [],
  }

  editor.apply = (operation) => {
    if (operation.type === 'insert_node') {
      // clone to be able to write (read-only)
      let node = cloneDeep(operation.node) as IElement

      setNodeId(node)

      return apply({ ...operation, node })
    }

    if (operation.type === 'split_node') {
      const node = operation.properties as Node
      if (queryNode([node, []], query)) {
        const node = {
          ...operation.properties,
          id: genId(), // auto id
        } as IElement

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
