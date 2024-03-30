import { useMemo } from 'react'
import { useAtomValue } from 'jotai'
import { Node } from '@penx/model'
import { nodesAtom } from '@penx/store'
import { NodeListService } from './services/NodeListService'

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
