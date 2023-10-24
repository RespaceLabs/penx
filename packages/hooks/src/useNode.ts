import { useAtomValue } from 'jotai'
import { Node } from '@penx/model'
import { NodeService } from '@penx/service'
import { nodeAtom } from '@penx/store'
import { useNodes } from './useNodes'

export function useNode() {
  const node = useAtomValue(nodeAtom)
  const { nodes } = useNodes()

  const nodeService = new NodeService(new Node(node), nodes)

  return {
    node: new Node(node),
    nodeService,
  }
}
