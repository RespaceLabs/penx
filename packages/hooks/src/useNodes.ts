import { useEffect, useMemo } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { db } from '@penx/local-db'
import { Node } from '@penx/model'
import { NodeListService } from '@penx/service'
import { nodesAtom, store } from '@penx/store'

export function useQueryNodes(spaceId: string) {
  const setNodes = useSetAtom(nodesAtom)

  useEffect(() => {
    db.listNormalNodes(spaceId).then((nodes) => {
      setNodes(nodes)
      // console.log('nodes:', nodes)

      if (!nodes.length) return

      const space = store.getSpaces().find((s) => s.id === spaceId)!

      const activeNodes = space.activeNodeIds.map((id) => {
        return nodes.find((n) => n.id === id)!
      })

      store.setNodes(nodes)
      store.setActiveNodes(activeNodes)
    })
  }, [setNodes, spaceId])
}

export function useNodes() {
  const nodes = useAtomValue(nodesAtom)

  const nodeList = useMemo(() => {
    return new NodeListService(nodes)
  }, [nodes])

  return {
    nodeList,
    nodes: nodes.map((node) => new Node(node)),
  }
}
