import { Node } from '@penx/model'
import { INode, ISpace } from '@penx/model-types'

export function getNodeMap(nodes: INode[], space: ISpace) {
  return nodes.reduce(
    (acc, cur) => {
      const node = new Node(cur)
      return {
        ...acc,
        [node.id]: node.toHash(space.encrypted, space.password),
      }
    },
    {} as Record<string, string>,
  )
}
