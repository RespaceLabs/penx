import isEqual from 'react-fast-compare'
import { INode } from '@penx/model-types'

function isNodeEqual(a: INode, b: INode) {
  return (
    isEqual(a.id, b.id) &&
    isEqual(a.parentId, b.parentId) &&
    isEqual(a.databaseId, b.databaseId) &&
    isEqual(a.type, b.type) &&
    isEqual(a.props, b.props) &&
    isEqual(a.collapsed, b.collapsed) &&
    isEqual(a.folded, b.folded) &&
    isEqual(a.children, b.children) &&
    isEqual(a.element, b.element)
  )
}

// TODO: need improve performance
export function diffNodes(oldNodes: INode[], newNodes: INode[]) {
  const added: INode[] = []
  const updated: INode[] = []
  const deleted: INode[] = []

  for (const b of newNodes) {
    const a = oldNodes.find((n) => n.id === b.id)
    if (!a) {
      added.push(b)
      continue
    }

    // should custom isEqual
    if (!isNodeEqual(a, b)) {
      updated.push(b)
      continue
    }
  }

  for (const a of oldNodes) {
    const b = newNodes.find((n) => n.id === a.id)
    if (!b) {
      deleted.push(a)
      continue
    }
  }
  return { added, updated, deleted }
}
