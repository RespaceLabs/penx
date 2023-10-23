import { nanoid } from 'nanoid'
import { ELEMENT_P } from '@penx/constants'
import { INode, NodeStatus } from '@penx/types'

export function getNewNode(spaceId: string, text = ''): INode {
  return {
    id: nanoid(),
    spaceId,
    element: {
      type: ELEMENT_P,
      children: [{ text }],
    },
    status: NodeStatus.NORMAL,
    children: [],
    openedAt: Date.now(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}
