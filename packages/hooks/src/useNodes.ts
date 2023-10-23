import { useEffect } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { db } from '@penx/local-db'
import { Node, Page } from '@penx/model'
import { nodesAtom, store } from '@penx/store'
import { NodeStatus } from '@penx/types'

export function useQueryNodes(spaceId: string) {
  const setNodes = useSetAtom(nodesAtom)

  useEffect(() => {
    db.listNodesBySpaceId(spaceId).then((nodes) => {
      setNodes(nodes)
      // console.log('nodes:', nodes)

      if (!store.getNode()) {
        const normalNodes = nodes.filter(
          (node) => node.status === NodeStatus.NORMAL,
        )

        if (normalNodes.length) {
          const space = store.getSpaces().find((s) => s.id === spaceId)
          const activeNode =
            normalNodes.find((node) => node.id === space?.activeNodeId) ||
            normalNodes[0]

          store.setNode(activeNode)

          console.log('activeNode.children-----:', activeNode.children)

          const children = activeNode.children.map((id) => {
            // TODO: improve performance
            return normalNodes.find((n) => n.id === id)!
          })
          const page = new Page(activeNode, children, normalNodes)
          store.setPage(page)
        }
      }
    })
  }, [setNodes, spaceId])
}

export function useNodes() {
  const nodes = useAtomValue(nodesAtom)

  return {
    nodes: nodes.map((node) => new Node(node)),
  }
}
