import { Node } from '@penx/model'
import { INode, ISpace } from '@penx/model-types'

export function getNodeMap(nodes: INode[]) {
  return nodes.reduce(
    (acc, cur) => {
      const node = new Node(cur)
      return {
        ...acc,
        [node.id]: node.toHash(),
      }
    },
    {} as Record<string, string>,
  )
}
