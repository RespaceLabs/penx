import { useEffect, useMemo } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { db } from '@penx/local-db'
import { Node, Page } from '@penx/model'
import { NodeListService } from '@penx/service'
import { nodesAtom, store } from '@penx/store'
import { useSpaces } from './useSpaces'

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
  const { activeSpace } = useSpaces()
  const nodeList = useMemo(() => {
    return new NodeListService(activeSpace, nodes)
  }, [activeSpace, nodes])

  return {
    nodeList,
    nodes: nodes.map((node) => new Node(node)),
  }
}
