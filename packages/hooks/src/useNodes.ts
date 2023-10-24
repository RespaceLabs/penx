import { useEffect } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { db } from '@penx/local-db'
import { Node, Page } from '@penx/model'
import { nodesAtom, store } from '@penx/store'
import { NodeStatus } from '@penx/types'

export function useQueryNodes(spaceId: string) {
  const setNodes = useSetAtom(nodesAtom)

  useEffect(() => {
    db.listNormalNodes(spaceId).then((nodes) => {
      setNodes(nodes)
      // console.log('nodes:', nodes)

      if (store.getPage()) return
      if (!nodes.length) return

      const space = store.getSpaces().find((s) => s.id === spaceId)

      const activeNode =
        nodes.find((node) => node.id === space?.activeNodeId) || nodes[0]

      const page = new Page(activeNode, nodes)
      store.setPage(page)
    })
  }, [setNodes, spaceId])
}

export function useNodes() {
  const nodes = useAtomValue(nodesAtom)

  return {
    nodes: nodes.map((node) => new Node(node)),
  }
}
