import { useEffect, useMemo } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { db } from '@penx/local-db'
import { Node } from '@penx/model'
import { NodeListService } from '@penx/service'
import { nodesAtom, store } from '@penx/store'

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
